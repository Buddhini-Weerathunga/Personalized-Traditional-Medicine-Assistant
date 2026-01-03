from pathlib import Path
from typing import Optional, Dict

import torch
from torch import nn

from config import VISION_MODEL_PATH
from dosha_diagnosis.preprocessing.image_preprocess import (
    load_image_as_tensor,
    INV_LABEL_MAP,
)
from utils.logging_utils import get_logger
from dosha_diagnosis.training.train_vision_model import SimpleCNN

logger = get_logger(__name__)

_model_cache: Optional[nn.Module] = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_vision_model() -> nn.Module:
    global _model_cache
    if _model_cache is None:
        logger.info(f"Loading vision model from: {VISION_MODEL_PATH}")
        model = SimpleCNN(num_classes=3)
        model.load_state_dict(torch.load(VISION_MODEL_PATH, map_location=_device))
        model.eval().to(_device)
        _model_cache = model
    return _model_cache


def predict_dosha_from_face_image(image_path: Path) -> Dict[str, float]:
    model = load_vision_model()
    img_tensor = load_image_as_tensor(image_path).unsqueeze(0).to(_device)

    with torch.no_grad():
        logits = model(img_tensor)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

    result = {INV_LABEL_MAP[i]: float(p) for i, p in enumerate(probs)}
    return result
