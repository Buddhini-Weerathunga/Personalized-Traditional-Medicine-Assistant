from pathlib import Path
import pandas as pd
import joblib

# ================= LOAD MODELS =================
BASE_DIR = Path(__file__).resolve().parent

scaler = joblib.load(BASE_DIR / "scaler.pkl")
ordinal_encoder = joblib.load(BASE_DIR / "ordinal_encoder.pkl")

dosha_risk_model = joblib.load(BASE_DIR / "dosha_risk_model.pkl")
health_risk_model = joblib.load(BASE_DIR / "health_risk_model.pkl")
dosha_type_model = joblib.load(BASE_DIR / "dosha_type_model.pkl")
meta_model = joblib.load(BASE_DIR / "meta_condition_model.pkl")

model_config = joblib.load(BASE_DIR / "model_config.pkl")

FEATURE_COLUMNS = model_config["feature_columns"]
NUMERIC_COLS = model_config["numeric_cols"]
ORDINAL_COLS = model_config["ordinal_columns"]

# ================= PREPROCESS FUNCTION =================
def preprocess_patient_input(data: dict):
    df = pd.DataFrame([data])

    # Ensure ordinal columns exist
    for col in ORDINAL_COLS:
        if col not in df:
            df[col] = "Moderate"
        df[col] = df[col].fillna("Moderate")

    df[ORDINAL_COLS] = ordinal_encoder.transform(df[ORDINAL_COLS])

    # Manual categorical encoding
    df["veg_nonveg"] = df["veg_nonveg"].map({
        "Vegetarian": 0,
        "Eggetarian": 1,
        "Non-Vegetarian": 2
    })

    df["gender"] = df["gender"].map({
        "Female": 0,
        "Male": 1,
        "Other": 2
    })

    for col in [
        "family_diabetes", "family_thyroid", "family_cholesterol",
        "family_obesity", "family_asthma",
        "family_heart_disease", "family_mental_health"
    ]:
        df[col] = df[col].map({"Yes": 1, "No": 0})

    for col in FEATURE_COLUMNS:
        if col not in df:
            df[col] = 0

    df = df[FEATURE_COLUMNS]
    df[NUMERIC_COLS] = scaler.transform(df[NUMERIC_COLS])

    return df


def predict_health(patient: dict):
    X = preprocess_patient_input(patient)

    dosha_risk = dosha_risk_model.predict(X)[0]
    health_risk = health_risk_model.predict(X)[0]

    dosha_code = dosha_type_model.predict(X)[0]
    dosha_map = {0: "Vata", 1: "Pitta", 2: "Kapha"}

    meta_X = pd.DataFrame([list(dosha_risk) + list(health_risk)])
    primary_condition, risk_level = meta_model.predict(meta_X)[0]

    return {
        "predicted_dosha": dosha_map[int(dosha_code)],
        "dosha_risk": {
            "vata": float(dosha_risk[0]),
            "pitta": float(dosha_risk[1]),
            "kapha": float(dosha_risk[2])
        },
        "primary_future_condition": primary_condition,
        "risk_level": risk_level
    }
