from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json

# ===================== IMPORT SCHEMAS =====================
from utils.schemas import QuizFeatures, DoshaPredictionResponse

# ===================== IMPORT ML LOGIC (with error handling) =====================
try:
    from dosha_diagnosis.inference.predict_from_quiz import predict_dosha_from_quiz
    from dosha_diagnosis.inference.predict_from_face import predict_dosha_from_face_image
    DOSHA_AVAILABLE = True
except Exception as e:
    print(f"⚠️ Dosha diagnosis not available: {e}")
    DOSHA_AVAILABLE = False

try:
    from health_profile_analysis.models.app import predict_health
    HEALTH_PROFILE_AVAILABLE = True
except Exception as e:
    print(f"⚠️ Health profile analysis not available: {e}")
    HEALTH_PROFILE_AVAILABLE = False

try:
    from diets_predictions.predictor import predict_diet
    DIET_AVAILABLE = True
except Exception as e:
    print(f"⚠️ Diet predictions not available: {e}")
    DIET_AVAILABLE = False

# ===================== IMPORT PLANT IDENTIFICATION =====================
try:
    from plant_identification.predictor import identify_plant, get_plant_info, get_similar_plants
    PLANT_ID_AVAILABLE = True
    print("✅ Plant identification module loaded successfully!")
except Exception as e:
    print(f"⚠️ Plant identification not available: {e}")
    PLANT_ID_AVAILABLE = False

# ===================== CREATE FASTAPI APP (ONLY ONCE) =====================
app = FastAPI(
    title="Ayurveda ML Service",
    version="1.0.0"
)

# ===================== ENABLE CORS =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],  # React frontend & Node backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== HEALTH CHECK =====================
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "modules": {
            "dosha_diagnosis": DOSHA_AVAILABLE,
            "health_profile": HEALTH_PROFILE_AVAILABLE,
            "diet_predictions": DIET_AVAILABLE,
            "plant_identification": PLANT_ID_AVAILABLE
        }
    }

# ===================== HEALTH PROFILE =====================
@app.post("/predict")
def predict_health_profile(data: dict):
    if not HEALTH_PROFILE_AVAILABLE:
        raise HTTPException(status_code=503, detail="Health profile analysis not available")
    return predict_health(data)

# ===================== DIET PREDICTION =====================
@app.post("/api/diet/predict")
def predict_diet_api(data: dict):
    if not DIET_AVAILABLE:
        raise HTTPException(status_code=503, detail="Diet predictions not available")
    try:
        result = predict_diet(data)
        return {
            "status": "success",
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===================== QUIZ DOSHA =====================
@app.post("/predict/quiz", response_model=DoshaPredictionResponse)
def predict_quiz(payload: QuizFeatures):
    if not DOSHA_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dosha diagnosis not available")
    label = predict_dosha_from_quiz(payload.features)
    return DoshaPredictionResponse(dosha_label=label)

# ===================== FACE DOSHA =====================
@app.post("/predict/face", response_model=DoshaPredictionResponse)
async def predict_face(file: UploadFile = File(...)):
    if not DOSHA_AVAILABLE:
        raise HTTPException(status_code=503, detail="Dosha diagnosis not available")
    temp_path = Path("temp_face_image.jpg")

    with temp_path.open("wb") as f:
        f.write(await file.read())

    probs = predict_dosha_from_face_image(temp_path)
    best_label = max(probs.items(), key=lambda x: x[1])[0]

    try:
        temp_path.unlink()
    except Exception:
        pass

    return DoshaPredictionResponse(
        dosha_label=best_label,
        probabilities=probs,
    )

# ===================== PLANT IDENTIFICATION =====================
@app.post("/api/plant/identify")
async def identify_plant_endpoint(
    image: UploadFile = File(...),
    healthData: Optional[str] = Form(None)
):
    """
    Identify a plant from an uploaded image
    """
    if not PLANT_ID_AVAILABLE:
        raise HTTPException(status_code=503, detail="Plant identification not available")
    
    try:
        # Read image bytes
        image_bytes = await image.read()
        
        # Parse health data if provided
        health_data = None
        if healthData:
            try:
                health_data = json.loads(healthData)
            except json.JSONDecodeError:
                pass
        
        # Identify plant
        result = identify_plant(image_bytes, top_k=5)
        
        if not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error", "Failed to identify plant"))
        
        # Get additional plant info
        plant_name = result.get("plantName", "")
        plant_info = get_plant_info(plant_name)
        
        # Merge results
        result["plantInfo"] = plant_info
        
        # If health data provided, add personalized safety alerts
        if health_data:
            result["personalizedAlerts"] = generate_safety_alerts(plant_name, health_data)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error identifying plant: {str(e)}")


@app.get("/api/plant/info/{plant_name}")
async def get_plant_info_endpoint(plant_name: str):
    """
    Get detailed information about a plant
    """
    try:
        info = get_plant_info(plant_name)
        return {
            "success": True,
            "plantName": plant_name,
            "info": info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plant/similar")
async def find_similar_plants_endpoint(image: UploadFile = File(...)):
    """
    Find similar plants based on image
    """
    try:
        image_bytes = await image.read()
        similar = get_similar_plants(image_bytes, top_k=5)
        return {
            "success": True,
            "similarPlants": similar
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_safety_alerts(plant_name: str, health_data: dict) -> list:
    """
    Generate personalized safety alerts based on plant and health data
    """
    alerts = []
    
    # Check for pregnancy
    if health_data.get("isPregnant"):
        alerts.append({
            "severity": "high",
            "title": "Pregnancy Warning",
            "message": f"Consult a healthcare provider before using {plant_name} during pregnancy."
        })
    
    # Check for breastfeeding
    if health_data.get("isBreastfeeding"):
        alerts.append({
            "severity": "medium",
            "title": "Breastfeeding Caution",
            "message": f"Some herbs may affect breast milk. Consult a healthcare provider before using {plant_name}."
        })
    
    # Check medications for interactions
    medications = health_data.get("medications", [])
    if medications:
        alerts.append({
            "severity": "medium",
            "title": "Medication Interaction Check",
            "message": f"You have listed medications. Please verify there are no interactions with {plant_name}."
        })
    
    # Check allergies
    allergies = health_data.get("allergies", [])
    if allergies:
        alerts.append({
            "severity": "low",
            "title": "Allergy Note",
            "message": f"You have listed allergies. Test {plant_name} on a small area first if applying topically."
        })
    
    # Age-based recommendations
    age = health_data.get("age")
    if age:
        try:
            age_int = int(age)
            if age_int < 12:
                alerts.append({
                    "severity": "high",
                    "title": "Pediatric Use",
                    "message": f"Special dosing required for children. Consult a pediatric practitioner before using {plant_name}."
                })
            elif age_int > 65:
                alerts.append({
                    "severity": "medium",
                    "title": "Senior Consideration",
                    "message": f"Consider starting with lower doses of {plant_name} for elderly users."
                })
        except ValueError:
            pass
    
    return alerts

