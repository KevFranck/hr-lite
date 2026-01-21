import uuid
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

from app.schemas.department import DepartmentOut
from app.schemas.position import PositionOut

class EmployeeListOut(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    status: str
    photo_url: str


    department: DepartmentOut
    position: PositionOut

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EmployeeDetailOut(EmployeeListOut):
    hire_date: datetime | None = None

class EmployeeUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=50)
    last_name: str | None = Field(default=None, min_length=1, max_length=50)
    email: EmailStr | None = None
    department_id: uuid.UUID | None = None
    position_id: uuid.UUID | None = None
    status: str | None = Field(default=None, min_length=1, max_length=20)
