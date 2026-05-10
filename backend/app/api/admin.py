"""
API Router untuk Admin Endpoints (admin panel).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime
from typing import List

from app.core.database import get_db
from app.models import Submission, SubmissionStatus, FinalDecision
from app.schemas import SubmissionAdminResponse, AdminUpdateRequest

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/submissions", response_model=List[SubmissionAdminResponse])
async def list_submissions(
    db: AsyncSession = Depends(get_db),
    sort_by_risk: bool = True,
    limit: int = 100,
):
    """
    Endpoint untuk admin lihat semua submission.
    
    Query Parameters:
    - sort_by_risk: Jika True, urutkan berdasarkan risk_score DESC (Triage)
    - limit: Jumlah record yang ditampilkan (default 100)
    
    Response: List dari semua submission dengan detail lengkap.
    """
    query = select(Submission)
    
    if sort_by_risk:
        query = query.order_by(desc(Submission.risk_score))
    else:
        query = query.order_by(desc(Submission.created_at))
    
    query = query.limit(limit)
    
    result = await db.execute(query)
    submissions = result.scalars().all()
    
    return [SubmissionAdminResponse.model_validate(s) for s in submissions]


@router.get("/submissions/{ticket_id}", response_model=SubmissionAdminResponse)
async def get_submission_detail(
    ticket_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint untuk admin lihat detail satu submission.
    """
    stmt = select(Submission).where(Submission.ticket_id == ticket_id)
    result = await db.execute(stmt)
    submission = result.scalars().first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return SubmissionAdminResponse.model_validate(submission)


@router.put("/submissions/{ticket_id}", response_model=SubmissionAdminResponse)
async def update_submission(
    ticket_id: str,
    update: AdminUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint untuk admin update status dan keputusan final dari submission.
    
    Request body:
    {
        "status": "reviewed",
        "final_decision": "phishing" atau "safe"
    }
    
    Response: Updated submission detail.
    """
    stmt = select(Submission).where(Submission.ticket_id == ticket_id)
    result = await db.execute(stmt)
    submission = result.scalars().first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Update fields
    submission.status = update.status
    submission.final_decision = update.final_decision
    
    # Set reviewed_at jika status menjadi "reviewed"
    if update.status == SubmissionStatus.reviewed:
        submission.reviewed_at = datetime.utcnow()
    
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    
    return SubmissionAdminResponse.model_validate(submission)
