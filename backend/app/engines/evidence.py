from sqlalchemy.orm import Session
from app.models.models import SkillEvidence, Skill

def get_student_verified_skills(db: Session, student_id: int):
    evidences = db.query(SkillEvidence).filter(SkillEvidence.student_id == student_id).all()
    
    skill_map = {}
    for ev in evidences:
        sid = ev.skill_id
        if sid not in skill_map:
            skill_map[sid] = {
                "skill_id": sid,
                "skill_name": ev.skill.name if ev.skill else "Unknown",
                "evidences": [],
                "types": set(),
                "max_proficiency": 0.0,
                "scores": []
            }
        skill_map[sid]["evidences"].append(ev)
        skill_map[sid]["types"].add(ev.evidence_type)
        skill_map[sid]["scores"].append(ev.proficiency)
        if ev.proficiency > skill_map[sid]["max_proficiency"]:
            skill_map[sid]["max_proficiency"] = ev.proficiency

    result = {}
    for sid, data in skill_map.items():
        avg_score = sum(data["scores"]) / len(data["scores"]) if data["scores"] else 0.0
        # Use a combination of average and max score
        calculated_prof = round(0.7 * data["max_proficiency"] + 0.3 * avg_score, 1)
        count = len(data["evidences"])
        
        # Calculate confidence
        if count >= 3 or calculated_prof >= 80:
            confidence = "High"
        elif count >= 1 or calculated_prof >= 50:
            confidence = "Medium"
        else:
            confidence = "Low"
            
        result[sid] = {
            "skill_id": sid,
            "skill_name": data["skill_name"],
            "proficiency": calculated_prof,
            "evidence_count": count,
            "evidence_types": list(data["types"]),
            "confidence": confidence,
            "evidences": [
                {
                    "id": e.id,
                    "title": e.title,
                    "type": e.evidence_type,
                    "source": e.source,
                    "proficiency": e.proficiency,
                    "confidence": e.confidence
                } for e in data["evidences"]
            ]
        }
        
    return result
