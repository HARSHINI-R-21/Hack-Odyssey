from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import get_db
from app.models.models import Job, StudentProfile, User, Project
from app.routers.auth import get_current_user
from app.schemas.schemas import SkillExtractRequest, SkillExtractResponse, ResumeTailorRequest, ResumeTailorResponse
from app.ai.gemini_service import extract_skills_from_text, tailor_resume_content
from app.engines.evidence import get_student_verified_skills

router = APIRouter(prefix="/ai", tags=["AI Integration"])

@router.post("/extract-skills", response_model=SkillExtractResponse)
def extract_skills_endpoint(req: SkillExtractRequest):
    if not req.text:
        return {"extracted_skills": [], "source": "None"}
    skills, source = extract_skills_from_text(req.text)
    return {"extracted_skills": skills, "source": source}

@router.post("/tailor-resume", response_model=ResumeTailorResponse)
def tailor_resume_endpoint(
    req: ResumeTailorRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    verified_sk = get_student_verified_skills(db, profile.id)
    skill_names = [v["skill_name"] for v in verified_sk.values()]

    projects = db.query(Project).filter(Project.student_id == profile.id).all()
    proj_list = [{"title": p.title, "description": p.description, "technologies": p.technologies} for p in projects]

    res = tailor_resume_content(job.title, job.description, skill_names, proj_list)

    return {
        "tailored_summary": res["tailored_summary"],
        "emphasized_skills": res["emphasized_skills"],
        "matching_projects": res["matching_projects"]
    }
