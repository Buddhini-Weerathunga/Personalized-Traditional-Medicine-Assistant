from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ===================== IMPORT SCHEMAS =====================
from utils.schemas import QuizFeatures, DoshaPredictionResponse

# ===================== IMPORT ML LOGIC =====================
from dosha_diagnosis.inference.predict_from_quiz import predict_dosha_from_quiz
from dosha_diagnosis.inference.predict_from_face import predict_dosha_from_face_image

from health_profile_analysis.models.app import predict_health
from diets_predictions.predictor import predict_diet

# ===================== CREATE FASTAPI APP (ONLY ONCE) =====================
app = FastAPI(
    title="Ayurveda ML Service",
    version="1.0.0"
)

# ===================== ENABLE CORS =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== HEALTH CHECK =====================
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ===================== HEALTH PROFILE =====================
@app.post("/predict")
def predict_health_profile(data: dict):
    return predict_health(data)

# ===================== DIET PREDICTION =====================
@app.post("/api/diet/predict")
def predict_diet_api(data: dict):
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
    label = predict_dosha_from_quiz(payload.features)
    return DoshaPredictionResponse(dosha_label=label)

# ===================== FACE DOSHA =====================
@app.post("/predict/face", response_model=DoshaPredictionResponse)
async def predict_face(file: UploadFile = File(...)):
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
