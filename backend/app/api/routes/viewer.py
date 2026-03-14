from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Card, CardStatus, ScanLog
from app.schemas import ViewerResponse

router = APIRouter(prefix='/viewer', tags=['viewer'])


def _device_type(user_agent: str | None) -> str:
    ua = (user_agent or '').lower()
    if 'mobile' in ua:
        return 'mobile'
    if 'tablet' in ua or 'ipad' in ua:
        return 'tablet'
    return 'desktop'


@router.get('/{card_id}', response_model=ViewerResponse)
def get_viewer_card(card_id: str, request: Request, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card or card.status != CardStatus.ready:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Card unavailable')
    if not card.is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Card is private')

    log = ScanLog(
        card_id=card.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get('user-agent'),
        country='UNKNOWN',
        device_type=_device_type(request.headers.get('user-agent'))
    )
    card.scan_count += 1
    db.add(log)
    db.add(card)
    db.commit()

    return ViewerResponse(
        id=card.id,
        photo_url=card.photo_url,
        media_url=card.media_url,
        media_type=card.media_type.value,
        target_url=card.target_url,
        status=card.status.value
    )
