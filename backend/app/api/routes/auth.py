from fastapi import APIRouter, Depends

from app.core.security import ClerkAuthContext, get_current_user
from app.schemas import AuthSessionResponse

router = APIRouter(prefix='/auth', tags=['auth'])


@router.get('/session', response_model=AuthSessionResponse)
def auth_session(current_user: ClerkAuthContext = Depends(get_current_user)):
    return AuthSessionResponse(user_id=current_user.user_id, session_id=current_user.session_id)
