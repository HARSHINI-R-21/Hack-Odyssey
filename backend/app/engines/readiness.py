from sqlalchemy.orm import Session
from app.models.models import Role, RoleSkill, StudentProfile
from app.engines.evidence import get_student_verified_skills

def calculate_role_readiness(db: Session, student_id: int, role_id: int):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return None

    role_skills = db.query(RoleSkill).filter(RoleSkill.role_id == role_id).all()
    if not role_skills:
        return {
            "target_role": role.name,
            "overall_readiness": 0.0,
            "strong_skills_count": 0,
            "gap_skills_count": 0,
            "highest_impact_gap": None,
            "gaps": []
        }

    verified_skills = get_student_verified_skills(db, student_id)

    importance_weights = {"High": 1.0, "Medium": 0.7, "Low": 0.5}
    confidence_factors = {"High": 1.0, "Medium": 0.9, "Low": 0.7}

    total_weighted_score = 0.0
    total_max_weight = 0.0

    gaps = []
    strong_count = 0
    gap_count = 0
    max_weighted_gap = -1.0
    highest_impact_gap_name = None

    for rs in role_skills:
        skill_id = rs.skill_id
        skill_name = rs.skill.name if rs.skill else "Unknown"
        req_level = float(rs.required_level)
        importance = rs.importance or "High"

        student_skill = verified_skills.get(skill_id)
        current_prof = float(student_skill["proficiency"]) if student_skill else 0.0
        confidence = student_skill["confidence"] if student_skill else "Low"
        ev_count = student_skill["evidence_count"] if student_skill else 0
        ev_types = student_skill["evidence_types"] if student_skill else []

        w = importance_weights.get(importance, 0.7)
        c = confidence_factors.get(confidence, 0.7)

        skill_ratio = min(1.0, current_prof / req_level) if req_level > 0 else 1.0
        weighted_score = skill_ratio * w * c
        total_weighted_score += weighted_score
        total_max_weight += w

        raw_gap = max(0.0, req_level - current_prof)
        if raw_gap == 0:
            strong_count += 1
            priority = "Low"
        else:
            gap_count += 1
            if raw_gap >= 15 or (raw_gap > 0 and importance == "High"):
                priority = "High"
            elif raw_gap >= 5:
                priority = "Medium"
            else:
                priority = "Low"

        weighted_gap_value = raw_gap * w
        if raw_gap > 0 and weighted_gap_value > max_weighted_gap:
            max_weighted_gap = weighted_gap_value
            highest_impact_gap_name = skill_name

        gaps.append({
            "skill_id": skill_id,
            "skill_name": skill_name,
            "required_level": round(req_level, 1),
            "current_proficiency": round(current_prof, 1),
            "gap": round(raw_gap, 1),
            "priority": priority,
            "importance": importance,
            "confidence": confidence,
            "evidence_count": ev_count,
            "evidence_types": ev_types
        })

    overall_readiness = round((total_weighted_score / total_max_weight) * 100, 1) if total_max_weight > 0 else 0.0

    return {
        "target_role": role.name,
        "overall_readiness": overall_readiness,
        "strong_skills_count": strong_count,
        "gap_skills_count": gap_count,
        "highest_impact_gap": highest_impact_gap_name,
        "gaps": gaps
    }
