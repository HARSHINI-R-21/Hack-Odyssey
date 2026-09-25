from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Skill, StudentProfile, SkillEvidence, User
from app.routers.auth import get_current_user
from app.schemas.schemas import SkillResponse, SkillEvidenceResponse
from app.engines.evidence import get_student_verified_skills

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillResponse])
def get_all_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@router.get("/me", response_model=dict)
def get_my_verified_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return {}
    return get_student_verified_skills(db, profile.id)

@router.get("/me/evidence", response_model=List[SkillEvidenceResponse])
def get_my_evidence_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []
    evidences = db.query(SkillEvidence).filter(SkillEvidence.student_id == profile.id).all()
    return [
        {
            "id": ev.id,
            "skill_id": ev.skill_id,
            "skill_name": ev.skill.name if ev.skill else "Skill",
            "evidence_type": ev.evidence_type,
            "title": ev.title,
            "source": ev.source,
            "proficiency": ev.proficiency,
            "confidence": ev.confidence,
            "verification_status": ev.verification_status,
            "created_at": ev.created_at
        } for ev in evidences
    ]
