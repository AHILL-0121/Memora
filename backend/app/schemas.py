from datetime import datetime
from typing import Literal

from pydantic import BaseModel, HttpUrl


class AuthSessionResponse(BaseModel):
    user_id: str
    session_id: str | None


class UploadSignRequest(BaseModel):
    folder: Literal['photos', 'media', 'targets']
    resource_type: Literal['image', 'video', 'raw', 'auto'] = 'auto'


class UploadSignResponse(BaseModel):
    signature: str
    timestamp: int
    api_key: str
    cloud_name: str
    upload_url: str
    folder: str


class CardCreateRequest(BaseModel):
    name: str = 'My Memora Card'
    photo_url: HttpUrl
    media_url: HttpUrl
    target_url: HttpUrl | None = None
    media_type: Literal['video', 'gif', 'audio']
    is_public: bool = True


class CardUpdateRequest(BaseModel):
    name: str | None = None
    media_url: HttpUrl | None = None
    target_url: HttpUrl | None = None
    media_type: Literal['video', 'gif', 'audio'] | None = None
    is_public: bool | None = None


class CardResponse(BaseModel):
    id: str
    name: str
    photo_url: str
    media_url: str
    media_type: str
    target_url: str | None
    qr_url: str | None
    status: str
    is_public: bool
    scan_count: int
    viewer_url: str
    created_at: datetime


class CardListResponse(BaseModel):
    cards: list[CardResponse]
    total: int


class CardDeleteResponse(BaseModel):
    message: str


class ViewerResponse(BaseModel):
    id: str
    photo_url: str
    media_url: str
    media_type: str
    target_url: str | None
    status: str


class AnalyticsCountryRow(BaseModel):
    country: str
    count: int


class AnalyticsDeviceRow(BaseModel):
    device_type: str
    count: int


class CardAnalyticsResponse(BaseModel):
    card_id: str
    total_scans: int
    scans_last_7_days: int
    scans_last_30_days: int
    by_country: list[AnalyticsCountryRow]
    by_device: list[AnalyticsDeviceRow]


class CompilationCallbackRequest(BaseModel):
    target_url: HttpUrl
    qr_url: HttpUrl
    status: Literal['ready', 'failed']
