import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON, Boolean
)
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    RECRUITER = "RECRUITER"
    INSTITUTION = "INSTITUTION"

class ApplicationStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    UNDER_REVIEW = "UNDER_REVIEW"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW = "INTERVIEW"
    SELECTED = "SELECTED"
    REJECTED = "REJECTED"

class RoadmapItemStatus(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class PriorityLevel(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.STUDENT)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    college = Column(String(255), default="ABC Engineering College")
    degree = Column(String(255), default="B.Tech")
    branch = Column(String(255), default="Computer Science Engineering")
    graduation_year = Column(Integer, default=2026)
    interests = Column(Text, nullable=True)
    preferred_domain = Column(String(255), default="Software Development")
    target_role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)

    user = relationship("User", back_populates="student_profile")
    target_role = relationship("Role", foreign_keys=[target_role_id])
    evidences = relationship("SkillEvidence", back_populates="student", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="student", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False, default="Technical")
    description = Column(Text, nullable=True)

    role_skills = relationship("RoleSkill", back_populates="skill")
    evidences = relationship("SkillEvidence", back_populates="skill")
    resources = relationship("LearningResource", back_populates="skill")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    domain = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    role_skills = relationship("RoleSkill", back_populates="role", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="role")

class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_level = Column(Float, default=70.0)  # 0 to 100
    importance = Column(String(50), default="High")  # High, Medium, Low

    role = relationship("Role", back_populates="role_skills")
    skill = relationship("Skill", back_populates="role_skills")

class SkillDependency(Base):
    __tablename__ = "skill_dependencies"

    id = Column(Integer, primary_key=True, index=True)
    prerequisite_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    dependent_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    prerequisite = relationship("Skill", foreign_keys=[prerequisite_skill_id])
    dependent = relationship("Skill", foreign_keys=[dependent_skill_id])

class SkillEvidence(Base):
    __tablename__ = "skill_evidences"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    evidence_type = Column(String(100), nullable=False)  # Course, Project, Assessment, Certificate
    title = Column(String(255), nullable=False)
    source = Column(String(255), default="SkillBridge Verifier")
    proficiency = Column(Float, default=50.0)  # 0 to 100
    confidence = Column(String(50), default="Medium")  # High, Medium, Low
    verification_status = Column(String(50), default="VERIFIED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="evidences")
    skill = relationship("Skill", back_populates="evidences")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    score = Column(Float, nullable=False)
    details = Column(JSON, nullable=True)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="assessments")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(String(255), nullable=True)
    repository_url = Column(String(255), nullable=True)

    student = relationship("StudentProfile", back_populates="projects")

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    title = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    issue_date = Column(String(50), nullable=True)
    credential_url = Column(String(255), nullable=True)

    student = relationship("StudentProfile", back_populates="certificates")

class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String(255), nullable=False)
    provider = Column(String(255), nullable=False)
    url = Column(String(255), nullable=True)
    difficulty = Column(String(50), default="Intermediate")
    estimated_hours = Column(Integer, default=10)

    skill = relationship("Skill", back_populates="resources")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    readiness_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="roadmaps")
    role = relationship("Role", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    priority = Column(SQLEnum(PriorityLevel), default=PriorityLevel.MEDIUM)
    status = Column(SQLEnum(RoadmapItemStatus), default=RoadmapItemStatus.NOT_STARTED)
    recommended_action = Column(String(255), nullable=True)
    resource_id = Column(Integer, ForeignKey("learning_resources.id"), nullable=True)

    roadmap = relationship("Roadmap", back_populates="items")
    skill = relationship("Skill")
    resource = relationship("LearningResource")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), default="Remote")
    experience_level = Column(String(100), default="Entry Level")
    status = Column(String(50), default="OPEN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    recruiter = relationship("User", back_populates="jobs")
    job_skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_level = Column(Float, default=70.0)
    importance = Column(String(50), default="High")

    job = relationship("Job", back_populates="job_skills")
    skill = relationship("Skill")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.APPLIED)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    feedback = relationship("RecruiterFeedback", back_populates="application", uselist=False, cascade="all, delete-orphan")

class RecruiterFeedback(Base):
    __tablename__ = "recruiter_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    feedback_text = Column(Text, nullable=False)
    extracted_skills = Column(JSON, nullable=True)  # List of skill names extracted
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="feedback")
