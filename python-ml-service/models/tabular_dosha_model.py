# python-ml-service/models/tabular_dosha_model.py

import joblib
import pandas as pd
from typing import Dict, Any

_MODEL_BUNDLE = None
MODEL_PATH = "models/dosha_tabular_model.pkl"


def load_tabular_model():
    """
    Lazy-load the trained tabular dosha model bundle.
    Bundle structure:
      - "pipeline": sklearn Pipeline (preprocessor + RandomForest)
      - "feature_cols": list of feature names in correct order
    """
    global _MODEL_BUNDLE
    if _MODEL_BUNDLE is None:
        _MODEL_BUNDLE = joblib.load(MODEL_PATH)
    return _MODEL_BUNDLE


def predict_from_features(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    payload: dict coming from API request.
    Keys must contain the feature columns used in training.

    Returns dict:
      {
        "dominant_dosha": "...",
        "probabilities": { "Vata": ..., "Pitta": ..., "Kapha": ... },
        "used_features": [...]
      }
    """
    bundle = load_tabular_model()
    pipeline = bundle["pipeline"]
    feature_cols = bundle["feature_cols"]

    # Make sure data goes in with correct columns & order
    row = {col: payload.get(col) for col in feature_cols}
    df = pd.DataFrame([row])

    # Predict class and probabilities
    proba = pipeline.predict_proba(df)[0]
    pred = pipeline.predict(df)[0]
    classes = pipeline.classes_

    prob_dict = {str(classes[i]): float(proba[i]) for i in range(len(classes))}

    return {
        "dominant_dosha": str(pred),
        "probabilities": prob_dict,
        "used_features": feature_cols,
    }
