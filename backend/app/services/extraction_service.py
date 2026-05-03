"""
Extraction Service: Ekstrak URL dan nomor telepon dari teks menggunakan regex.
"""
import re
from typing import List, Tuple


class DataExtractionService:
    """
    Service untuk mengekstrak URL dan nomor telepon dari teks mentah.
    """
    
    # Pattern regex untuk URL
    URL_PATTERN = r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)'
    
    # Pattern regex untuk nomor telepon Indonesia
    # Cocok dengan format: +62, 0, tanpa prefix, dengan tanda baca
    PHONE_PATTERN = r'(?:(\+62|62|0)[\s\-]?)?(\d{2,4})[\s\-]?(\d{3,4})[\s\-]?(\d{3,4})'
    
    @staticmethod
    def extract_urls(text: str) -> List[str]:
        """
        Ekstrak semua URL dari teks.
        
        Args:
            text: Teks input
            
        Returns:
            List of URLs found
        """
        urls = re.findall(DataExtractionService.URL_PATTERN, text)
        return list(set(urls))  # Remove duplicates
    
    @staticmethod
    def extract_phones(text: str) -> List[str]:
        """
        Ekstrak semua nomor telepon dari teks.
        Normalisasi ke format +62XXXXXXXXXX
        
        Args:
            text: Teks input
            
        Returns:
            List of normalized phone numbers
        """
        matches = re.findall(DataExtractionService.PHONE_PATTERN, text)
        normalized_phones = []
        
        for match in matches:
            # match adalah tuple dari groups: (prefix, area_code, exchange, subscriber)
            prefix = match[0] or ""
            area_code = match[1]
            exchange = match[2]
            subscriber = match[3]
            
            # Buat nomor tanpa tanda baca
            full_number = area_code + exchange + subscriber
            
            # Normalisasi ke format +62
            if prefix in ["+62", "62"]:
                normalized = "+62" + full_number
            elif prefix == "0":
                normalized = "+62" + full_number
            else:
                # Jika tidak ada prefix, asumsikan Indonesia
                normalized = "+62" + full_number
            
            if normalized not in normalized_phones:
                normalized_phones.append(normalized)
        
        return normalized_phones
    
    @staticmethod
    def extract_all(text: str) -> Tuple[List[str], List[str]]:
        """
        Ekstrak URLs dan phones dari teks.
        
        Args:
            text: Teks input
            
        Returns:
            Tuple of (urls, phones)
        """
        urls = DataExtractionService.extract_urls(text)
        phones = DataExtractionService.extract_phones(text)
        return urls, phones
