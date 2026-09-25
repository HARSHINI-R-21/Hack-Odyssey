from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import get_db
from app.models.models import Application, User, UserRole, ApplicationStatus
from app.routers.auth import get_current_user
from app.schemas.schemas import RecruiterFeedbackCreate
from app.engines.feedback import process_recruiter_feedback

router = APIRouter(prefix="/applications", tags=["Feedback Loop"])

@router.post("/{application_id}/feedback", response_model=Dict[str, Any])
def submit_recruiter_feedback(
    application_id: int,
    fb_in: RecruiterFeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.RECRUITER and current_user.role != UserRole.INSTITUTION:
        raise HTTPException(status_code=403, detail="Only recruiters or institutions can provide feedback")

    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if fb_in.updated_status:
        try:
            app.status = ApplicationStatus(fb_in.updated_status)
        except Exception:
            app.status = ApplicationStatus.UNDER_REVIEW
        db.commit()

    result = process_recruiter_feedback(db, application_id, fb_in.feedback_text)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to process feedback and update student roadmap")

    return {
        "message": "Recruiter feedback processed successfully. Student roadmap and readiness score updated.",
        "details": result
    }
