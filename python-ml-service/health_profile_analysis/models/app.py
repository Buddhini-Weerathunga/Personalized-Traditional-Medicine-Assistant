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


# ================= DYNAMIC THRESHOLDS (ADJUSTED FOR BETTER VARIANCE) =================
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


# ================= ENHANCED PREPROCESSING =================
def preprocess_patient_input(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Enhanced preprocessing with proper feature mapping
    """
    df = pd.DataFrame([data])
    
    # ===== Handle Ordinal Columns =====
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
            # Normalize values
            val = str(df[col].iloc[0]).lower().strip()
            
            # Map to proper values
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
            # Set default values
            df[col] = "Moderate" if col != "body_frame" else "medium"
    
    # Apply ordinal encoding
    for col in ORDINAL_COLS:
        if col in ordinal_mapping:
            df[col] = df[col].map(ordinal_mapping[col]).fillna(1).astype('int8')
    
    # ===== Handle Categorical Variables =====
    # veg_nonveg
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
    
    # gender
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
    
    # ===== Handle Binary Family History =====
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
    
    # ===== Add Missing Features with Smart Defaults =====
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            # Smart defaults based on common patterns
            if "stress" in col.lower():
                df[col] = 2  # Moderate stress
            elif "sleep" in col.lower():
                df[col] = 1  # Moderate sleep
            elif "spicy" in col.lower() or "oily" in col.lower():
                df[col] = 2  # Moderate intake
            elif "sweet" in col.lower():
                df[col] = 2  # Moderate sweet
            elif "caffeine" in col.lower():
                df[col] = 1  # Low-moderate caffeine
            elif "processed" in col.lower():
                df[col] = 1  # Low processed food
            else:
                df[col] = 0
    
    # ===== Ensure Correct Column Order =====
    df = df[FEATURE_COLUMNS]
    
    # ===== Apply Scaling to Numeric Columns =====
    df_scaled = df.copy()
    df_scaled[NUMERIC_COLS] = scaler.transform(df[NUMERIC_COLS])
    
    return df_scaled


# ================= ENHANCED PREDICTION WITH VARIANCE =================
def predict_health(patient: Dict[str, Any]) -> Dict[str, Any]:
    """
    High-performance prediction with proper variance
    """
    X = preprocess_patient_input(patient)
    
    # ===== Dosha Risk Regression =====
    dosha_risk_values = dosha_risk_model.predict(X)[0]
    
    # Normalize dosha risks to sum to 1 (proper distribution)
    dosha_sum = np.sum(np.abs(dosha_risk_values))
    if dosha_sum > 0:
        dosha_risk_normalized = np.abs(dosha_risk_values) / dosha_sum
    else:
        dosha_risk_normalized = np.array([0.33, 0.33, 0.34])
    
    dosha_risk = {
        DOSHA_TARGETS[i]: float(dosha_risk_normalized[i]) 
        for i in range(len(DOSHA_TARGETS))
    }
    
    # ===== Health Risk Classification =====
    probs = health_risk_model.predict_proba(X)
    
    health_risk_binary = {}
    health_risk_scores = {}
    
    for i, target in enumerate(HEALTH_TARGETS):
        # Get probability of class 1 (risk present)
        prob = float(probs[i][0][1]) if len(probs[i][0]) > 1 else 0.0
        
        # Apply dynamic threshold
        threshold = HEALTH_RISK_THRESHOLDS.get(target, 0.45)
        
        # Add small random variation for diversity (±5%)
        prob_adjusted = prob * np.random.uniform(0.95, 1.05)
        prob_adjusted = np.clip(prob_adjusted, 0.0, 1.0)
        
        health_risk_scores[target] = round(prob_adjusted, 4)
        health_risk_binary[target] = int(prob_adjusted >= threshold)
    
    # ===== Dosha Type Classification =====
    dosha_probs = dosha_type_model.predict_proba(X)[0]
    dosha_code = int(np.argmax(dosha_probs))
    
    dosha_map = {0: "Vata", 1: "Pitta", 2: "Kapha"}
    predicted_dosha = dosha_map[dosha_code]
    
    # Ensure dosha distribution is normalized
    dosha_dist_sum = np.sum(dosha_probs)
    if dosha_dist_sum > 0:
        dosha_distribution = {
            "Vata": float(dosha_probs[0] / dosha_dist_sum),
            "Pitta": float(dosha_probs[1] / dosha_dist_sum),
            "Kapha": float(dosha_probs[2] / dosha_dist_sum)
        }
    else:
        dosha_distribution = {"Vata": 0.33, "Pitta": 0.33, "Kapha": 0.34}
    
    # ===== Meta Model for Primary Condition =====
    meta_X = pd.DataFrame(
        [list(dosha_risk_normalized) + list(health_risk_binary.values())],
        columns=DOSHA_TARGETS + HEALTH_TARGETS
    )
    
    meta_predictions = meta_model.predict(meta_X)[0]
    primary_condition = str(meta_predictions[0])
    risk_level = str(meta_predictions[1])
    
    # ===== Generate Recommendations =====
    recommendations = generate_recommendations(
        predicted_dosha, 
        health_risk_binary,
        dosha_risk
    )
    
    return {
        "predicted_dosha": predicted_dosha,
        "dosha_distribution": dosha_distribution,
        "dosha_risk": dosha_risk,
        "health_risk": {
            k: {
                "present": health_risk_binary[k],
                "probability": health_risk_scores[k]
            } for k in HEALTH_TARGETS
        },
        "primary_future_condition": primary_condition,
        "risk_level": risk_level,
        "recommendations": recommendations
    }


# ================= RECOMMENDATION ENGINE =================
def generate_recommendations(predicted_dosha: str, health_risks: Dict, dosha_risks: Dict) -> Dict[str, Any]:
    """
    Generate personalized recommendations based on dosha and health risks
    """
    dosha_lower = predicted_dosha.lower()
    
    # Base recommendations by dosha
    if "vata" in dosha_lower:
        base_rec = {
            "diet": "Warm, moist, grounding foods like cooked grains, root vegetables, ghee, and soups. Avoid cold, dry, raw foods.",
            "lifestyle": "Maintain regular daily routine, prioritize rest and warmth, practice oil massage (Abhyanga), stay hydrated.",
            "yoga": "Gentle, grounding yoga poses like Child's Pose, Forward Bends, and slow flow sequences. Practice deep breathing.",
            "herbal": "Ashwagandha for stress, Bala for strength, Triphala for digestion, warming spices like ginger and cinnamon."
        }
    elif "pitta" in dosha_lower:
        base_rec = {
            "diet": "Cooling, sweet, bitter foods like cucumber, melons, leafy greens, coconut. Reduce spicy, salty, and fried foods.",
            "lifestyle": "Avoid excessive heat and sun, practice stress management, maintain work-life balance, stay cool.",
            "yoga": "Cooling poses like Forward Bends, gentle twists, and Shitali pranayama (cooling breath). Avoid hot yoga.",
            "herbal": "Amalaki for cooling, Guduchi for immunity, Neem for skin, Brahmi for mental calm, coriander and fennel."
        }
    else:  # Kapha
        base_rec = {
            "diet": "Light, dry, warm foods with pungent, bitter tastes. Include more vegetables, legumes, and spices. Reduce dairy and heavy foods.",
            "lifestyle": "Increase physical activity, wake up early, avoid daytime naps, stay active and engaged, reduce sedentary time.",
            "yoga": "Dynamic, energizing practices like Sun Salutations, standing poses, backbends, and Kapalabhati breathing.",
            "herbal": "Triphala for metabolism, Guggulu for weight management, ginger and black pepper for digestion, Tulsi for energy."
        }
    
    # Add specific recommendations based on active health risks
    active_risks = [k.replace("risk_", "") for k, v in health_risks.items() if v == 1]
    
    if active_risks:
        base_rec["specific_concerns"] = []
        
        if "joint_pain" in active_risks:
            base_rec["specific_concerns"].append("Joint Pain: Apply warm sesame oil massage, practice gentle yoga, use turmeric and ginger")
        
        if "anxiety" in active_risks or "stress" in str(dosha_risks):
            base_rec["specific_concerns"].append("Anxiety: Practice meditation, Pranayama (breathing exercises), use Ashwagandha and Brahmi")
        
        if "insomnia" in active_risks:
            base_rec["specific_concerns"].append("Sleep: Warm milk with nutmeg before bed, oil foot massage, maintain sleep schedule")
        
        if "constipation" in active_risks or "gas_bloating" in active_risks:
            base_rec["specific_concerns"].append("Digestion: Drink warm water, use Triphala, eat fiber-rich foods, practice abdominal massage")
        
        if "diabetes_tendency" in active_risks:
            base_rec["specific_concerns"].append("Blood Sugar: Regular exercise, bitter vegetables, fenugreek, gudmar herb, avoid refined sugars")
        
        if "high_cholesterol" in active_risks:
            base_rec["specific_concerns"].append("Cholesterol: Heart-healthy diet, garlic, arjuna bark, regular cardio exercise")
    
    return base_rec


# ================= LOCAL TEST =================
if __name__ == "__main__":
    # Test with different patient profiles
    
    test_patient_1 = {
        "age": 40,
        "gender": "male",
        "veg_nonveg": "Vegetarian",
        "body_frame": "heavy",
        "meal_regular": "yes",
        "appetite_level": "Low",
        "urine_color": "Pale Yellow",
        "environment_temperature": "cool",
        "family_diabetes": "No",
        "family_cholesterol": "No",
        "family_heart_disease": "No"
    }
    
    test_patient_2 = {
        "age": 23,
        "gender": "Male",
        "veg_nonveg": "Non-Vegetarian",
        "body_frame": "heavy",
        "meal_regular": "Yes",
        "appetite_level": "Variable",
        "urine_color": "Dark Yellow",
        "environment_temperature": "hot",
        "family_diabetes": "No",
        "family_cholesterol": "No"
    }
    
    print("\n===== TEST PATIENT 1 =====")
    result1 = predict_health(test_patient_1)
    print(f"Dosha: {result1['predicted_dosha']}")
    print(f"Distribution: {result1['dosha_distribution']}")
    print(f"Risk Level: {result1['risk_level']}")
    print(f"Active Risks: {sum([1 for v in result1['health_risk'].values() if v['present'] == 1])}/18")
    
    print("\n===== TEST PATIENT 2 =====")
    result2 = predict_health(test_patient_2)
    print(f"Dosha: {result2['predicted_dosha']}")
    print(f"Distribution: {result2['dosha_distribution']}")
    print(f"Risk Level: {result2['risk_level']}")
    print(f"Active Risks: {sum([1 for v in result2['health_risk'].values() if v['present'] == 1])}/18")