from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "STUDENT"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Skill & Role Schemas ---
class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True

class RoleSkillBase(BaseModel):
    skill_id: int
    required_level: float
    importance: str

class RoleSkillResponse(RoleSkillBase):
    id: int
    skill: SkillResponse

    class Config:
        from_attributes = True

class RoleResponse(BaseModel):
    id: int
    name: str
    domain: str
    description: Optional[str] = None
    role_skills: List[RoleSkillResponse] = []

    class Config:
        from_attributes = True

# --- Student Profile & Evidence Schemas ---
class SkillEvidenceResponse(BaseModel):
    id: int
    skill_id: int
    skill_name: str
    evidence_type: str
    title: str
    source: str
    proficiency: float
    confidence: str
    verification_status: str
    created_at: datetime

class StudentProfileBase(BaseModel):
    college: Optional[str] = "ABC Engineering College"
    degree: Optional[str] = "B.Tech"
    branch: Optional[str] = "Computer Science Engineering"
    graduation_year: Optional[int] = 2026
    interests: Optional[str] = None
    preferred_domain: Optional[str] = "Software Development"
    target_role_id: Optional[int] = None

class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    user_name: str
    user_email: str
    target_role: Optional[RoleResponse] = None

    class Config:
        from_attributes = True

# --- Readiness & Skill Gap Schemas ---
class SkillGapItem(BaseModel):
    skill_id: int
    skill_name: str
    required_level: float
    current_proficiency: float
    gap: float
    priority: str
    importance: str
    confidence: str
    evidence_count: int
    evidence_types: List[str]

class ReadinessAnalysis(BaseModel):
    target_role: str
    overall_readiness: float
    strong_skills_count: int
    gap_skills_count: int
    highest_impact_gap: Optional[str]
    gaps: List[SkillGapItem]

# --- Roadmap Schemas ---
class LearningResourceResponse(BaseModel):
    id: int
    skill_id: int
    title: str
    provider: str
    url: Optional[str]
    difficulty: str
    estimated_hours: int

    class Config:
        from_attributes = True

class RoadmapItemResponse(BaseModel):
    id: int
    roadmap_id: int
    skill_id: int
    skill_name: str
    priority: str
    status: str
    recommended_action: Optional[str]
    resource: Optional[LearningResourceResponse]

class RoadmapResponse(BaseModel):
    id: int
    student_id: int
    role_id: int
    role_name: str
    readiness_score: float
    items: List[RoadmapItemResponse]
    updated_at: datetime

# --- Job & Application Schemas ---
class JobSkillCreate(BaseModel):
    skill_id: int
    required_level: float = 70.0
    importance: str = "High"

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    location: str = "Remote"
    experience_level: str = "Entry Level"
    skills: List[JobSkillCreate] = []

class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    company: str
    description: str
    location: str
    experience_level: str
    status: str
    created_at: datetime
    skills: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class JobMatchResponse(BaseModel):
    job: JobResponse
    match_score: float
    why_you_match: List[str]
    skills_to_improve: List[str]
    readiness_level: str

class ApplicationCreate(BaseModel):
    job_id: int

class RecruiterFeedbackCreate(BaseModel):
    feedback_text: str
    updated_status: Optional[str] = "UNDER_REVIEW"

class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    student_name: str
    job_id: int
    job_title: str
    company: str
    status: str
    applied_at: datetime
    match_score: Optional[float] = 0.0
    feedback_text: Optional[str] = None
    extracted_skills: Optional[List[str]] = []

# --- Assessment Schemas ---
class AssessmentSubmit(BaseModel):
    answers: Dict[str, Any]

class AssessmentResponse(BaseModel):
    recommended_domain: str
    recommended_roles: List[str]
    explanation: str
    scores: Dict[str, float]

# --- AI & Skill Extraction Schemas ---
class SkillExtractRequest(BaseModel):
    text: str

class SkillExtractResponse(BaseModel):
    extracted_skills: List[str]
    source: str

class ResumeTailorRequest(BaseModel):
    job_id: int

class ResumeTailorResponse(BaseModel):
    tailored_summary: str
    emphasized_skills: List[str]
    matching_projects: List[str]
