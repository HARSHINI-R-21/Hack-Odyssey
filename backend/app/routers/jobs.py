from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.models import Job, JobSkill, Skill, User, UserRole, StudentProfile
from app.routers.auth import get_current_user
from app.schemas.schemas import JobCreate, JobResponse, JobMatchResponse
from app.engines.evidence import get_student_verified_skills
from app.ai.gemini_service import extract_skills_from_text

router = APIRouter(prefix="/jobs", tags=["Jobs & Matching"])

def calculate_job_match(db: Session, student_id: int, job: Job) -> Dict[str, Any]:
    verified_skills = get_student_verified_skills(db, student_id)
    job_skills = db.query(JobSkill).filter(JobSkill.job_id == job.id).all()

    if not job_skills:
        return {
            "match_score": 75.0,
            "why_you_match": ["General engineering alignment"],
            "skills_to_improve": [],
            "readiness_level": "Good Fit"
        }

    total_weight = 0.0
    weighted_score = 0.0
    why_match = []
    to_improve = []

    for js in job_skills:
        skill_id = js.skill_id
        skill_name = js.skill.name if js.skill else "Skill"
        req_level = float(js.required_level)
        importance = js.importance or "High"

        w = 1.0 if importance == "High" else (0.7 if importance == "Medium" else 0.5)
        total_weight += w

        stud_skill = verified_skills.get(skill_id)
        current_prof = float(stud_skill["proficiency"]) if stud_skill else 0.0
        conf = stud_skill["confidence"] if stud_skill else "Low"

        ratio = min(1.0, current_prof / req_level) if req_level > 0 else 1.0
        weighted_score += (ratio * w)

        if current_prof >= req_level or (current_prof >= req_level - 10 and conf in ["High", "Medium"]):
            why_match.append(f"{skill_name} – Verified proficiency ({current_prof:.0f}% vs {req_level:.0f}% required)")
        else:
            to_improve.append(f"{skill_name} – Current {current_prof:.0f}% (Target: {req_level:.0f}%)")

    final_match = round((weighted_score / total_weight) * 100, 1) if total_weight > 0 else 0.0

    if final_match >= 85:
        level = "Strong Match"
    elif final_match >= 70:
        level = "Good Match"
    else:
        level = "Skill Gap Identified"

    return {
        "match_score": final_match,
        "why_you_match": why_match,
        "skills_to_improve": to_improve,
        "readiness_level": level
    }

@router.get("", response_model=List[Dict[str, Any]])
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    result = []
    for job in jobs:
        sk_list = []
        for js in job.job_skills:
            sk_list.append({
                "skill_id": js.skill_id,
                "skill_name": js.skill.name if js.skill else "Skill",
                "required_level": js.required_level,
                "importance": js.importance
            })
        result.append({
            "id": job.id,
            "recruiter_id": job.recruiter_id,
            "title": job.title,
            "company": job.company,
            "description": job.description,
            "location": job.location,
            "experience_level": job.experience_level,
            "status": job.status,
            "created_at": job.created_at,
            "skills": sk_list
        })
    return result

@router.post("", response_model=Dict[str, Any])
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.RECRUITER and current_user.role != UserRole.INSTITUTION:
        raise HTTPException(status_code=403, detail="Only recruiters or institutions can post jobs")

    job = Job(
        recruiter_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        location=job_in.location,
        experience_level=job_in.experience_level,
        status="OPEN"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Process skills
    if job_in.skills:
        for sk in job_in.skills:
            js = JobSkill(job_id=job.id, skill_id=sk.skill_id, required_level=sk.required_level, importance=sk.importance)
            db.add(js)
    else:
        # Auto extract skills from description
        extracted_names, _ = extract_skills_from_text(job_in.description)
        for sname in extracted_names:
            sk_obj = db.query(Skill).filter(Skill.name.ilike(f"%{sname}%")).first()
            if sk_obj:
                js = JobSkill(job_id=job.id, skill_id=sk_obj.id, required_level=75.0, importance="High")
                db.add(js)

    db.commit()
    return {"message": "Job created successfully", "job_id": job.id}

@router.get("/{job_id}", response_model=Dict[str, Any])
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    sk_list = []
    for js in job.job_skills:
        sk_list.append({
            "skill_id": js.skill_id,
            "skill_name": js.skill.name if js.skill else "Skill",
            "required_level": js.required_level,
            "importance": js.importance
        })

    return {
        "id": job.id,
        "recruiter_id": job.recruiter_id,
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "location": job.location,
        "experience_level": job.experience_level,
        "status": job.status,
        "created_at": job.created_at,
        "skills": sk_list
    }

@router.get("/{job_id}/matches", response_model=List[Dict[str, Any]])
def get_job_candidate_matches(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    students = db.query(StudentProfile).all()
    matches = []

    for stud in students:
        match_info = calculate_job_match(db, stud.id, job)
        verified_sk = get_student_verified_skills(db, stud.id)
        
        matches.append({
            "student_id": stud.id,
            "student_name": stud.user.name if stud.user else "Student",
            "college": stud.college,
            "degree": stud.degree,
            "branch": stud.branch,
            "match_score": match_info["match_score"],
            "readiness_level": match_info["readiness_level"],
            "why_you_match": match_info["why_you_match"],
            "skills_to_improve": match_info["skills_to_improve"],
            "verified_skills_count": len(verified_sk)
        })

    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return matches

@router.get("/me/job-matches", response_model=List[Dict[str, Any]])
def get_my_job_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []

    jobs = db.query(Job).all()
    results = []

    for job in jobs:
        match_info = calculate_job_match(db, profile.id, job)
        sk_list = [{
            "skill_name": js.skill.name if js.skill else "Skill",
            "required_level": js.required_level
        } for js in job.job_skills]

        results.append({
            "job": {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "experience_level": job.experience_level,
                "description": job.description,
                "skills": sk_list
            },
            "match_score": match_info["match_score"],
            "why_you_match": match_info["why_you_match"],
            "skills_to_improve": match_info["skills_to_improve"],
            "readiness_level": match_info["readiness_level"]
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results
