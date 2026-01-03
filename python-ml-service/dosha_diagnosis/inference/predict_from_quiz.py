import joblib
from typing import Dict

from config import TABULAR_MODEL_PATH
from utils.logging_utils import get_logger

logger = get_logger(__name__)

_model_cache = None

def load_tabular_model():
    global _model_cache
    if _model_cache is None:
        logger.info(f"Loading tabular model from: {TABULAR_MODEL_PATH}")
        _model_cache = joblib.load(TABULAR_MODEL_PATH)
    return _model_cache


def predict_dosha_from_quiz(features: Dict[str, float]) -> str:
    model = load_tabular_model()

    import pandas as pd
    X = pd.DataFrame([features])
    pred = model.predict(X)[0]
    # if your model supports predict_proba, you can also return probabilities
    return str(pred)
