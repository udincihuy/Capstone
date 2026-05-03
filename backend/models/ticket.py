import enum
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, Enum as SAEnum

from .base import Base


class TicketStatus(str, enum.Enum):
    submitted = "submitted"
    on_review = "on_review"
    reviewed = "reviewed"


class AdminDecision(str, enum.Enum):
    pending = "pending"
    phishing = "phishing"
    not_phishing = "not_phishing"


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id = Column(String, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    status = Column(SAEnum(TicketStatus), default=TicketStatus.submitted, nullable=False)
    risk_score = Column(Float, nullable=True)
    admin_decision = Column(SAEnum(AdminDecision), default=AdminDecision.pending, nullable=False)
    reviewed_at = Column(DateTime, nullable=True)


__all__ = ["Ticket", "TicketStatus", "AdminDecision"]
