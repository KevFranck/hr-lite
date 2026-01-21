import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.department import DepartmentOut, DepartmentCreate, DepartmentUpdate
from app.services.department import DepartmentService

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("", response_model=list[DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    departments = DepartmentService.list(db)
    return departments

@router.post("", response_model=DepartmentOut, status_code=201)
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db)):
    try:
        department = DepartmentService.create(db, payload)
        return department
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/{department_id}", response_model=DepartmentOut)
def get_department(department_id: uuid.UUID, db: Session = Depends(get_db)):
    obj = DepartmentService.get(db, department_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Department not found")
    return obj

@router.patch("/{department_id}", response_model=DepartmentOut)
def update_department(department_id: uuid.UUID, payload: DepartmentUpdate, db: Session = Depends(get_db)):
    obj = DepartmentService.get(db, department_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Department not found")
    try:
        updated_obj = DepartmentService.update(db, obj, payload)
        return updated_obj
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.delete("/{department_id}", status_code=204)
def delete_department(department_id: uuid.UUID, db: Session = Depends(get_db)):
    obj = DepartmentService.get(db, department_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Department not found")
    DepartmentService.delete(db, obj)
    return None
