from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, StudentProfile, Role
from app.routers.auth import get_current_user
from app.schemas.schemas import StudentProfileResponse, StudentProfileBase

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/me", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "id": profile.id,
        "user_id": current_user.id,
        "user_name": current_user.name,
        "user_email": current_user.email,
        "college": profile.college,
        "degree": profile.degree,
        "branch": profile.branch,
        "graduation_year": profile.graduation_year,
        "interests": profile.interests,
        "preferred_domain": profile.preferred_domain,
        "target_role_id": profile.target_role_id,
        "target_role": profile.target_role
    }

@router.put("/me", response_model=StudentProfileResponse)
def update_student_profile(
    profile_in: StudentProfileBase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
    
    for key, value in profile_in.dict(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return {
        "id": profile.id,
        "user_id": current_user.id,
        "user_name": current_user.name,
        "user_email": current_user.email,
        "college": profile.college,
        "degree": profile.degree,
        "branch": profile.branch,
        "graduation_year": profile.graduation_year,
        "interests": profile.interests,
        "preferred_domain": profile.preferred_domain,
        "target_role_id": profile.target_role_id,
        "target_role": profile.target_role
    }
