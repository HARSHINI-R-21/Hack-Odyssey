import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import (
    User, StudentProfile, Role, Roadmap, RoadmapItem, RoadmapItemStatus,
    SkillEvidence, LearningResource, PriorityLevel
)
from app.routers.auth import get_current_user
from app.engines.readiness import calculate_role_readiness
from app.engines.evidence import get_student_verified_skills

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("", response_model=dict)
def get_student_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()

    if not profile.target_role_id:
        role = db.query(Role).filter(Role.name == "Backend Developer").first()
        profile.target_role_id = role.id if role else 1
        db.commit()

    roadmap = db.query(Roadmap).filter(
        Roadmap.student_id == profile.id,
        Roadmap.role_id == profile.target_role_id
    ).first()

    readiness = calculate_role_readiness(db, profile.id, profile.target_role_id)

    if not roadmap:
        roadmap = Roadmap(
            student_id=profile.id,
            role_id=profile.target_role_id,
            readiness_score=readiness["overall_readiness"] if readiness else 76.0
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

        # Build initial roadmap items for gaps
        if readiness:
            for gap in sorted(readiness["gaps"], key=lambda x: x["gap"], reverse=True):
                if gap["gap"] > 0:
                    res = db.query(LearningResource).filter(LearningResource.skill_id == gap["skill_id"]).first()
                    prio = PriorityLevel.HIGH if gap["priority"] == "High" else (PriorityLevel.MEDIUM if gap["priority"] == "Medium" else PriorityLevel.LOW)
                    item = RoadmapItem(
                        roadmap_id=roadmap.id,
                        skill_id=gap["skill_id"],
                        priority=prio,
                        status=RoadmapItemStatus.NOT_STARTED,
                        recommended_action=f"Complete {gap['skill_name']} module to reduce gap of {gap['gap']}%",
                        resource_id=res.id if res else None
                    )
                    db.add(item)
            db.commit()

    # Format response
    items_data = []
    for item in db.query(RoadmapItem).filter(RoadmapItem.roadmap_id == roadmap.id).all():
        res_info = None
        if item.resource:
            res_info = {
                "id": item.resource.id,
                "skill_id": item.resource.skill_id,
                "title": item.resource.title,
                "provider": item.resource.provider,
                "url": item.resource.url,
                "difficulty": item.resource.difficulty,
                "estimated_hours": item.resource.estimated_hours
            }
        items_data.append({
            "id": item.id,
            "roadmap_id": item.roadmap_id,
            "skill_id": item.skill_id,
            "skill_name": item.skill.name if item.skill else "Skill",
            "priority": item.priority.value if hasattr(item.priority, 'value') else str(item.priority),
            "status": item.status.value if hasattr(item.status, 'value') else str(item.status),
            "recommended_action": item.recommended_action,
            "resource": res_info
        })

    return {
        "id": roadmap.id,
        "student_id": profile.id,
        "role_id": profile.target_role_id,
        "role_name": profile.target_role.name if profile.target_role else "Target Role",
        "readiness_score": readiness["overall_readiness"] if readiness else 76.0,
        "items": items_data,
        "updated_at": roadmap.updated_at
    }

@router.post("/items/{item_id}/complete", response_model=dict)
def mark_roadmap_item_complete(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    item = db.query(RoadmapItem).filter(RoadmapItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    item.status = RoadmapItemStatus.COMPLETED
    skill = item.skill

    # 1. Check existing evidence or create new completed project/course evidence
    existing_ev = db.query(SkillEvidence).filter(
        SkillEvidence.student_id == profile.id,
        SkillEvidence.skill_id == skill.id,
        SkillEvidence.evidence_type == "Adaptive Learning"
    ).first()

    if existing_ev:
        existing_ev.proficiency = min(100.0, existing_ev.proficiency + 25.0)
        existing_ev.confidence = "High"
    else:
        new_ev = SkillEvidence(
            student_id=profile.id,
            skill_id=skill.id,
            evidence_type="Adaptive Learning",
            title=f"Completed {skill.name} Mastery Module",
            source="SkillBridge Roadmap Verification",
            proficiency=85.0,
            confidence="High",
            verification_status="VERIFIED"
        )
        db.add(new_ev)

    db.commit()

    # 2. Recalculate readiness
    readiness = calculate_role_readiness(db, profile.id, profile.target_role_id)
    if readiness and item.roadmap:
        item.roadmap.readiness_score = readiness["overall_readiness"]
        item.roadmap.updated_at = datetime.datetime.utcnow()
        db.commit()

    return {
        "message": f"Successfully completed {skill.name} learning task!",
        "skill_name": skill.name,
        "new_proficiency": 85.0,
        "updated_readiness_score": readiness["overall_readiness"] if readiness else 80.0
    }
