from sqlalchemy.orm import Session
from app.models.models import Role, RoleSkill, SkillDependency, Skill

def get_role_skill_graph(db: Session, role_id: int):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return None

    role_skills = db.query(RoleSkill).filter(RoleSkill.role_id == role_id).all()
    skill_ids = [rs.skill_id for rs.role_skills in [role_skills] for rs in role_skills]

    dependencies = db.query(SkillDependency).filter(
        (SkillDependency.prerequisite_skill_id.in_(skill_ids)) |
        (SkillDependency.dependent_skill_id.in_(skill_ids))
    ).all()

    nodes = []
    for rs in role_skills:
        nodes.append({
            "id": rs.skill.id,
            "name": rs.skill.name,
            "category": rs.skill.category,
            "required_level": rs.required_level,
            "importance": rs.importance,
            "description": rs.skill.description
        })

    edges = []
    for dep in dependencies:
        edges.append({
            "from": dep.prerequisite_skill_id,
            "from_name": dep.prerequisite.name,
            "to": dep.dependent_skill_id,
            "to_name": dep.dependent.name
        })

    return {
        "role": {
            "id": role.id,
            "name": role.name,
            "domain": role.domain,
            "description": role.description
        },
        "nodes": nodes,
        "edges": edges
    }
