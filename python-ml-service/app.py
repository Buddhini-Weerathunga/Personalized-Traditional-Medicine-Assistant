from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from utils.schemas import QuizFeatures, DoshaPredictionResponse
from dosha_diagnosis.inference.predict_from_quiz import predict_dosha_from_quiz
from dosha_diagnosis.inference.predict_from_face import predict_dosha_from_face_image

# IMPORT Health Profile Analysis ML APP
from health_profile_analysis.models.app import predict_health

app = FastAPI(
    title="Dosha Diagnosis ML Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# IMPORT YOUR ML APP
from health_profile_analysis.models.app import predict_health


@app.post("/predict")
def predict(data: dict):
    return predict_health(data)

from fastapi import FastAPI, HTTPException
from diets_predictions.predictor import predict_diet

app = FastAPI(
    title="Ayurveda Diet Prediction API",
    version="1.0.0"
)

@app.post("/api/diet/predict")
def predict(data: dict):
    try:
        result = predict_diet(data)
        return {
            "status": "success",
            "prediction": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict/quiz", response_model=DoshaPredictionResponse)
def predict_quiz(payload: QuizFeatures):
    label = predict_dosha_from_quiz(payload.features)
    return DoshaPredictionResponse(dosha_label=label)


@app.post("/predict/face", response_model=DoshaPredictionResponse)
async def predict_face(file: UploadFile = File(...)):
    # Save temp file
    temp_path = Path("temp_face_image.jpg")
    with temp_path.open("wb") as f:
        f.write(await file.read())

    probs = predict_dosha_from_face_image(temp_path)
    best_label = max(probs.items(), key=lambda x: x[1])[0]

    # clean up
    try:
        temp_path.unlink()
    except Exception:
        pass

    return DoshaPredictionResponse(
        dosha_label=best_label,
        probabilities=probs,
    )


