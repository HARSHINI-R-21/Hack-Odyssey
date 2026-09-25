import datetime
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import engine, Base, SessionLocal
from app.models.models import (
    User, UserRole, StudentProfile, Skill, Role, RoleSkill, SkillDependency,
    SkillEvidence, Assessment, Project, Certificate, LearningResource,
    Roadmap, RoadmapItem, Job, JobSkill, Application, RecruiterFeedback,
    PriorityLevel, RoadmapItemStatus, ApplicationStatus
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    print("Seeding SkillBridge database...")

    # 1. Demo Users
    student_user = User(
        name="Arun Kumar",
        email="student@skillbridge.demo",
        password_hash=pwd_context.hash("Student@123"),
        role=UserRole.STUDENT
    )
    recruiter_user = User(
        name="Priya Sharma",
        email="recruiter@skillbridge.demo",
        password_hash=pwd_context.hash("Recruiter@123"),
        role=UserRole.RECRUITER
    )
    institution_user = User(
        name="ABC Engineering College",
        email="college@skillbridge.demo",
        password_hash=pwd_context.hash("College@123"),
        role=UserRole.INSTITUTION
    )

    db.add_all([student_user, recruiter_user, institution_user])
    db.commit()

    # Additional Demo Students
    other_students = [
        ("Rahul Verma", "rahul@skillbridge.demo", "Frontend Developer"),
        ("Neha Gupta", "neha@skillbridge.demo", "Data Analyst"),
        ("Siddharth Patel", "sid@skillbridge.demo", "Full Stack Developer"),
        ("Ananya Rao", "ananya@skillbridge.demo", "AI/ML Engineer"),
        ("Vikram Singh", "vikram@skillbridge.demo", "Cloud Engineer"),
        ("Kavya Nair", "kavya@skillbridge.demo", "Cybersecurity Analyst"),
        ("Rohan Joshi", "rohan@skillbridge.demo", "Backend Developer"),
        ("Pooja Shah", "pooja@skillbridge.demo", "UI/UX Designer"),
        ("Amit Sharma", "amit@skillbridge.demo", "Full Stack Developer")
    ]
    for name, email, pref_role in other_students:
        u = User(name=name, email=email, password_hash=pwd_context.hash("Student@123"), role=UserRole.STUDENT)
        db.add(u)
    db.commit()

    # 2. Skills
    skills_data = [
        ("Python", "Programming Language", "Core general-purpose language for backend & data science."),
        ("SQL", "Database", "Structured Query Language for relational database management."),
        ("Git", "Tools & Version Control", "Distributed version control system for source code."),
        ("Django", "Backend Framework", "High-level Python web framework for modern web development."),
        ("REST API", "Web Services", "Representational State Transfer API architecture."),
        ("PostgreSQL", "Database", "Advanced open-source relational database system."),
        ("Docker", "DevOps & Cloud", "Containerization platform for application deployment."),
        ("React", "Frontend", "Declarative component-based UI library for web interfaces."),
        ("TypeScript", "Programming Language", "Typed superset of JavaScript for robust frontend applications."),
        ("JavaScript", "Programming Language", "Core language of the web for interactive user interfaces."),
        ("FastAPI", "Backend Framework", "Modern high-performance Python framework for building REST APIs."),
        ("Machine Learning", "AI & Data Science", "Predictive modeling and machine learning algorithms."),
        ("Data Analysis", "AI & Data Science", "Data manipulation and visualization with Python."),
        ("AWS", "Cloud Computing", "Amazon Web Services cloud infrastructure platform."),
        ("Cybersecurity", "Security", "Network security, cryptography, and application security.")
    ]
    
    skill_objs = {}
    for sname, cat, desc in skills_data:
        sk = Skill(name=sname, category=cat, description=desc)
        db.add(sk)
        db.commit()
        db.refresh(sk)
        skill_objs[sname] = sk

    # 3. Roles
    roles_data = [
        ("Backend Developer", "Software Development", "Designs, builds, and maintains server-side web applications, databases, and APIs."),
        ("Frontend Developer", "Software Development", "Builds modern responsive user interfaces using web technologies."),
        ("Full Stack Developer", "Software Development", "Handles both frontend and backend development end-to-end."),
        ("Data Analyst", "Data & AI", "Analyzes structured and unstructured data to drive business insights."),
        ("AI/ML Engineer", "Data & AI", "Develops and deploys machine learning models into production systems."),
        ("Cloud Engineer", "Cloud & Infrastructure", "Manages cloud infrastructure, container orchestration, and CI/CD pipelines."),
        ("Cybersecurity Analyst", "Security", "Protects IT systems, applications, and networks from cyber threats.")
    ]

    role_objs = {}
    for rname, dom, desc in roles_data:
        r = Role(name=rname, domain=dom, description=desc)
        db.add(r)
        db.commit()
        db.refresh(r)
        role_objs[rname] = r

    # 4. RoleSkills for Backend Developer
    backend_role = role_objs["Backend Developer"]
    backend_reqs = [
        ("Python", 80.0, "High"),
        ("SQL", 75.0, "High"),
        ("Git", 60.0, "Medium"),
        ("Django", 75.0, "High"),
        ("REST API", 70.0, "High"),
        ("PostgreSQL", 70.0, "Medium"),
        ("Docker", 65.0, "Medium")
    ]

    for sname, req, imp in backend_reqs:
        rs = RoleSkill(role_id=backend_role.id, skill_id=skill_objs[sname].id, required_level=req, importance=imp)
        db.add(rs)

    # Requirements for Frontend Developer
    frontend_role = role_objs["Frontend Developer"]
    for sname, req, imp in [("React", 80.0, "High"), ("TypeScript", 75.0, "High"), ("JavaScript", 85.0, "High"), ("Git", 60.0, "Medium")]:
        db.add(RoleSkill(role_id=frontend_role.id, skill_id=skill_objs[sname].id, required_level=req, importance=imp))

    db.commit()

    # 5. Skill Dependencies
    dependencies = [
        (skill_objs["Python"].id, skill_objs["Django"].id),
        (skill_objs["Django"].id, skill_objs["REST API"].id),
        (skill_objs["SQL"].id, skill_objs["PostgreSQL"].id),
        (skill_objs["REST API"].id, skill_objs["Docker"].id)
    ]
    for prereq, dep in dependencies:
        sd = SkillDependency(prerequisite_skill_id=prereq, dependent_skill_id=dep)
        db.add(sd)
    db.commit()

    # 6. Student Profile for Arun Kumar
    arun_profile = StudentProfile(
        user_id=student_user.id,
        college="ABC Engineering College",
        degree="B.Tech",
        branch="Computer Science Engineering",
        graduation_year=2026,
        interests="Backend Web Development, Distributed Systems, Database Architecture",
        preferred_domain="Software Development",
        target_role_id=backend_role.id
    )
    db.add(arun_profile)
    db.commit()
    db.refresh(arun_profile)

    # Seed profiles for other students
    all_stud_users = db.query(User).filter(User.role == UserRole.STUDENT, User.id != student_user.id).all()
    for su in all_stud_users:
        sp = StudentProfile(
            user_id=su.id,
            college="ABC Engineering College",
            degree="B.Tech",
            branch="Computer Science Engineering",
            target_role_id=backend_role.id
        )
        db.add(sp)
    db.commit()

    # 7. Arun's Verified Skill Evidence (Exact Demo Values)
    # Python: 91, SQL: 82, Git: 89, Django: 64, REST API: 51
    arun_evidences = [
        # Python
        (skill_objs["Python"].id, "Course", "Python for Backend Engineering", "Coursera", 92.0, "High"),
        (skill_objs["Python"].id, "Project", "Automated Task Scheduler CLI", "GitHub Repository", 90.0, "High"),
        (skill_objs["Python"].id, "Assessment", "Standard Python Diagnostic Test", "SkillBridge Assessment", 91.0, "High"),
        
        # SQL
        (skill_objs["SQL"].id, "Course", "Relational Database Design", "Udemy", 85.0, "High"),
        (skill_objs["SQL"].id, "Project", "E-commerce Database Schema & Queries", "Academic Project", 80.0, "High"),

        # Git
        (skill_objs["Git"].id, "Project", "Multi-Contributor Open Source Repo", "GitHub", 89.0, "High"),

        # Django
        (skill_objs["Django"].id, "Course", "Django Web Application Framework", "edX", 64.0, "Medium"),

        # REST API
        (skill_objs["REST API"].id, "Project", "Basic CRUD REST Microservice", "GitHub", 51.0, "Medium")
    ]

    for sid, etype, title, src, prof, conf in arun_evidences:
        ev = SkillEvidence(
            student_id=arun_profile.id,
            skill_id=sid,
            evidence_type=etype,
            title=title,
            source=src,
            proficiency=prof,
            confidence=conf,
            verification_status="VERIFIED"
        )
        db.add(ev)

    db.commit()

    # 8. Projects & Certificates for Arun
    proj1 = Project(
        student_id=arun_profile.id,
        title="Student Portal Backend API",
        description="RESTful API service written in Python & Django with PostgreSQL database integration.",
        technologies="Python, Django, PostgreSQL, REST API, Git",
        repository_url="https://github.com/arunkumar/student-portal-backend"
    )
    proj2 = Project(
        student_id=arun_profile.id,
        title="Automated Data Analytics Pipeline",
        description="ETL script processing relational SQL datasets and outputting structured JSON metrics.",
        technologies="Python, SQL, Pandas",
        repository_url="https://github.com/arunkumar/etl-pipeline"
    )
    db.add_all([proj1, proj2])

    cert1 = Certificate(
        student_id=arun_profile.id,
        title="Meta Backend Developer Professional Certificate",
        issuer="Coursera / Meta",
        issue_date="2025-11-15",
        credential_url="https://coursera.org/verify/meta-backend-arun"
    )
    db.add(cert1)
    db.commit()

    # 9. Learning Resources
    resources_data = [
        (skill_objs["REST API"].id, "REST API Fundamentals & Design", "FreeCodeCamp", "https://freecodecamp.org/learn/rest-api", "Intermediate", 12),
        (skill_objs["REST API"].id, "Building Production REST APIs with Django REST Framework", "Udemy", "https://udemy.com/course/django-rest-api", "Advanced", 18),
        (skill_objs["Django"].id, "Django Web Development Mastery", "Coursera", "https://coursera.org/learn/django-web", "Intermediate", 20),
        (skill_objs["SQL"].id, "SQL for Software Developers", "Codecademy", "https://codecademy.com/learn/sql", "Beginner", 10),
        (skill_objs["Git"].id, "Git & GitHub Version Control Guide", "YouTube Tech", "https://youtube.com/git-tutorial", "Beginner", 6),
        (skill_objs["PostgreSQL"].id, "PostgreSQL Database Administration", "Pluralsight", "https://pluralsight.com/courses/postgres", "Intermediate", 15),
        (skill_objs["Docker"].id, "Docker for Backend Developers", "Docker Docs", "https://docs.docker.com/get-started", "Intermediate", 14)
    ]

    res_objs = {}
    for sid, title, prov, url, diff, hrs in resources_data:
        lr = LearningResource(skill_id=sid, title=title, provider=prov, url=url, difficulty=diff, estimated_hours=hrs)
        db.add(lr)
        db.commit()
        db.refresh(lr)
        if sid not in res_objs:
            res_objs[sid] = lr

    # 10. Initial Roadmap for Arun
    arun_roadmap = Roadmap(
        student_id=arun_profile.id,
        role_id=backend_role.id,
        readiness_score=76.0
    )
    db.add(arun_roadmap)
    db.commit()
    db.refresh(arun_roadmap)

    # Initial Roadmap Items
    item_rest = RoadmapItem(
        roadmap_id=arun_roadmap.id,
        skill_id=skill_objs["REST API"].id,
        priority=PriorityLevel.HIGH,
        status=RoadmapItemStatus.IN_PROGRESS,
        recommended_action="Highest Gap (51% vs 70%): Complete REST API Fundamentals & Build API Project",
        resource_id=res_objs[skill_objs["REST API"].id].id
    )
    item_django = RoadmapItem(
        roadmap_id=arun_roadmap.id,
        skill_id=skill_objs["Django"].id,
        priority=PriorityLevel.MEDIUM,
        status=RoadmapItemStatus.NOT_STARTED,
        recommended_action="Medium Gap (64% vs 75%): Complete Django REST Framework module",
        resource_id=res_objs[skill_objs["Django"].id].id
    )
    db.add_all([item_rest, item_django])
    db.commit()

    # 11. Jobs & Job Skills (Seed at least 8 jobs)
    jobs_seed = [
        ("Junior Backend Developer", "TechCorp Solutions", "Looking for a Python backend developer with Django, REST APIs, PostgreSQL and Git experience.", "Bengaluru, India", "Entry Level", [("Python", 80), ("Django", 75), ("REST API", 70), ("SQL", 75), ("Git", 60)]),
        ("Python API Developer", "InnoData Labs", "Seeking backend software engineer skilled in Python, FastAPI, REST APIs, and Docker for high-throughput services.", "Remote / Hyderabad", "0-2 Years", [("Python", 85), ("REST API", 75), ("FastAPI", 70), ("Docker", 65)]),
        ("Associate Software Engineer", "Global Cloud Systems", "Entry level role building scalable web apps with Python, SQL, and Git version control.", "Pune, India", "Entry Level", [("Python", 75), ("SQL", 70), ("Git", 70)]),
        ("Full Stack Developer Intern", "NextGen Digital", "Internship opportunity for building modern web tools with React, TypeScript, Python, and REST APIs.", "Mumbai, India", "Internship", [("React", 70), ("Python", 70), ("REST API", 65), ("TypeScript", 60)]),
        ("Data Analyst Associate", "Analytica Insights", "Transform business requirements into SQL queries and Python data visualisations.", "Gurugram, India", "0-1 Year", [("SQL", 80), ("Python", 75), ("Data Analysis", 70)]),
        ("Cloud Operations Assistant", "SkyHigh Networks", "Support cloud deployment scripts using Docker, Git, and Python automation.", "Remote", "Entry Level", [("Docker", 70), ("Git", 70), ("Python", 65)]),
        ("Backend Engineer", "FinTech Nexus", "Build secure financial API endpoints in Python & Django with PostgreSQL security.", "Bengaluru, India", "1-3 Years", [("Python", 85), ("Django", 80), ("REST API", 80), ("PostgreSQL", 75)]),
        ("Junior QA Automation Engineer", "QualiTest Labs", "Automate REST API testing pipelines using Python pytest and GitHub actions.", "Noida, India", "Entry Level", [("Python", 75), ("REST API", 70), ("Git", 70)])
    ]

    for title, company, desc, loc, exp, jskills in jobs_seed:
        job = Job(
            recruiter_id=recruiter_user.id,
            title=title,
            company=company,
            description=desc,
            location=loc,
            experience_level=exp,
            status="OPEN"
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        for sname, req in jskills:
            if sname in skill_objs:
                js = JobSkill(job_id=job.id, skill_id=skill_objs[sname].id, required_level=float(req), importance="High")
                db.add(js)
        db.commit()

    # 12. Pre-seed Application for Arun Kumar
    techcorp_job = db.query(Job).filter(Job.company == "TechCorp Solutions").first()
    if techcorp_job:
        app1 = Application(
            student_id=arun_profile.id,
            job_id=techcorp_job.id,
            status=ApplicationStatus.APPLIED
        )
        db.add(app1)
        db.commit()

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
