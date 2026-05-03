from typing import List
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.session import get_db
from models.ticket import Ticket, TicketStatus, AdminDecision
from schemas.ticket import SubmitRequest, SubmitResponse, TicketResponse, AdminUpdateRequest
from services.predictor import predict_risk_score

router = APIRouter()


@router.post("/submit", response_model=SubmitResponse)
async def submit_url(request: SubmitRequest, db: AsyncSession = Depends(get_db)):
    risk = predict_risk_score(request.url)
    ticket_id = str(uuid.uuid4())

    ticket = Ticket(
        ticket_id=ticket_id,
        url=request.url,
        risk_score=risk,
        status=TicketStatus.submitted,
    )

    db.add(ticket)
    await db.commit()

    return SubmitResponse(ticket_id=ticket_id, risk_score=risk)


@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
async def get_ticket_status(ticket_id: str, db: AsyncSession = Depends(get_db)):
    ticket = await db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.get("/admin/tickets", response_model=List[TicketResponse])
async def list_tickets(db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(Ticket).order_by(Ticket.submitted_at.desc()))
    tickets = q.scalars().all()
    return tickets


@router.get("/admin/tickets/{ticket_id}", response_model=TicketResponse)
async def admin_get_ticket(ticket_id: str, db: AsyncSession = Depends(get_db)):
    ticket = await db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.patch("/admin/tickets/{ticket_id}", response_model=TicketResponse)
async def admin_update_ticket(ticket_id: str, update: AdminUpdateRequest, db: AsyncSession = Depends(get_db)):
    ticket = await db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if update.status is not None:
        ticket.status = update.status
        if update.status == TicketStatus.reviewed:
            ticket.reviewed_at = datetime.utcnow()

    if update.admin_decision is not None:
        ticket.admin_decision = update.admin_decision
        if update.admin_decision in (AdminDecision.phishing, AdminDecision.not_phishing):
            ticket.reviewed_at = datetime.utcnow()

    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)

    return ticket
