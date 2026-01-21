import uuid
from sqlalchemy import Text, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.db.base import Base
from app.models.mixins import TimestampMixin


class Position(TimestampMixin, Base):
    __tablename__ = "positions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    employees = relationship("Employee", back_populates="position")
