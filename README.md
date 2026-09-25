# SkillBridge – Academia–Industry Portal

> **Tagline**: *"Evidence-Driven Adaptive Career Intelligence"*  
> **Hackathon**: Hack Odyssey 
> **Category**: Software  
> **Team**: Brainbolt  

---

## 1. Executive Summary & USP

SkillBridge connects **Students**, **Educational Institutions**, and **Industry Recruiters**.  
Unlike typical LMS platforms, simple resume builders, or static job boards, SkillBridge's main USP is:

> **Continuous evidence-backed measurement of student skills against live industry job requirements, automatic identification of high-impact skill gaps, transparent readiness scoring, and dynamic learning roadmap adaptation triggered by new evidence and real recruiter feedback.**

---

## 2. The Core Intelligence Loop

```
Student Profile
   ↓
Career Assessment Diagnostic
   ↓
Target Role Selection
   ↓
Skill Graph Engine (Role -> Skills -> Dependencies DAG)
   ↓
Evidence Engine (Assessments, Projects, Courses, Certificates, GitHub)
   ↓
Skill Passport (Verified Skills, Confidence, Evidence Breakdown)
   ↓
Role Readiness Engine (Deterministic Transparent Formula)
   ↓
Skill Gap Detection & Priority Ranking
   ↓
Personalized Adaptive Learning Roadmap
   ↓
AI Resume Builder (Verified Evidence-backed Resume Tailoring)
   ↓
Explainable Job Matching Engine
   ↓
Job Application Tracking
   ↓
Recruiter Feedback Engine (Gemini/Fallback NLP Skill Extraction)
   ↓
Roadmap Recalibration & Updated Readiness Score
```

---

## 3. Four Core Intelligence Engines

### A. Skill Graph Engine
Represents `Role -> Skills -> Skill Dependencies` as a Directed Acyclic Graph (DAG).  
*Example for Backend Developer*:
- Python $\rightarrow$ Django $\rightarrow$ REST API $\rightarrow$ Docker
- SQL $\rightarrow$ PostgreSQL

### B. Evidence Engine
Does not rely on self-claimed skills. Aggregates evidence from Assessments, Projects, Courses, Certificates, and GitHub repositories. Calculates:
- Verified Proficiency ($0 - 100\%$)
- Evidence Count & Evidence Types
- Confidence Rating (*High*, *Medium*, *Low*)

### C. Readiness & Gap Engine
Calculates a transparent, deterministic readiness score without relying on opaque LLM score hallucinations:

$$\text{Readiness Score} = \frac{\sum \left( \min\left(1.0, \frac{\text{Current Proficiency}_i}{\text{Required Level}_i}\right) \times \text{Importance Weight}_i \times \text{Confidence Factor}_i \right)}{\sum \text{Importance Weight}_i} \times 100$$

Where:
- Importance Weights: High = 1.0, Medium = 0.7, Low = 0.5
- Confidence Factors: High = 1.0, Medium = 0.9, Low = 0.7
- Skill Gap = $\max(0.0, \text{Required Level} - \text{Current Proficiency})$

### D. Recruiter Feedback Engine
Processes recruiter feedback text (e.g., *"Candidate needs stronger REST API experience and backend deployment exposure."*):
1. Extracts required skill improvement areas via Gemini API (or deterministic regex fallback).
2. Updates student's roadmap with high-priority learning tasks.
3. Upon task completion, creates new verified evidence, updates proficiency, and recalculates total readiness.

---

## 4. Pre-Seeded Demo Accounts

Access quick 1-click login directly from the Login page:

| Role | Email | Password | Account Name & Context |
|---|---|---|---|
| **Student** | `student@skillbridge.demo` | `Student@123` | **Arun Kumar** (Target: Backend Developer) |
| **Recruiter** | `recruiter@skillbridge.demo` | `Recruiter@123` | **Priya Sharma** (Tech Recruiter) |
| **Institution** | `college@skillbridge.demo` | `College@123` | **ABC Engineering College** (Placement Cell) |

### Demo Student Initial State (Arun Kumar)
- **Target Role**: Backend Developer
- **Proficiencies**: Python (91%), SQL (82%), Git (89%), Django (64%), REST API (51%)
- **Overall Readiness**: 76%
- **Highest-Impact Gap**: REST API (51% vs 70% required level)

---

## 5. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, React Router DOM, Axios
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy ORM, Pydantic v2, PyJWT, Passlib (bcrypt)
- **Database**: PostgreSQL (with SQLite out-of-the-box fallback `sqlite:///./skillbridge.db`)
- **AI Integration**: Google Gemini API (`GEMINI_API_KEY`) with a 100% deterministic keyword fallback engine when API key is unavailable.

---

## 6. Quick Start & Execution Guide

### Option A: Local Development (Fastest)

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```
FastAPI Swagger docs will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Vite dev server will be live at: [http://localhost:3000](http://localhost:3000)

### Option B: Docker Compose

```bash
docker-compose up --build
```

---

## 7. Testing

To run backend integration tests:
```bash
cd backend
pytest
```

Verifies:
- JWT Auth & RBAC
- Deterministic Readiness Engine calculations
- Explainable Job Matching scoring
- Recruiter Feedback skill extraction & adaptive roadmap triggers

---

## 8. SIH 2026 Judge Demo Scenario (3–5 Minute Journey)

Click **"Launch Demo Journey"** in the top navigation bar to run through the guided tour:
1. **Student Dashboard**: Welcome Arun 👋 $\rightarrow$ 76% readiness $\rightarrow$ Career Intelligence Loop diagram.
2. **Career Assessment**: Diagnostic test recommending Software Development domain.
3. **Skill Graph**: Interactive node network (Python $\rightarrow$ Django $\rightarrow$ REST API).
4. **Skill Passport**: Evidence-backed proficiencies (Python 91%, REST API 51%).
5. **Readiness Analysis**: Required vs Current comparison highlighting REST API gap.
6. **Find Opportunities**: Job matching with explainable breakdown ("Why you match" vs "Skills to improve").
7. **AI Resume Builder**: Truthful verified resume with 1-click job tailoring.
8. **Recruiter Dashboard**: Post job with AI skill extraction & view candidate ranking.
9. **Recruiter Feedback**: Recruiter submits feedback $\rightarrow$ Extracts REST API gap.
10. **Adaptive Roadmap**: Candidate roadmap adapts! Click "Mark Complete" $\rightarrow$ creates evidence, updates proficiency, & recalculates readiness to 82.2%!
11. **Institution Intelligence**: College demand analytics & Industry Skill Heatmap.
