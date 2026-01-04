# python-ml-service/models/tabular_dosha_model.py

import os
import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "dosha_tabular_model.pkl")

# Load bundle: model + dummy columns + original feature columns
_bundle = joblib.load(MODEL_PATH)

_model = _bundle["model"]
_dummy_cols = _bundle["dummy_cols"]
_feature_cols = _bundle["feature_cols"]

# We know from training which were numeric originally
_NUMERIC_COLS = [
    "Age",
    "Face_Width_Ratio",
    "Jaw_Width_Ratio",
    "Forehead_Height_Ratio",
    "Body_Weight",
]


def predict_from_features(feature_dict: dict):
    # 1) Build single-row DataFrame with original feature names
    row = {col: feature_dict.get(col) for col in _feature_cols}
    X = pd.DataFrame([row])

    # 2) Ensure numeric columns are numeric (coerce bad values to NaN)
    for col in _NUMERIC_COLS:
        if col in X.columns:
            X[col] = pd.to_numeric(X[col], errors="coerce")

    # 3) One-hot encode with the same logic as training
    X_enc = pd.get_dummies(X, drop_first=False)

    # 4) Reindex to training dummy columns (missing → 0)
    X_enc = X_enc.reindex(columns=_dummy_cols, fill_value=0)

    # 5) Predict probabilities
    probs = _model.predict_proba(X_enc)[0]
    classes = _model.classes_

    top_idx = int(np.argmax(probs))
    dominant = str(classes[top_idx])

    prob_map = {str(label): float(p) for label, p in zip(classes, probs)}

    return dominant, prob_map
