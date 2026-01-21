import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session


from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate


class DepartmentService:
    @staticmethod
    def list(db: Session) -> list[Department]:
        stmt = select(Department).order_by(Department.name.asc())
        result = db.execute(stmt).scalars().all()
        return result

    @staticmethod
    def get(db: Session, department_id: uuid.UUID) -> Department | None:
        return db.get(Department, department_id)

    @staticmethod
    def create(db: Session, data: DepartmentCreate) -> Department:
        exists = db.execute(select(Department).where(Department.name == data.name)).scalar_one_or_none()
        if exists:
            raise ValueError(f"Department with name '{data.name}' already exists.")

        obj = Department(name=data.name, description=data.description)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def update(db: Session, obj: Department, data: DepartmentUpdate) -> Department:
        if data.name is not None and data.name != obj.name:
            exists = db.execute(select(Department).where(Department.name == data.name)).scalar_one_or_none()
            if exists:
                raise ValueError(f"Department with name '{data.name}' already exists.")
            obj.name = data.name

        if data.description is not None:
            obj.description = data.description

        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def delete(db: Session, obj: Department) -> None:
        db.delete(obj)
        db.commit()
