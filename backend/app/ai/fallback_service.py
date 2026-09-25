import re
from typing import List, Tuple, Dict, Any

KNOWN_SKILLS = [
    "Python", "SQL", "Git", "Django", "REST API", "PostgreSQL", "Docker",
    "React", "TypeScript", "JavaScript", "Node.js", "HTML", "CSS", "Tailwind CSS",
    "Machine Learning", "Data Analysis", "Pandas", "NumPy", "AWS", "Kubernetes",
    "FastAPI", "MongoDB", "Express", "Cybersecurity", "CI/CD", "Backend Deployment"
]

def fallback_extract_skills(text: str) -> Tuple[List[str], str]:
    if not text:
        return [], "Deterministic Fallback Matcher"
    
    found = []
    text_lower = text.lower()
    
    for skill in KNOWN_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
            
    # Also handle specific phrases like "rest api" or "backend deployment"
    if "rest" in text_lower and "api" in text_lower and "REST API" not in found:
        found.append("REST API")
    if "deployment" in text_lower and "Backend Deployment" not in found:
        found.append("Backend Deployment")

    return list(dict.fromkeys(found)), "Deterministic Keyword Engine (Gemini Fallback)"

def fallback_tailor_resume(job_title: str, job_desc: str, student_skills: List[str], student_projects: List[Dict[str, Any]]) -> Dict[str, Any]:
    matched_skills = [s for s in student_skills if s.lower() in job_desc.lower() or s in ["Python", "SQL", "Git", "REST API", "Django"]]
    summary = f"Motivated candidate targeting {job_title} role with proven expertise in {', '.join(matched_skills[:4])}. Evidence-backed hands-on project experience in web services and data management."
    
    matching_projects = [p.get("title", "Project") for p in student_projects[:3]]
    
    return {
        "tailored_summary": summary,
        "emphasized_skills": matched_skills,
        "matching_projects": matching_projects,
        "source": "Rule-Based Deterministic Resumer"
    }
