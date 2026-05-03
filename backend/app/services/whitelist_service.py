"""
Whitelist Service: Validasi URL dan nomor telepon terhadap whitelist.
"""
from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import WhitelistURL, WhitelistPhone


class WhitelistService:
    """
    Service untuk mengecek apakah URL/nomor telepon ada di whitelist.
    Jika TIDAK ada di whitelist, maka mendapat poin risiko +80.
    """
    
    @staticmethod
    async def check_urls_whitelist(db: AsyncSession, urls: List[str]) -> Tuple[List[str], int]:
        """
        Cek apakah URLs ada di whitelist.
        
        Args:
            db: Database session
            urls: List of URLs to check
            
        Returns:
            Tuple of (non_whitelisted_urls, risk_points)
            Risk points: +80 untuk setiap URL yang tidak di whitelist
        """
        if not urls:
            return [], 0
        
        # Ekstrak domain dari URL
        domains = []
        for url in urls:
            # Simple domain extraction: https://example.co.id/path -> example.co.id
            try:
                from urllib.parse import urlparse
                domain = urlparse(url).netloc or url
                domains.append(domain)
            except:
                domains.append(url)
        
        # Query whitelist
        stmt = select(WhitelistURL.domain).where(
            WhitelistURL.domain.in_(domains),
            WhitelistURL.is_active == True
        )
        result = await db.execute(stmt)
        whitelisted_domains = set(result.scalars().all())
        
        # Tentukan mana yang TIDAK di whitelist
        non_whitelisted = [d for d in domains if d not in whitelisted_domains]
        risk_points = len(non_whitelisted) * 80
        
        return non_whitelisted, risk_points
    
    @staticmethod
    async def check_phones_whitelist(db: AsyncSession, phones: List[str]) -> Tuple[List[str], int]:
        """
        Cek apakah nomor telepon ada di whitelist.
        
        Args:
            db: Database session
            phones: List of phone numbers to check
            
        Returns:
            Tuple of (non_whitelisted_phones, risk_points)
            Risk points: +80 untuk setiap nomor yang tidak di whitelist
        """
        if not phones:
            return [], 0
        
        # Query whitelist
        stmt = select(WhitelistPhone.phone_number).where(
            WhitelistPhone.phone_number.in_(phones),
            WhitelistPhone.is_active == True
        )
        result = await db.execute(stmt)
        whitelisted_phones = set(result.scalars().all())
        
        # Tentukan mana yang TIDAK di whitelist
        non_whitelisted = [p for p in phones if p not in whitelisted_phones]
        risk_points = len(non_whitelisted) * 80
        
        return non_whitelisted, risk_points
