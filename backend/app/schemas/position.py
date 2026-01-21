import uuid
from pydantic import BaseModel, Field
from datetime import datetime


class PositionBase(BaseModel):
    title: str = Field(min_length=2, max_length=100)


class PositionCreate(PositionBase):
    pass


class PositionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=100)

class PositionOut(PositionBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
