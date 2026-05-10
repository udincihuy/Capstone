"""
Scoring Aggregator: Menggabungkan semua poin risiko menjadi satu skor final (0-100).
"""
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.extraction_service import DataExtractionService
from app.services.whitelist_service import WhitelistService
from app.services.ml_scoring_service import MLScoringService


class ScoringAggregator:
    """
    Agregator untuk menggabungkan semua scoring dari berbagai source.
    Skor final: 0-100
    """
    
    @staticmethod
    async def calculate_risk_score(db: AsyncSession, raw_message: str) -> dict:
        """
        Hitung skor risiko dari sebuah pesan dengan menggabungkan:
        1. Extraction (URL/Phone)
        2. Whitelist checking
        3. ML/NLP content analysis
        
        Latensi target: < 3 detik
        
        Args:
            db: Database session
            raw_message: Teks input dari user
            
        Returns:
            dict dengan keys:
            - risk_score: Skor akhir (0-100)
            - extracted_urls: List of URLs
            - extracted_phones: List of phone numbers
            - non_whitelisted_urls: URLs yang tidak di whitelist
            - non_whitelisted_phones: Phones yang tidak di whitelist
            - ml_score: Skor dari content analysis
            - breakdown: Breakdown dari setiap komponen score
        """
        
        # ===== STEP 1: Ekstrak URLs dan Phones =====
        extracted_urls, extracted_phones = DataExtractionService.extract_all(raw_message)
        
        # ===== STEP 2: Validasi Whitelist =====
        non_whitelisted_urls, url_risk_points = await WhitelistService.check_urls_whitelist(
            db, extracted_urls
        )
        non_whitelisted_phones, phone_risk_points = await WhitelistService.check_phones_whitelist(
            db, extracted_phones
        )
        
        # ===== STEP 3: ML Scoring =====
        ml_score = MLScoringService.analyze_content(raw_message)
        
        # ===== STEP 4: Agregasi Skor =====
        # Combine scores dari URL whitelist, Phone whitelist, dan ML
        # Gunakan weighted average atau simple sum dengan cap
        total_risk_points = url_risk_points + phone_risk_points + ml_score
        final_score = min(total_risk_points, 100)  # Cap at 100
        
        result = {
            "risk_score": final_score,
            "extracted_urls": extracted_urls,
            "extracted_phones": extracted_phones,
            "non_whitelisted_urls": non_whitelisted_urls,
            "non_whitelisted_phones": non_whitelisted_phones,
            "ml_score": ml_score,
            "breakdown": {
                "url_risk_points": url_risk_points,
                "phone_risk_points": phone_risk_points,
                "ml_score": ml_score,
            }
        }
        
        return result
