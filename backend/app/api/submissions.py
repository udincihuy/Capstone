"""
API Router untuk Public Endpoints (tanpa authentication).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.core.database import get_db
from app.models import Submission, SubmissionStatus, FinalDecision
from app.schemas import SubmitMessageRequest, SubmissionResponse, SubmissionDetailResponse
from app.services import ScoringAggregator

router = APIRouter(prefix="/api", tags=["submissions"])


@router.post("/submissions", response_model=SubmissionResponse)
async def submit_message(
    request: SubmitMessageRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint untuk user submit pesan mencurigakan.
    
    Flow:
    1. Ekstrak URLs dan nomor telepon
    2. Cek whitelist
    3. Jalankan ML scoring
    4. Simpan ke database
    5. Return ticket_id dan risk_score
    
    Response:
    - ticket_id: ID unik untuk tracking
    - risk_score: Skor risiko (0-100)
    - extracted_urls: Daftar URL yang diekstrak
    - extracted_phones: Daftar nomor telepon yang diekstrak
    """
    try:
        # Hitung risk score
        scoring_result = await ScoringAggregator.calculate_risk_score(
            db,
            request.raw_message
        )
        
        # Buat record submission baru
        submission = Submission(
            raw_message=request.raw_message,
            extracted_urls=scoring_result["extracted_urls"],
            extracted_phones=scoring_result["extracted_phones"],
            risk_score=scoring_result["risk_score"],
            status=SubmissionStatus.on_review,
        )
        
        db.add(submission)
        await db.commit()
        await db.refresh(submission)
        
        return SubmissionResponse(
            ticket_id=submission.ticket_id,
            risk_score=submission.risk_score,
            extracted_urls=submission.extracted_urls,
            extracted_phones=submission.extracted_phones,
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Error processing submission: {str(e)}")


@router.get("/submissions/{ticket_id}", response_model=SubmissionDetailResponse)
async def get_submission_status(
    ticket_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint untuk user cek status dan detail submission mereka.
    Gunakan ticket_id untuk lookup.
    
    Response: Detail submission termasuk skor risiko dan keputusan final (jika sudah direview).
    """
    from sqlalchemy import select
    
    stmt = select(Submission).where(Submission.ticket_id == ticket_id)
    result = await db.execute(stmt)
    submission = result.scalars().first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return SubmissionDetailResponse.from_attributes(submission)
