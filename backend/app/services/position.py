import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.position import Position
from app.schemas.position import PositionCreate, PositionUpdate

class PositionService:
    @staticmethod
    def list(db: Session) -> list[Position]:
        stmt = select(Position).order_by(Position.title.asc())
        result = db.execute(stmt).scalars().all()
        return result

    @staticmethod
    def get(db: Session, position_id: uuid.UUID) -> Position | None:
        return db.get(Position, position_id)

    @staticmethod
    def create(db: Session, data: PositionCreate) -> Position:
        exists = db.execute(select(Position).where(Position.title == data.title)).scalar_one_or_none()
        if exists:
            raise ValueError(f"Position with title '{data.title}' already exists.")

        obj = Position(title=data.title)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def update(db: Session, obj: Position, data: PositionUpdate) -> Position:
        if data.title is not None and data.title != obj.title:
            exists = db.execute(select(Position).where(Position.title == data.title)).scalar_one_or_none()
            if exists:
                raise ValueError(f"Position with title '{data.title}' already exists.")
            obj.title = data.title

        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def delete(db: Session, obj: Position) -> None:
        db.delete(obj)
        db.commit()
