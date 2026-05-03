"""
Database Models untuk sistem anti-phishing.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, Boolean, Enum as SAEnum
from app.core.database import Base
import enum
import uuid


class SubmissionStatus(str, enum.Enum):
    """Status dari submission."""
    on_review = "on_review"
    reviewed = "reviewed"


class FinalDecision(str, enum.Enum):
    """Keputusan final dari submission."""
    phishing = "phishing"
    safe = "safe"


class Submission(Base):
    """
    Model untuk menyimpan submission dari user.
    Berisi teks mentah, ekstraksi URL/nomor telepon, skor risiko, dan status review.
    """
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    raw_message = Column(Text, nullable=False)
    extracted_urls = Column(JSON, default=list)  # Array of URLs
    extracted_phones = Column(JSON, default=list)  # Array of phone numbers
    risk_score = Column(Float, default=0.0)  # 0-100
    status = Column(SAEnum(SubmissionStatus), default=SubmissionStatus.on_review)
    final_decision = Column(SAEnum(FinalDecision), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)


class WhitelistURL(Base):
    """
    Model untuk whitelist URL/domain resmi.
    Jika URL tidak ada di whitelist, akan mendapat poin risiko +80.
    """
    __tablename__ = "whitelist_urls"
    
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class WhitelistPhone(Base):
    """
    Model untuk whitelist nomor telepon resmi.
    Jika nomor tidak ada di whitelist, akan mendapat poin risiko +80.
    """
    __tablename__ = "whitelist_phones"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
