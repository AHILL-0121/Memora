from datetime import datetime, timezone

import cloudinary
import cloudinary.utils
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import settings
from app.core.security import ClerkAuthContext, get_current_user
from app.schemas import UploadSignRequest, UploadSignResponse

router = APIRouter(prefix='/upload', tags=['upload'])

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


@router.post('/sign', response_model=UploadSignResponse)
def sign_upload(payload: UploadSignRequest, current_user: ClerkAuthContext = Depends(get_current_user)):
    if not settings.cloudinary_cloud_name or not settings.cloudinary_api_key or not settings.cloudinary_api_secret:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Cloudinary is not configured')

    timestamp = int(datetime.now(timezone.utc).timestamp())
    folder = f"memora/{current_user.user_id}/{payload.folder}"
    signature = cloudinary.utils.api_sign_request(
        {'timestamp': timestamp, 'folder': folder},
        settings.cloudinary_api_secret,
    )

    return UploadSignResponse(
        signature=signature,
        timestamp=timestamp,
        api_key=settings.cloudinary_api_key,
        cloud_name=settings.cloudinary_cloud_name,
        upload_url=f"https://api.cloudinary.com/v1_1/{settings.cloudinary_cloud_name}/{payload.resource_type}/upload",
        folder=folder,
    )
