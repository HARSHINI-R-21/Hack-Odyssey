from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.models import Application, Job, StudentProfile, User, ApplicationStatus
from app.routers.auth import get_current_user
from app.routers.jobs import calculate_job_match

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/jobs/{job_id}/apply", response_model=Dict[str, Any])
def apply_to_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Only students can apply to jobs")

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(Application).filter(
        Application.student_id == profile.id,
        Application.job_id == job.id
    ).first()

    if existing:
        return {
            "message": "Application already exists",
            "application_id": existing.id,
            "status": existing.status.value if hasattr(existing.status, 'value') else str(existing.status)
        }

    app = Application(
        student_id=profile.id,
        job_id=job.id,
        status=ApplicationStatus.APPLIED
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    return {
        "message": f"Successfully applied to {job.title} at {job.company}",
        "application_id": app.id,
        "status": app.status.value if hasattr(app.status, 'value') else str(app.status)
    }

@router.get("", response_model=List[Dict[str, Any]])
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "STUDENT":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if not profile:
            return []
        apps = db.query(Application).filter(Application.student_id == profile.id).all()
    else:
        # Recruiter or Institution
        apps = db.query(Application).all()

    result = []
    for app in apps:
        match_info = calculate_job_match(db, app.student_id, app.job) if app.job else {"match_score": 75.0}
        fb_text = app.feedback.feedback_text if app.feedback else None
        ext_skills = app.feedback.extracted_skills if app.feedback else []

        result.append({
            "id": app.id,
            "student_id": app.student_id,
            "student_name": app.student.user.name if app.student and app.student.user else "Student",
            "job_id": app.job_id,
            "job_title": app.job.title if app.job else "Job",
            "company": app.job.company if app.job else "Company",
            "status": app.status.value if hasattr(app.status, 'value') else str(app.status),
            "applied_at": app.applied_at,
            "match_score": match_info["match_score"],
            "feedback_text": fb_text,
            "extracted_skills": ext_skills
        })

    return result
