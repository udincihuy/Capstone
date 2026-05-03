from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from ..models.ticket import TicketStatus, AdminDecision


class SubmitRequest(BaseModel):
    text: str


class SubmitResponse(BaseModel):
    ticket_id: str
    risk_score: Optional[float]


class TicketResponse(BaseModel):
    ticket_id: str
    text: str
    submitted_at: datetime
    status: TicketStatus
    risk_score: Optional[float]
    admin_decision: AdminDecision
    reviewed_at: Optional[datetime]

    class Config:
        orm_mode = True


class AdminUpdateRequest(BaseModel):
    status: Optional[TicketStatus]
    admin_decision: Optional[AdminDecision]
