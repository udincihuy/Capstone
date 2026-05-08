from pathlib import Path
import torch
import torch.nn.functional as F
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

MODEL_PATH = Path(__file__).resolve().parent / "ml_model"


class MLScoringService:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

    model.eval()

    @staticmethod
    def analyze_content(text: str) -> int:

        inputs = MLScoringService.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256,
        )

        with torch.no_grad():
            outputs = MLScoringService.model(**inputs)

        probs = F.softmax(outputs.logits, dim=1)

        phishing_prob = probs[0][1].item()

        return int(phishing_prob * 100)
