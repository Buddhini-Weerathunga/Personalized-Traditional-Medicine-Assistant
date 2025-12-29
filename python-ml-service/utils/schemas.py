from pydantic import BaseModel
from typing import Optional, Dict

class QuizFeatures(BaseModel):
    """
    Change keys to exactly match your tabular model feature names.
    For now we keep it generic: you can send a dict from frontend.
    """
    features: Dict[str, float]


class DoshaPredictionResponse(BaseModel):
    dosha_label: str
    probabilities: Optional[Dict[str, float]] = None
