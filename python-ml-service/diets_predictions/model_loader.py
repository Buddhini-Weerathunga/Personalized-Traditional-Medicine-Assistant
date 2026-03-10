# ml_models/model_loader.py
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "diets_models")

# Load models
suitability_model = joblib.load(
    os.path.join(MODEL_DIR, "suitability_model.pkl")
)

alt_meal_model = joblib.load(
    os.path.join(MODEL_DIR, "alt_meal_model.pkl")
)
alt_meal_encoder = joblib.load(
    os.path.join(MODEL_DIR, "alt_meal_encoder.pkl")
)

dietary_advice_model = joblib.load(
    os.path.join(MODEL_DIR, "dietary_advice_model.pkl")
)
dietary_advice_encoder = joblib.load(
    os.path.join(MODEL_DIR, "dietary_advice_encoder.pkl")
)

print("✅ Ayurveda ML models loaded successfully")
