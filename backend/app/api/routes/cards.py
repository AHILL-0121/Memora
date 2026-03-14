from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import ClerkAuthContext, get_current_user
from app.db import get_db
from app.models import Card, CardStatus, MediaType, ScanLog
from app.schemas import (
    CardCreateRequest,
    CardDeleteResponse,
    CardListResponse,
    CardResponse,
    CardUpdateRequest
)
from app.services.qr_service import generate_qr_png

router = APIRouter(prefix='/cards', tags=['cards'])


def _viewer_url(card_id: str) -> str:
    return f'{settings.public_base_url}/view/{card_id}'


def _to_card_response(card: Card) -> CardResponse:
    return CardResponse(
        id=card.id,
        name=card.name,
        photo_url=card.photo_url,
        media_url=card.media_url,
        media_type=card.media_type.value,
        target_url=card.target_url,
        qr_url=card.qr_url,
        status=card.status.value,
        is_public=card.is_public,
        scan_count=card.scan_count,
        viewer_url=_viewer_url(card.id),
        created_at=card.created_at
    )


@router.post('', response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(payload: CardCreateRequest, db: Session = Depends(get_db), user: ClerkAuthContext = Depends(get_current_user)):
    card = Card(
        clerk_user_id=user.user_id,
        name=payload.name,
        photo_url=str(payload.photo_url),
        media_url=str(payload.media_url),
        target_url=str(payload.target_url) if payload.target_url else None,
        media_type=MediaType(payload.media_type),
        is_public=payload.is_public,
        status=CardStatus.ready if payload.target_url else CardStatus.processing
    )
    db.add(card)
    db.commit()
    db.refresh(card)

    qr_asset_path = generate_qr_png(_viewer_url(card.id), card.id)
    card.qr_url = f"{settings.backend_base_url}/assets/{qr_asset_path}"
    db.add(card)
    db.commit()
    db.refresh(card)

    return _to_card_response(card)


@router.get('', response_model=CardListResponse)
def list_cards(db: Session = Depends(get_db), user: ClerkAuthContext = Depends(get_current_user)):
    cards = db.query(Card).filter(Card.clerk_user_id == user.user_id).order_by(Card.created_at.desc()).all()
    return CardListResponse(cards=[_to_card_response(card) for card in cards], total=len(cards))


@router.get('/{card_id}', response_model=CardResponse)
def get_card(card_id: str, db: Session = Depends(get_db), user: ClerkAuthContext = Depends(get_current_user)):
    card = db.query(Card).filter(Card.id == card_id, Card.clerk_user_id == user.user_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Card not found')
    return _to_card_response(card)


@router.patch('/{card_id}', response_model=CardResponse)
def update_card(card_id: str, payload: CardUpdateRequest, db: Session = Depends(get_db), user: ClerkAuthContext = Depends(get_current_user)):
    card = db.query(Card).filter(Card.id == card_id, Card.clerk_user_id == user.user_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Card not found')

    if payload.name is not None:
        card.name = payload.name
    if payload.media_url is not None:
        card.media_url = str(payload.media_url)
    if payload.target_url is not None:
        card.target_url = str(payload.target_url)
        card.status = CardStatus.ready
    if payload.media_type is not None:
        card.media_type = MediaType(payload.media_type)
    if payload.is_public is not None:
        card.is_public = payload.is_public
    card.updated_at = datetime.utcnow()

    db.add(card)
    db.commit()
    db.refresh(card)
    return _to_card_response(card)


@router.delete('/{card_id}', response_model=CardDeleteResponse)
def delete_card(card_id: str, db: Session = Depends(get_db), user: ClerkAuthContext = Depends(get_current_user)):
    card = db.query(Card).filter(Card.id == card_id, Card.clerk_user_id == user.user_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Card not found')
    db.delete(card)
    db.commit()
    return CardDeleteResponse(message='Card scheduled for deletion in 24 hours.')


@router.get('/{card_id}/analytics')
def card_analytics(card_id: str, db: Session = Depends(get_db), user: ClerkAuthContext = Depends(get_current_user)):
    from app.services.analytics_service import analytics_from_scan_logs

    card = db.query(Card).filter(Card.id == card_id, Card.clerk_user_id == user.user_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Card not found')

    logs = db.query(ScanLog).filter(ScanLog.card_id == card_id).all()
    return analytics_from_scan_logs(card_id, logs)
