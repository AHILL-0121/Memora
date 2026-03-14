from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Card, CardStatus
from app.schemas import CompilationCallbackRequest

router = APIRouter(prefix='/internal/cards', tags=['internal'])


@router.post('/{card_id}/compiled')
def compilation_callback(card_id: str, payload: CompilationCallbackRequest, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Card not found')

    card.target_url = str(payload.target_url)
    card.qr_url = str(payload.qr_url)
    card.status = CardStatus(payload.status)
    db.add(card)
    db.commit()

    return {'message': 'Card updated', 'card_id': card_id}
