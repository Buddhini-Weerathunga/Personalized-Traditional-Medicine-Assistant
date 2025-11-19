# python-ml-service/app.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from models.tabular_dosha_model import predict_from_features

app = FastAPI(title="Ayurveda Prakriti ML Service (Tabular Only)")


# --------- Pydantic models ---------

class FeatureRequest(BaseModel):
    # Must match the features in train_dosha_tabular_model.py
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


# --------- Routes ---------

@app.get("/health")
def health():
    return {"status": "ok", "service": "tabular_dosha_model"}


@app.post("/analyze-features")
def analyze_features(req: FeatureRequest):
    """
    Analyze dosha from tabular features (no image).
    """
    payload = req.dict()
    result = predict_from_features(payload)
    return result
