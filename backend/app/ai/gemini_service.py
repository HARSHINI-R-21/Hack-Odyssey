import json
import logging
from typing import List, Tuple, Dict, Any
from app.config import settings
from app.ai.fallback_service import fallback_extract_skills, fallback_tailor_resume

logger = logging.getLogger(__name__)

def extract_skills_from_text(text: str) -> Tuple[List[str], str]:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return fallback_extract_skills(text)

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Extract a clean JSON array of technical skill names mentioned or required in the following text.
        Return ONLY valid JSON array of strings, e.g. ["Python", "Django", "REST API"].
        Text:
        {text}
        """
        response = model.generate_content(prompt)
        text_resp = response.text.strip()
        # Clean JSON markdown formatting if present
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:]
        if text_resp.endswith("```"):
            text_resp = text_resp[:-3]
        skills = json.loads(text_resp.strip())
        if isinstance(skills, list):
            return skills, "Gemini API (Google DeepMind)"
    except Exception as e:
        logger.warning(f"Gemini API call failed, using fallback engine: {e}")

    return fallback_extract_skills(text)

def tailor_resume_content(job_title: str, job_desc: str, student_skills: List[str], student_projects: List[Dict[str, Any]]) -> Dict[str, Any]:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return fallback_tailor_resume(job_title, job_desc, student_skills, student_projects)

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Generate a professional resume summary tailored to the job '{job_title}'.
        Job Description: {job_desc}
        Candidate Skills: {', '.join(student_skills)}
        
        Return JSON object with keys:
        - "tailored_summary": string
        - "emphasized_skills": array of strings
        - "matching_projects": array of strings
        """
        response = model.generate_content(prompt)
        text_resp = response.text.strip()
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:]
        if text_resp.endswith("```"):
            text_resp = text_resp[:-3]
        data = json.loads(text_resp.strip())
        data["source"] = "Gemini AI Tailoring"
        return data
    except Exception as e:
        logger.warning(f"Gemini resume tailoring failed, using fallback engine: {e}")

    return fallback_tailor_resume(job_title, job_desc, student_skills, student_projects)
