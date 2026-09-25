from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, students, skills, roles, readiness, roadmap, jobs, applications, feedback, institution, ai
from app.seed import seed_database

# Create DB tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillBridge – Academia–Industry Portal API",
    description="Evidence-Driven Adaptive Career Intelligence Engine API for Smart India Hackathon 2026",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(roles.router, prefix=settings.API_V1_STR)
app.include_router(readiness.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)
app.include_router(institution.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "SkillBridge – Academia–Industry Portal",
        "tagline": "Evidence-Driven Adaptive Career Intelligence",
        "hackathon": "Smart India Hackathon 2026",
        "problem_statement_id": "PS26044",
        "team": "Brainbolt",
        "docs": "/docs",
        "status": "Online"
    }

@app.post("/api/seed")
def trigger_seed():
    seed_database()
    return {"message": "Database successfully seeded with demo data"}
