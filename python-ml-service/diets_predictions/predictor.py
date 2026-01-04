# ml_models/predictor.py
import pandas as pd
from .model_loader import (
    suitability_model,
    alt_meal_model,
    alt_meal_encoder,
    dietary_advice_model,
    dietary_advice_encoder
)

FEATURES = [
    "vata_score_percent",
    "pitta_score_percent",
    "kapha_score_percent",
    "meal_time",
    "meal_name",
    "portion_size",
    "food_spicy",
    "food_oily",
    "physical_activity",
    "climate"
]

def predict_diet(data: dict):
    """
    data = input JSON from frontend
    """

    df = pd.DataFrame([data], columns=FEATURES)

    # 1️⃣ Suitability score
    suitability = suitability_model.predict(df)[0]

    # 2️⃣ Alternative meal
    alt_pred = alt_meal_model.predict(df)[0]
    alt_meal = alt_meal_encoder.inverse_transform([alt_pred])[0]

    # 3️⃣ Dietary advice
    advice_pred = dietary_advice_model.predict(df)[0]
    advice = dietary_advice_encoder.inverse_transform([advice_pred])[0]

    return {
        "suitability_rating": round(float(suitability), 2),
        "recommended_alternative_meal": alt_meal,
        "dietary_advice": advice
    }
