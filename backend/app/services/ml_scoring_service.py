from pathlib import Path
import torch
import torch.nn.functional as F
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

MODEL_PATH = Path(__file__).resolve().parent / "ml_model" / "config"


class MLScoringService:
    _tokenizer = None
    _model = None
    _model_loaded = False

    @staticmethod
    def _load_model():
        """Lazy load model on first use"""
        if MLScoringService._model_loaded:
            return
            
        try:
            print("Loading ML model...")
            MLScoringService._tokenizer = AutoTokenizer.from_pretrained(
                MODEL_PATH, trust_remote_code=True, use_fast=False
            )
            MLScoringService._model = AutoModelForSequenceClassification.from_pretrained(
                MODEL_PATH, trust_remote_code=True
            )
            MLScoringService._model.eval()
            print("✅ ML model loaded!")
            MLScoringService._model_loaded = True
        except Exception as e:
            print(f"⚠️ ML model load failed: {str(e)}")
            print("⚠️ Using fallback scoring without ML model")
            MLScoringService._model_loaded = True

    @staticmethod
    def analyze_content(text: str) -> int:
        MLScoringService._load_model()
        
        # Fallback if model not loaded
        if MLScoringService._model is None:
            # Simple keyword-based fallback scoring
            phishing_keywords = [
                "verify", "confirm", "urgent", "click here", "update",
                "suspended", "expired", "malicious", "phishing", "fraud"
            ]
            text_lower = text.lower()
            matches = sum(1 for keyword in phishing_keywords if keyword in text_lower)
            return min(matches * 10, 100)  # Scale to 0-100

        inputs = MLScoringService._tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256,
        )

        with torch.no_grad():
            outputs = MLScoringService._model(**inputs)

        probs = F.softmax(outputs.logits, dim=1)

        phishing_prob = probs[0][1].item()

        return int(phishing_prob * 100)
