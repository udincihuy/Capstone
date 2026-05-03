"""
ML Scoring Service: Mock/placeholder untuk NLP content analysis.
Akan diganti dengan IndoBERT model nanti.
"""
import re


class MLScoringService:
    """
    Service untuk NLP-based content analysis.
    Mock implementation sementara sebelum IndoBERT diintegrasikan.
    """
    
    # Keyword-keyword yang menunjukkan teks manipulatif/phishing
    URGENT_KEYWORDS = [
        "urgen", "segera", "cepat", "jangan", "harus", "wajib",
        "terbatas", "deadline", "akhir", "langsung", "sekarang",
        "danger", "bahaya", "waspada", "perhatian", "alert",
    ]
    
    SUSPICIOUS_PHRASES = [
        "klik di sini", "buka tautan", "verifikasi akun",
        "konfirmasi identitas", "update data", "ubah password",
        "amankan akun", "aktivasi", "activate", "verify",
        "confirm", "update", "claim", "collect", "redeem",
    ]
    
    @staticmethod
    def analyze_content(text: str, has_urls: bool = False, has_phones: bool = False) -> int:
        """
        Analisis konten teks untuk mendeteksi indikasi phishing/manipulasi.
        Mock function yang akan diganti dengan model IndoBERT.
        
        Logika:
        1. Jika teks HANYA teks (tanpa URL/nomor telp) dan terdeteksi manipulatif -> skor 100
        2. Jika ada indikasi manipulatif -> +20 poin
        3. Jika ada urgent keywords -> +15 poin
        
        Args:
            text: Teks input
            has_urls: Apakah teks mengandung URL
            has_phones: Apakah teks mengandung nomor telepon
            
        Returns:
            Risk score (0-100)
        """
        score = 0
        text_lower = text.lower()
        
        # Hitung jumlah urgent keywords
        urgent_count = sum(1 for kw in MLScoringService.URGENT_KEYWORDS if kw in text_lower)
        score += urgent_count * 15
        
        # Hitung jumlah suspicious phrases
        suspicious_count = sum(1 for phrase in MLScoringService.SUSPICIOUS_PHRASES if phrase in text_lower)
        score += suspicious_count * 20
        
        # Jika teks murni (tanpa link/nomor) dan manipulatif -> skor 100
        if not has_urls and not has_phones and suspicious_count >= 2:
            return 100
        
        # Cap pada 100
        return min(score, 100)
