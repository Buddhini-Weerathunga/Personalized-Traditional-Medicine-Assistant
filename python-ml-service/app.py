# python-ml-service/app.py
from fastapi import FastAPI
from pydantic import BaseModel
import base64

from utils.facial_analysis import analyze_image_rule_based
from models.prakriti_model import load_model, predict_dosha

app = FastAPI(title="Ayurveda Prakriti ML Service")

# Load model once at startup (stub or real)
model = load_model()


class AnalyzeRequest(BaseModel):
    image_base64: str


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-ml-service"}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    """
    Expects JSON:
    {
      "image_base64": "<base64 string>"
    }
    """
    try:
        image_bytes = base64.b64decode(req.image_base64)
    except Exception:
        return {"error": "Invalid base64 image data"}

    # Rule-based analysis (placeholder logic)
    rule_based_result = analyze_image_rule_based(image_bytes)

    # Model-based analysis (placeholder logic)
    model_based_result = predict_dosha(image_bytes, model=model)

    # Decide dominant dosha
    dominant = (
        rule_based_result.get("dominant_dosha")
        or model_based_result.get("dominant_dosha")
        or "Unknown"
    )

    return {
        "dominant_dosha": dominant,
        "rule_based": rule_based_result,
        "model_based": model_based_result,
    }
