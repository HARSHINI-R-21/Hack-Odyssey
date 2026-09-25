from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Role, StudentProfile, User
from app.routers.auth import get_current_user
from app.schemas.schemas import RoleResponse
from app.engines.skill_graph import get_role_skill_graph

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("", response_model=List[RoleResponse])
def get_all_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()

@router.get("/{role_id}", response_model=RoleResponse)
def get_role_detail(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.get("/{role_id}/graph", response_model=dict)
def get_role_graph(role_id: int, db: Session = Depends(get_db)):
    graph = get_role_skill_graph(db, role_id)
    if not graph:
        raise HTTPException(status_code=404, detail="Role or graph not found")
    return graph

@router.post("/me/target-role", response_model=dict)
def set_target_role(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role_id = payload.get("role_id")
    if not role_id:
        raise HTTPException(status_code=400, detail="role_id is required")

    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    profile.target_role_id = role_id
    db.commit()

    return {
        "message": f"Target role set to {role.name}",
        "target_role_id": role_id,
        "target_role_name": role.name
    }
