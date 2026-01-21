import uuid
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.employee import EmployeeListOut, EmployeeDetailOut
from app.services.employees import EmployeeService
from app.utils.media import save_employee_photo


router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("", response_model=list[EmployeeListOut])
def list_employees(
    department_id: uuid.UUID | None = None,
    position_id: uuid.UUID | None = None,
    q: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    return EmployeeService.list(
        db,
        department_id=department_id,
        position_id=position_id,
        q=q,
        limit=limit,
        offset=offset,
    )

@router.get("/{employee_id}", response_model=EmployeeDetailOut)
def get_employee(employee_id: uuid.UUID, db: Session = Depends(get_db)):
    emp = EmployeeService.get(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.post("", response_model=EmployeeDetailOut, status_code=201)
def create_employee(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    department_id: uuid.UUID = Form(...),
    position_id: uuid.UUID = Form(...),
    hire_date: date | None = Form(default=None),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    #validation
    if len(first_name.strip()) < 2:
        raise HTTPException(status_code=422, detail="First name must be at least 2 characters long")
    if len(last_name.strip()) < 2:
        raise HTTPException(status_code=422, detail="Last name must be at least 2 characters long")

    #save photo
    try:
        photo_url, photo_path = save_employee_photo(photo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # create employee
    try:
        emp = EmployeeService.create(
            db,
            first_name=first_name.strip(),
            last_name=last_name.strip(),
            email=email.strip().lower(),
            department_id=department_id,
            position_id=position_id,
            photo_url=photo_url,
            hire_date=hire_date,
        )
    except ValueError as e:
        # ✅ cleanup si DB échoue après upload
        from app.utils.media import safe_delete_file
        safe_delete_file(photo_path)
        raise HTTPException(status_code=409, detail=str(e))

    return emp
