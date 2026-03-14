import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class CardStatus(str, enum.Enum):
    processing = 'processing'
    ready = 'ready'
    failed = 'failed'


class MediaType(str, enum.Enum):
    video = 'video'
    gif = 'gif'
    audio = 'audio'


class Card(Base):
    __tablename__ = 'cards'

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id: Mapped[str] = mapped_column(String(255), index=True)
    name: Mapped[str] = mapped_column(String(255), default='My Memora Card')
    photo_url: Mapped[str] = mapped_column(Text)
    media_url: Mapped[str] = mapped_column(Text)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType), default=MediaType.video)
    target_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    qr_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[CardStatus] = mapped_column(Enum(CardStatus), default=CardStatus.processing)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    scan_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    scans: Mapped[list['ScanLog']] = relationship('ScanLog', back_populates='card', cascade='all, delete-orphan')


class ScanLog(Base):
    __tablename__ = 'scan_logs'

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    card_id: Mapped[str] = mapped_column(String(36), ForeignKey('cards.id', ondelete='CASCADE'), index=True)
    scanned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ip_address: Mapped[str | None] = mapped_column(String(100), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    device_type: Mapped[str | None] = mapped_column(String(50), nullable=True)

    card: Mapped[Card] = relationship('Card', back_populates='scans')
