# python-ml-service/app.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import base64
from io import BytesIO

from PIL import Image
import numpy as np
import cv2

# Import tabular ML prediction
from models.tabular_dosha_model import predict_from_features

app = FastAPI(title="Ayurveda Prakriti ML Service (Tabular + Image)")


# ============================================================
#                      Pydantic Models
# ============================================================

class FeatureRequest(BaseModel):
    # You can make these non-optional later if you want strict validation
    Age: Optional[int] = None
    Gender: Optional[str] = None
    Face_Shape: Optional[str] = None
    Face_Width_Ratio: Optional[float] = None
    Jaw_Width_Ratio: Optional[float] = None
    Forehead_Height_Ratio: Optional[float] = None
    Eye_Size: Optional[str] = None
    Skin_Type: Optional[str] = None
    Body_Frame: Optional[str] = None
    Body_Weight: Optional[float] = None
    Sleep_Pattern: Optional[str] = None
    Activity_Level: Optional[str] = None
    Diet_Type: Optional[str] = None
    Stress_Level: Optional[str] = None


class ImageRequest(BaseModel):
    image_base64: str


# ============================================================
#                         Health Check
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "tabular_and_image_prakriti_analyzer"
    }


# ============================================================
#        SIMPLE FACE-BASED DOSHA ESTIMATOR (Rule Based)
# ============================================================

def analyze_face_basic(img: np.ndarray):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    faces = face_cascade.detectMultiScale(gray, 1.2, 5)

    if len(faces) == 0:
        return {
            "vata": 0.33,
            "pitta": 0.33,
            "kapha": 0.34,
            "dominant_dosha": "Unknown (no face detected)"
        }

    x, y, w, h = faces[0]
    ratio = h / float(w)

    if ratio > 1.4:
        return {
            "vata": 0.6,
            "pitta": 0.25,
            "kapha": 0.15,
            "face_ratio": ratio,
            "dominant_dosha": "Vata"
        }
    elif ratio > 1.2:
        return {
            "vata": 0.3,
            "pitta": 0.5,
            "kapha": 0.2,
            "face_ratio": ratio,
            "dominant_dosha": "Pitta"
        }
    else:
        return {
            "vata": 0.2,
            "pitta": 0.3,
            "kapha": 0.5,
            "face_ratio": ratio,
            "dominant_dosha": "Kapha"
        }


# ============================================================
#                ROUTE: Tabular Feature Analysis
# ============================================================

@app.post("/analyze-features")
def analyze_features(req: FeatureRequest):
    # Convert Pydantic model to plain dict
    payload = req.dict()

    try:
        # Try to predict using your ML model
        dominant_dosha, probabilities = predict_from_features(payload)

        return {
            "dominant_dosha": dominant_dosha,
            "probabilities": probabilities,
            "used_features": list(payload.keys())
        }

    except Exception as e:
        # If anything crashes, return the error text instead of 500
        return {
            "error": str(e),
            "received_payload": payload
        }



# ============================================================
#                ROUTE: Image-Based Analysis
# ============================================================

@app.post("/analyze-image")
def analyze_image(req: ImageRequest):
    try:
        img_bytes = base64.b64decode(req.image_base64)
        pil_img = Image.open(BytesIO(img_bytes)).convert("RGB")

        # Convert RGB → BGR for OpenCV
        img = np.array(pil_img)[:, :, ::-1]

        result = analyze_face_basic(img)

        return {
            "dominant_dosha": result.get("dominant_dosha"),
            "rule_based": {
                "vata_score": result.get("vata"),
                "pitta_score": result.get("pitta"),
                "kapha_score": result.get("kapha"),
                "face_ratio": result.get("face_ratio"),
            },
            "model_based": {}
        }

    except Exception as e:
        return {
            "error": str(e),
            "dominant_dosha": "Unknown",
            "rule_based": {},
            "model_based": {}
        }
