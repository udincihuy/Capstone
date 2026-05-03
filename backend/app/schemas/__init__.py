"""
Pydantic Schemas untuk request/response di API.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class SubmissionStatusSchema(str, Enum):
    """Status submission."""
    on_review = "on_review"
    reviewed = "reviewed"


class FinalDecisionSchema(str, Enum):
    """Keputusan final."""
    phishing = "phishing"
    safe = "safe"


# ========== Request Schemas ==========
class SubmitMessageRequest(BaseModel):
    """Request untuk submit pesan/teks."""
    raw_message: str = Field(..., min_length=1, max_length=10000)


# ========== Response Schemas ==========
class SubmissionResponse(BaseModel):
    """Response untuk submission yang berhasil."""
    ticket_id: str
    risk_score: float
    extracted_urls: List[str]
    extracted_phones: List[str]
    
    class Config:
        from_attributes = True


class SubmissionDetailResponse(BaseModel):
    """Response detail submission untuk public check."""
    ticket_id: str
    raw_message: str
    extracted_urls: List[str]
    extracted_phones: List[str]
    risk_score: float
    status: SubmissionStatusSchema
    final_decision: Optional[FinalDecisionSchema]
    created_at: datetime
    reviewed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class SubmissionAdminResponse(BaseModel):
    """Response detail submission untuk admin panel."""
    id: int
    ticket_id: str
    raw_message: str
    extracted_urls: List[str]
    extracted_phones: List[str]
    risk_score: float
    status: SubmissionStatusSchema
    final_decision: Optional[FinalDecisionSchema]
    created_at: datetime
    reviewed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AdminUpdateRequest(BaseModel):
    """Request untuk update submission oleh admin."""
    status: SubmissionStatusSchema
    final_decision: FinalDecisionSchema


class WhitelistURLResponse(BaseModel):
    """Response untuk whitelist URL."""
    id: int
    domain: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class WhitelistPhoneResponse(BaseModel):
    """Response untuk whitelist phone."""
    id: int
    phone_number: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
