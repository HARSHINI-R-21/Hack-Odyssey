from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, StudentProfile, Role
from app.routers.auth import get_current_user
from app.schemas.schemas import ReadinessAnalysis
from app.engines.readiness import calculate_role_readiness

router = APIRouter(prefix="", tags=["Readiness & Gaps"])

@router.get("/readiness", response_model=ReadinessAnalysis)
def get_student_readiness(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile or not profile.target_role_id:
        # Default to Backend Developer if not set
        role = db.query(Role).filter(Role.name == "Backend Developer").first()
        target_role_id = role.id if role else 1
    else:
        target_role_id = profile.target_role_id

    analysis = calculate_role_readiness(db, profile.id if profile else 1, target_role_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Target role not found for readiness analysis")

    return analysis

@router.get("/skill-gaps", response_model=dict)
def get_student_skill_gaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile or not profile.target_role_id:
        role = db.query(Role).filter(Role.name == "Backend Developer").first()
        target_role_id = role.id if role else 1
    else:
        target_role_id = profile.target_role_id

    analysis = calculate_role_readiness(db, profile.id if profile else 1, target_role_id)
    gaps_only = [g for g in analysis["gaps"] if g["gap"] > 0]
    
    return {
        "target_role": analysis["target_role"],
        "total_gaps": len(gaps_only),
        "highest_impact_gap": analysis["highest_impact_gap"],
        "gaps": sorted(gaps_only, key=lambda x: x["gap"], reverse=True)
    }
