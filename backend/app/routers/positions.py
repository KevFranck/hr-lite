import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.position import PositionCreate, PositionOut, PositionUpdate
from app.services.position import PositionService


router = APIRouter(prefix="/positions", tags=["positions"])


@router.get("", response_model=list[PositionOut])
def list_positions(db: Session = Depends(get_db)):
    positions = PositionService.list(db)
    return positions

@router.post("", response_model=PositionOut, status_code=201)
def create_position(payload: PositionCreate, db: Session = Depends(get_db)):
    try:
        position = PositionService.create(db, payload)
        return position
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/{position_id}", response_model=PositionOut)
def get_position(position_id: uuid.UUID, db: Session = Depends(get_db)):
    obj = PositionService.get(db, position_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Position not found")
    return obj

@router.patch("/{position_id}", response_model=PositionOut)
def update_position(position_id: uuid.UUID, payload: PositionUpdate, db: Session = Depends(get_db)):
    obj = PositionService.get(db, position_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Position not found")
    try:
        updated_obj = PositionService.update(db, obj, payload)
        return updated_obj
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.delete("/{position_id}", status_code=204)
def delete_position(position_id: uuid.UUID, db: Session = Depends(get_db)):
    obj = PositionService.get(db, position_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Position not found")
    PositionService.delete(db, obj)
    return None
