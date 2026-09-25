from sqlalchemy.orm import Session
from app.models.models import (
    Application, RecruiterFeedback, Roadmap, RoadmapItem, Skill, PriorityLevel, RoadmapItemStatus, LearningResource
)
from app.engines.readiness import calculate_role_readiness
from app.ai.gemini_service import extract_skills_from_text

def process_recruiter_feedback(db: Session, application_id: int, feedback_text: str):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        return None

    student = app.student
    if not student or not student.target_role_id:
        return None

    # Step 1: Extract skills from feedback text (via Gemini or fallback)
    extracted_skill_names, source = extract_skills_from_text(feedback_text)
    
    # Store feedback record
    feedback = db.query(RecruiterFeedback).filter(RecruiterFeedback.application_id == application_id).first()
    if not feedback:
        feedback = RecruiterFeedback(
            application_id=application_id,
            feedback_text=feedback_text,
            extracted_skills=extracted_skill_names
        )
        db.add(feedback)
    else:
        feedback.feedback_text = feedback_text
        feedback.extracted_skills = extracted_skill_names
    db.commit()

    # Step 2: Get or create active roadmap for student
    roadmap = db.query(Roadmap).filter(
        Roadmap.student_id == student.id,
        Roadmap.role_id == student.target_role_id
    ).first()

    if not roadmap:
        roadmap = Roadmap(
            student_id=student.id,
            role_id=student.target_role_id,
            readiness_score=0.0
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

    # Step 3: Match extracted skill names to DB skills and update/insert roadmap items
    updated_items = []
    for s_name in extracted_skill_names:
        db_skill = db.query(Skill).filter(Skill.name.ilike(f"%{s_name}%")).first()
        if not db_skill:
            continue

        # Check existing item
        item = db.query(RoadmapItem).filter(
            RoadmapItem.roadmap_id == roadmap.id,
            RoadmapItem.skill_id == db_skill.id
        ).first()

        # Find best learning resource for this skill
        resource = db.query(LearningResource).filter(LearningResource.skill_id == db_skill.id).first()
        resource_id = resource.id if resource else None

        if not item:
            item = RoadmapItem(
                roadmap_id=roadmap.id,
                skill_id=db_skill.id,
                priority=PriorityLevel.HIGH,
                status=RoadmapItemStatus.NOT_STARTED,
                recommended_action=f"Recruiter Feedback Priority: Improve {db_skill.name} practical knowledge",
                resource_id=resource_id
            )
            db.add(item)
        else:
            item.priority = PriorityLevel.HIGH
            item.recommended_action = f"Updated via Recruiter Feedback: Master {db_skill.name}"
            if item.status == RoadmapItemStatus.COMPLETED:
                item.status = RoadmapItemStatus.IN_PROGRESS
        
        updated_items.append(db_skill.name)

    db.commit()

    # Step 4: Recalculate readiness
    readiness_data = calculate_role_readiness(db, student.id, student.target_role_id)
    if readiness_data:
        roadmap.readiness_score = readiness_data["overall_readiness"]
        db.commit()

    return {
        "application_id": application_id,
        "extracted_skills": extracted_skill_names,
        "extraction_source": source,
        "adapted_roadmap_items": updated_items,
        "new_readiness_score": roadmap.readiness_score
    }
