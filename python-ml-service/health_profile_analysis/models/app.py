from pathlib import Path
import pandas as pd
import joblib
import numpy as np
from typing import Dict, Any

# ================= LOAD ALL TRAINED MODELS =================
BASE_DIR = Path(__file__).resolve().parent

scaler = joblib.load(BASE_DIR / "scaler.pkl")
ordinal_encoder = joblib.load(BASE_DIR / "ordinal_encoder.pkl")

print("Loading models...")
dosha_risk_model = joblib.load(BASE_DIR / "dosha_risk_model.pkl")
health_risk_model = joblib.load(BASE_DIR / "health_risk_model.pkl")
dosha_type_model = joblib.load(BASE_DIR / "dosha_type_model.pkl")
meta_model = joblib.load(BASE_DIR / "meta_condition_model.pkl")

model_config = joblib.load(BASE_DIR / "model_config.pkl")

FEATURE_COLUMNS = model_config["feature_columns"]
NUMERIC_COLS = model_config["numeric_cols"]
ORDINAL_COLS = model_config["ordinal_columns"]

DOSHA_TARGETS = model_config["dosha_targets"]
HEALTH_TARGETS = model_config["health_targets"]
META_TARGETS = model_config["meta_targets"]

print(f"✓ Loaded {len(FEATURE_COLUMNS)} features")
print(f"✓ Loaded {len(HEALTH_TARGETS)} health risk targets")


# ================= DYNAMIC THRESHOLDS =================
HEALTH_RISK_THRESHOLDS = {
    "risk_joint_pain": 0.42,
    "risk_anxiety": 0.45,
    "risk_insomnia": 0.48,
    "risk_constipation": 0.40,
    "risk_gas_bloating": 0.43,
    "risk_cold_feet_hands": 0.50,
    "risk_acidity_ulcers": 0.44,
    "risk_skin_rash": 0.47,
    "risk_irritability": 0.46,
    "risk_diarrhea": 0.49,
    "risk_heat_intolerance": 0.45,
    "risk_hair_fall_pitta": 0.51,
    "risk_weight_gain": 0.38,
    "risk_sluggishness": 0.43,
    "risk_cold_cough": 0.46,
    "risk_water_retention": 0.44,
    "risk_diabetes_tendency": 0.35,
    "risk_high_cholesterol": 0.37
}


# ================= PREPROCESSING =================
def preprocess_patient_input(data: Dict[str, Any]) -> pd.DataFrame:
    """Enhanced preprocessing with proper feature mapping"""
    df = pd.DataFrame([data])
    
    # Handle Ordinal Columns
    ordinal_mapping = {
        "body_frame": {"thin": 0, "medium": 1, "heavy": 2},
        "meal_regular": {"No": 0, "Sometime": 1, "Yes": 2},
        "appetite_level": {"Low": 0, "Moderate": 1, "High": 2, "Variable": 3},
        "urine_color": {"clear": 0, "Pale Yellow": 1, "Yellow": 2, "Dark Yellow": 3},
        "environment_temperature": {"cold": 0, "Moderate": 1, "hot": 2},
        "environment_humidity": {"cold": 0, "Moderate": 1, "hot": 2},
        "environment_wind": {"cold": 0, "Moderate": 1, "hot": 2}
    }
    
    for col in ORDINAL_COLS:
        if col in df.columns:
            val = str(df[col].iloc[0]).lower().strip()
            
            if col == "body_frame":
                if "thin" in val or "slim" in val or "lean" in val:
                    df[col] = "thin"
                elif "heavy" in val or "large" in val or "obese" in val:
                    df[col] = "heavy"
                else:
                    df[col] = "medium"
                    
            elif col == "meal_regular":
                if "no" in val or "irregular" in val:
                    df[col] = "No"
                elif "yes" in val or "regular" in val:
                    df[col] = "Yes"
                else:
                    df[col] = "Sometime"
                    
            elif col == "appetite_level":
                if "low" in val:
                    df[col] = "Low"
                elif "high" in val:
                    df[col] = "High"
                elif "variable" in val or "varies" in val:
                    df[col] = "Variable"
                else:
                    df[col] = "Moderate"
                    
            elif col == "urine_color":
                if "clear" in val:
                    df[col] = "clear"
                elif "pale" in val:
                    df[col] = "Pale Yellow"
                elif "dark" in val:
                    df[col] = "Dark Yellow"
                else:
                    df[col] = "Yellow"
                    
            elif col in ["environment_temperature", "environment_humidity", "environment_wind"]:
                if "cold" in val or "cool" in val:
                    df[col] = "cold"
                elif "hot" in val or "warm" in val:
                    df[col] = "hot"
                else:
                    df[col] = "Moderate"
        else:
            df[col] = "Moderate" if col != "body_frame" else "medium"
    
    # Apply ordinal encoding
    for col in ORDINAL_COLS:
        if col in ordinal_mapping:
            df[col] = df[col].map(ordinal_mapping[col]).fillna(1).astype('int8')
    
    # Handle Categorical Variables
    if "veg_nonveg" in df.columns:
        val = str(df["veg_nonveg"].iloc[0]).lower()
        if "vegetarian" in val and "non" not in val:
            df["veg_nonveg"] = 0
        elif "non" in val or "meat" in val:
            df["veg_nonveg"] = 2
        else:
            df["veg_nonveg"] = 1
    else:
        df["veg_nonveg"] = 1
    
    if "gender" in df.columns:
        val = str(df["gender"].iloc[0]).lower()
        if "male" in val and "fe" not in val:
            df["gender"] = 1
        elif "other" in val:
            df["gender"] = 2
        else:
            df["gender"] = 0
    else:
        df["gender"] = 0
    
    # Handle Binary Family History
    family_cols = [
        "family_diabetes", "family_thyroid", "family_cholesterol",
        "family_obesity", "family_asthma", "family_heart_disease", 
        "family_mental_health"
    ]
    
    for col in family_cols:
        if col in df.columns:
            val = str(df[col].iloc[0]).lower()
            df[col] = 1 if "yes" in val or "true" in val or val == "1" else 0
        else:
            df[col] = 0
    
    # Add Missing Features with Smart Defaults
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            if "stress" in col.lower():
                df[col] = 2
            elif "sleep" in col.lower():
                df[col] = 2
            elif "spicy" in col.lower() or "oily" in col.lower():
                df[col] = 2
            elif "sweet" in col.lower():
                df[col] = 2
            elif "caffeine" in col.lower():
                df[col] = 1
            elif "processed" in col.lower():
                df[col] = 1
            else:
                df[col] = 0
    
    df = df[FEATURE_COLUMNS]
    df_scaled = df.copy()
    df_scaled[NUMERIC_COLS] = scaler.transform(df[NUMERIC_COLS])
    
    return df_scaled


# ================= PREDICTION FUNCTION =================
def predict_health(patient: Dict[str, Any]) -> Dict[str, Any]:
    """High-performance prediction with variance"""
    X = preprocess_patient_input(patient)
    
    # Dosha Risk Regression
    dosha_risk_values = dosha_risk_model.predict(X)[0]
    dosha_sum = np.sum(np.abs(dosha_risk_values))
    if dosha_sum > 0:
        dosha_risk_normalized = np.abs(dosha_risk_values) / dosha_sum
    else:
        dosha_risk_normalized = np.array([0.33, 0.33, 0.34])
    
    dosha_risk = {
        DOSHA_TARGETS[i]: float(dosha_risk_normalized[i]) 
        for i in range(len(DOSHA_TARGETS))
    }
    
    # Health Risk Classification
    probs = health_risk_model.predict_proba(X)
    health_risk_binary = {}
    health_risk_scores = {}
    
    for i, target in enumerate(HEALTH_TARGETS):
        prob = float(probs[i][0][1]) if len(probs[i][0]) > 1 else 0.0
        threshold = HEALTH_RISK_THRESHOLDS.get(target, 0.45)
        prob_adjusted = prob * np.random.uniform(0.95, 1.05)
        prob_adjusted = np.clip(prob_adjusted, 0.0, 1.0)
        
        health_risk_scores[target] = round(prob_adjusted, 4)
        health_risk_binary[target] = int(prob_adjusted >= threshold)
    
    # Dosha Type Classification
    dosha_probs = dosha_type_model.predict_proba(X)[0]
    dosha_code = int(np.argmax(dosha_probs))
    dosha_map = {0: "Vata", 1: "Pitta", 2: "Kapha"}
    predicted_dosha = dosha_map[dosha_code]
    
    dosha_dist_sum = np.sum(dosha_probs)
    if dosha_dist_sum > 0:
        dosha_distribution = {
            "Vata": float(dosha_probs[0] / dosha_dist_sum),
            "Pitta": float(dosha_probs[1] / dosha_dist_sum),
            "Kapha": float(dosha_probs[2] / dosha_dist_sum)
        }
    else:
        dosha_distribution = {"Vata": 0.33, "Pitta": 0.33, "Kapha": 0.34}
    
    # Meta Model
    meta_X = pd.DataFrame(
        [list(dosha_risk_normalized) + list(health_risk_binary.values())],
        columns=DOSHA_TARGETS + HEALTH_TARGETS
    )
    
    meta_predictions = meta_model.predict(meta_X)[0]
    primary_condition = str(meta_predictions[0])
    risk_level = str(meta_predictions[1])
    
    # Generate Recommendations - PASS ALL DATA
    recommendations = generate_recommendations(
        dosha_risk=dosha_risk,
        health_risks=health_risk_binary,
        predicted_dosha=predicted_dosha,
        patient_data=patient
    )
    
    return {
       
        "dosha_risk": dosha_risk,
        "health_risk": {
            k: {
                "present": health_risk_binary[k],
                "probability": health_risk_scores[k]
            } for k in HEALTH_TARGETS
        },
        
        
        "recommendations": recommendations
    }


def dosha_severity(value: float) -> str:
    """Categorize dosha imbalance severity"""
    if value >= 0.50:
        return "high"
    elif value >= 0.35:
        return "moderate"
    else:
        return "low"


# ================= ENHANCED RECOMMENDATION ENGINE =================
def generate_recommendations(
    dosha_risk: Dict[str, float],
    health_risks: Dict[str, int],
    predicted_dosha: str,
    patient_data: Dict[str, Any]
) -> Dict[str, str]:
    """
    Generate UNIQUE recommendations based on:
    - Dosha imbalance risks
    - Active health risks
    - Predicted dosha type
    - Patient lifestyle data
    """
    vata_risk = dosha_risk.get("future_vata_imbalance_risk", 0)
    pitta_risk = dosha_risk.get("future_pitta_imbalance_risk", 0)
    kapha_risk = dosha_risk.get("future_kapha_imbalance_risk", 0)
    
    vata_lvl = dosha_severity(vata_risk)
    pitta_lvl = dosha_severity(pitta_risk)
    kapha_lvl = dosha_severity(kapha_risk)
    
    # Identify active health risks
    active_risks = [k for k, v in health_risks.items() if v == 1]
    
    # Get patient lifestyle factors
    age = patient_data.get("age", 30)
    body_frame = str(patient_data.get("body_frame", "medium")).lower()
    stress = patient_data.get("stress_level", 2)
    sleep = patient_data.get("sleep_quality", 2)
    
    rec = {
        "diet": "",
        "lifestyle": "",
        "yoga": "",
        "herbal": "",
        "daily_habits": "",
        "avoid": ""
    }
    
    # ========== VATA-SPECIFIC RECOMMENDATIONS ==========
    if vata_lvl == "high" or predicted_dosha == "Vata":
        rec["diet"] += (
            f"Focus on warm, moist, grounding foods. Eat cooked vegetables, soups, "
            f"stews, whole grains (rice, oats), ghee, and warm milk. "
            f"Favor sweet, sour, and salty tastes. "
        )
        
        if "risk_anxiety" in active_risks or stress >= 3:
            rec["diet"] += "Include calming foods like warm milk with nutmeg, dates, and almonds. "
        
        if "risk_constipation" in active_risks:
            rec["diet"] += "Increase fiber with cooked prunes, figs, and flaxseeds. "
        
        rec["lifestyle"] += (
            f"Establish a strict daily routine. Wake and sleep at the same time daily. "
            f"Practice oil massage (Abhyanga) with warm sesame oil. "
            f"Avoid excessive travel, loud environments, and multitasking. "
        )
        
        if "risk_insomnia" in active_risks or sleep <= 2:
            rec["lifestyle"] += "Create a calming bedtime routine: warm bath, gentle music, no screens 1 hour before bed. "
        
        rec["yoga"] += (
            "Practice grounding yoga: slow Hatha yoga, forward bends (Paschimottanasana), "
            "child's pose (Balasana), legs-up-the-wall (Viparita Karani). "
            "Focus on slow, deep breathing (Nadi Shodhana). "
        )
        
        rec["herbal"] += (
            "Ashwagandha (300mg twice daily) for stress and anxiety, "
            "Brahmi for mental clarity, Bala for strength. "
            "Triphala before bed for gentle detox. "
        )
        
        rec["avoid"] += (
            "Avoid cold, dry, raw foods. No ice water, salads, or fasting. "
            "Reduce caffeine, stimulants, and refined sugar. "
        )
    
    # ========== PITTA-SPECIFIC RECOMMENDATIONS ==========
    if pitta_lvl == "high" or predicted_dosha == "Pitta":
        rec["diet"] += (
            f"Choose cooling, alkaline foods. Eat sweet fruits (melons, grapes), "
            f"leafy greens, cucumber, coconut, rice, and milk. "
            f"Favor sweet, bitter, and astringent tastes. "
        )
        
        if "risk_acidity_ulcers" in active_risks:
            rec["diet"] += "Drink aloe vera juice, eat ripe bananas, and avoid citrus. "
        
        if "risk_skin_rash" in active_risks:
            rec["diet"] += "Include cooling herbs like coriander, fennel, and mint tea. "
        
        if "risk_irritability" in active_risks:
            rec["diet"] += "Reduce stimulants; add rose water to water, consume sweet lassi. "
        
        rec["lifestyle"] += (
            f"Avoid excessive heat, sun exposure, and competitive activities. "
            f"Practice forgiveness and patience. Take cool showers. "
            f"Spend time in nature, near water. "
        )
        
        rec["yoga"] += (
            "Practice cooling yoga: Chandra Namaskar (Moon Salutation), "
            "forward bends, gentle twists, Shitali pranayama (cooling breath). "
            "Avoid hot yoga or power yoga. "
        )
        
        rec["herbal"] += (
            "Amalaki (Indian Gooseberry) for cooling and digestion, "
            "Guduchi for immunity, Neem for blood purification, "
            "Shatavari for hormonal balance. "
        )
        
        rec["avoid"] += (
            "Avoid spicy, salty, sour, and fried foods. "
            "No alcohol, red meat, hot peppers, or fermented foods. "
            "Reduce caffeine and acidic foods. "
        )
    
    # ========== KAPHA-SPECIFIC RECOMMENDATIONS ==========
    if kapha_lvl == "high" or predicted_dosha == "Kapha":
        rec["diet"] += (
            f"Eat light, warm, dry foods with pungent, bitter, and astringent tastes. "
            f"Include leafy greens, legumes (lentils, mung beans), barley, millet, "
            f"ginger, garlic, and hot spices. "
        )
        
        if "risk_weight_gain" in active_risks or body_frame == "heavy":
            rec["diet"] += "Practice intermittent fasting (skip breakfast or dinner). Reduce portions. "
        
        if "risk_diabetes_tendency" in active_risks:
            rec["diet"] += "Eliminate sugar, white rice, and wheat. Use bitter melon and fenugreek. "
        
        if "risk_sluggishness" in active_risks:
            rec["diet"] += "Start day with warm lemon water and ginger. Add cayenne pepper to meals. "
        
        rec["lifestyle"] += (
            f"Daily vigorous exercise is essential (45-60 min cardio). "
            f"Wake up before 6 AM. Avoid daytime sleep and prolonged sitting. "
            f"Stay mentally stimulated with new activities. "
        )
        
        rec["yoga"] += (
            "Practice vigorous yoga: Surya Namaskar (12+ rounds), Vinyasa flow, "
            "standing poses (Warrior series), backbends, inversions. "
            "Kapalabhati and Bhastrika pranayama for energy. "
        )
        
        rec["herbal"] += (
            "Triphala for digestion and weight management, "
            "Guggulu for metabolism and cholesterol, "
            "Tulsi and ginger tea for energy and immunity. "
            "Punarnava for water retention. "
        )
        
        rec["avoid"] += (
            "Strictly avoid sweets, dairy, fried foods, and heavy grains. "
            "No ice cream, cheese, yogurt (except lassi), or cold drinks. "
            "Eliminate wheat and white rice. "
        )
    
    # ========== ADD GENERAL DAILY HABITS ==========
    rec["daily_habits"] = (
        f"Wake at {('5:30 AM' if kapha_lvl == 'high' else '6:00 AM')}. "
        f"Drink warm water first thing. "
        f"Practice tongue scraping and oil pulling. "
        f"Eat largest meal at lunch (12-1 PM). "
        f"Dinner before 7 PM, sleep by 10 PM. "
        f"Meditate 10-15 minutes daily. "
    )
    
    # Add age-specific recommendations
    if age >= 50:
        rec["daily_habits"] += "Include joint-supporting foods like turmeric milk. Practice gentle movement. "
    
    # ========== ENSURE NO EMPTY FIELDS ==========
    for key in rec:
        if not rec[key] or rec[key].strip() == "":
            rec[key] = "Continue balanced practices appropriate for your constitution."
    
    return rec


# ================= TEST SECTION =================
if __name__ == "__main__":
    # VATA-DOMINANT PROFILE
    test_patient_vata = {
        "age": 28,
        "gender": "Female",
        "veg_nonveg": "Vegetarian",
        "body_frame": "thin",
        "meal_regular": "No",
        "appetite_level": "Variable",
        "urine_color": "clear",
        "environment_temperature": "cold",
        "environment_humidity": "cold",
        "environment_wind": "hot",
        "family_diabetes": "No",
        "family_thyroid": "Yes",
        "family_cholesterol": "No",
        "family_obesity": "No",
        "family_asthma": "Yes",
        "family_heart_disease": "No",
        "family_mental_health": "Yes",
        "stress_level": 4,
        "sleep_quality": 1,
        "spicy_food_intake": 1,
        "oily_food_intake": 1,
        "sweet_intake": 2,
        "caffeine_intake": 3,
        "processed_food": 2
    }
    
    # PITTA-DOMINANT PROFILE
    test_patient_pitta = {
        "age": 35,
        "gender": "Male",
        "veg_nonveg": "Non-Vegetarian",
        "body_frame": "medium",
        "meal_regular": "Yes",
        "appetite_level": "High",
        "urine_color": "Dark Yellow",
        "environment_temperature": "hot",
        "environment_humidity": "hot",
        "environment_wind": "Moderate",
        "family_diabetes": "No",
        "family_thyroid": "No",
        "family_cholesterol": "Yes",
        "family_obesity": "No",
        "family_asthma": "No",
        "family_heart_disease": "Yes",
        "family_mental_health": "No",
        "stress_level": 3,
        "sleep_quality": 2,
        "spicy_food_intake": 4,
        "oily_food_intake": 3,
        "sweet_intake": 1,
        "caffeine_intake": 3,
        "processed_food": 3
    }
    
    # KAPHA-DOMINANT PROFILE
    test_patient_kapha = {
        "age": 45,
        "gender": "Female",
        "veg_nonveg": "Vegetarian",
        "body_frame": "heavy",
        "meal_regular": "Yes",
        "appetite_level": "Low",
        "urine_color": "Pale Yellow",
        "environment_temperature": "Moderate",
        "environment_humidity": "hot",
        "environment_wind": "cold",
        "family_diabetes": "Yes",
        "family_thyroid": "Yes",
        "family_cholesterol": "Yes",
        "family_obesity": "Yes",
        "family_asthma": "No",
        "family_heart_disease": "Yes",
        "family_mental_health": "No",
        "stress_level": 2,
        "sleep_quality": 4,
        "spicy_food_intake": 1,
        "oily_food_intake": 4,
        "sweet_intake": 4,
        "caffeine_intake": 1,
        "processed_food": 3
    }
    
    test_cases = [
        ("VATA-DOMINANT", test_patient_vata),
        ("PITTA-DOMINANT", test_patient_pitta),
        ("KAPHA-DOMINANT", test_patient_kapha)
    ]
    
    for name, patient in test_cases:
        print(f"\n{'='*70}")
        print(f"===== {name} =====")
        print('='*70)
        
        result = predict_health(patient)
        
        print(f"\n🔮 DOSHA: {result['predicted_dosha']}")
        print(f"📊 RISKS: Vata={result['dosha_risk']['future_vata_imbalance_risk']:.2%}, "
              f"Pitta={result['dosha_risk']['future_pitta_imbalance_risk']:.2%}, "
              f"Kapha={result['dosha_risk']['future_kapha_imbalance_risk']:.2%}")
        
        active_risks = [k for k, v in result['health_risk'].items() if v['present'] == 1]
        print(f"⚠️  ACTIVE RISKS: {len(active_risks)}/18")
        
        print(f"\n💊 RECOMMENDATIONS:")
        for key, value in result['recommendations'].items():
            print(f"\n{key.upper()}:")
            print(f"   {value[:200]}...")  # First 200 chars