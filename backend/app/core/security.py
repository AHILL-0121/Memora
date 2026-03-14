import time
from dataclasses import dataclass

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings


bearer_scheme = HTTPBearer(auto_error=False)
_jwks_cache: dict[str, object] = {'keys': [], 'fetched_at': 0.0}


@dataclass
class ClerkAuthContext:
    user_id: str
    session_id: str | None


def _resolve_jwks_url() -> str:
    if settings.clerk_jwks_url:
        return settings.clerk_jwks_url
    if settings.clerk_issuer:
        return f"{settings.clerk_issuer.rstrip('/')}/.well-known/jwks.json"
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Clerk issuer/JWKS not configured')


def _get_jwks() -> list[dict]:
    now = time.time()
    if _jwks_cache['keys'] and now - float(_jwks_cache['fetched_at']) < 300:
        return _jwks_cache['keys']

    url = _resolve_jwks_url()
    response = httpx.get(url, timeout=10.0)
    response.raise_for_status()
    payload = response.json()
    keys = payload.get('keys', [])
    _jwks_cache['keys'] = keys
    _jwks_cache['fetched_at'] = now
    return keys


def _find_jwk(kid: str | None) -> dict:
    keys = _get_jwks()
    for key in keys:
        if key.get('kid') == kid:
            return key
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Unable to resolve Clerk signing key')


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> ClerkAuthContext:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Missing bearer token')

    token = credentials.credentials
    claims: dict = {}
    if token.count('.') == 2:
        try:
            header = jwt.get_unverified_header(token)
            jwk = _find_jwk(header.get('kid'))

            decode_kwargs = {
                'algorithms': ['RS256'],
                'options': {'verify_aud': False}
            }
            if settings.clerk_issuer:
                decode_kwargs['issuer'] = settings.clerk_issuer

            claims = jwt.decode(token, jwk, **decode_kwargs)
        except JWTError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid Clerk token') from exc
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Token verification failed') from exc
    else:
        if settings.clerk_test_jwt and token == settings.clerk_test_jwt:
            return ClerkAuthContext(user_id='clerk_test_user', session_id='testing-token')

        if not settings.clerk_secret_key:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid non-JWT token')
        try:
            with httpx.Client(timeout=10.0) as client:
                verify = client.post(
                    'https://api.clerk.com/v1/testing_tokens/verify',
                    headers={
                        'Authorization': f'Bearer {settings.clerk_secret_key}',
                        'Content-Type': 'application/json',
                    },
                    json={'testing_token': token},
                )
                verify.raise_for_status()
                payload = verify.json()
            claims = {
                'sub': payload.get('user_id'),
                'sid': payload.get('session_id')
            }
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Testing token verification failed') from exc

    user_id = claims.get('sub')
    session_id = claims.get('sid')
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid Clerk token subject')

    return ClerkAuthContext(user_id=user_id, session_id=session_id)
