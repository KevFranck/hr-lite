import uuid
from datetime import date
from sqlalchemy import select, or_
from sqlalchemy.orm import Session, joinedload


from app.models.employee import Employee
from app.models.department import Department
from app.models.position import Position


class EmployeeService:
    @staticmethod
    def get(db: Session, employee_id: uuid.UUID) -> Employee | None:
        stmt = (
            select(Employee)
            .options(joinedload(Employee.department), joinedload(Employee.position))
            .where(Employee.id == employee_id)
        )
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def list(
        db: Session,
        *,
        department_id: uuid.UUID | None = None,
        position_id: uuid.UUID | None = None,
        q: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Employee]:
        stmt = select(Employee).options(joinedload(Employee.department), joinedload(Employee.position))

        if department_id:
            stmt = stmt.where(Employee.department_id == department_id)

        if position_id:
            stmt = stmt.where(Employee.position_id == position_id)

        if q:
            like = f"%{q.strip()}%"
            stmt = stmt.where(
                or_(
                    Employee.first_name.ilike(like),
                    Employee.last_name.ilike(like),
                    Employee.email.ilike(like),
                )
            )

        stmt = stmt.order_by(Employee.last_name.asc()).limit(limit).offset(offset)
        result = db.execute(stmt).scalars().all()
        return result

    @staticmethod
    def create(
        db: Session,
        *,
        first_name: str,
        last_name: str,
        email: str,
        department_id: uuid.UUID,
        position_id: uuid.UUID,
        photo_url: str,
        hire_date: date | None = None,
        status: str = "active",
    ) -> Employee:
        #verify FK existence
        if not db.get(Department, department_id):
            raise ValueError(f"Department does not exist.")
        if not db.get(Position, position_id):
            raise ValueError(f"Position does not exist.")

        #unique email check
        exists = db.execute(select(Employee).where(Employee.email == email)).scalar_one_or_none()
        if exists:
            raise ValueError(f"Employee with email '{email}' already exists.")

        emp = Employee(
            first_name=first_name,
            last_name=last_name,
            email=email,
            department_id=department_id,
            position_id=position_id,
            photo_url=photo_url,
            hire_date=hire_date,
            status="active",
        )
        db.add(emp)
        db.commit()
        db.refresh(emp)

        #load relationships
        return EmployeeService.get(db, emp.id)
