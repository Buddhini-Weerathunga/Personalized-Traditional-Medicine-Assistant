from typing import Dict

from utils.logging_utils import get_logger

logger = get_logger(__name__)

def predict_combined(quiz_features: Dict[str, float], face_probs: Dict[str, float]) -> str:
    """
    Very simple rule-based fusion for now:
    - Take average between quiz and vision probabilities if both available.
    """
    combined = {}

    for dosha in set(list(quiz_features.keys()) + list(face_probs.keys())):
        q = quiz_features.get(dosha, 0.0)
        v = face_probs.get(dosha, 0.0)
        combined[dosha] = (q + v) / 2.0

    best = max(combined.items(), key=lambda x: x[1])[0]
    logger.info(f"Combined prediction: {combined} -> {best}")
    return best
