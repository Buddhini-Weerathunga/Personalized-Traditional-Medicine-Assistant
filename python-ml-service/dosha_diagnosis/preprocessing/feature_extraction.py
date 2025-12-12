from pathlib import Path
from typing import Dict, Any, List

import cv2
import numpy as np
import mediapipe as mp

from config import IMAGES_DIR
from utils.logging_utils import get_logger
from .image_preprocess import find_face_image

logger = get_logger(__name__)

mp_face_mesh = mp.solutions.face_mesh

def extract_face_landmarks(image_path: Path) -> np.ndarray | None:
    image = cv2.imread(str(image_path))
    if image is None:
        logger.warning(f"Could not read image: {image_path}")
        return None

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    with mp_face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
    ) as face_mesh:
        results = face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            logger.warning(f"No face landmarks detected: {image_path}")
            return None

        mesh = results.multi_face_landmarks[0]
        coords = np.array([[lm.x, lm.y, lm.z] for lm in mesh.landmark], dtype=np.float32)
        return coords.flatten()


def extract_features_for_all() -> List[Dict[str, Any]]:
    """
    Example: iterate all persons & extract basic landmark features.
    You can save this as CSV or parquet for fusion model later.
    """
    all_features = []

    for dosha_name in ["Vata", "Pitta", "Kapha"]:
        class_dir = IMAGES_DIR / dosha_name
        if not class_dir.exists():
            continue

        for person_dir in class_dir.iterdir():
            if not person_dir.is_dir():
                continue

            face_path = find_face_image(person_dir)
            if face_path is None:
                continue

            landmarks = extract_face_landmarks(face_path)
            if landmarks is None:
                continue

            features = {"dosha_label": dosha_name, "person_id": person_dir.name}
            # Add some simple aggregated features:
            features["mean_x"] = float(landmarks[0::3].mean())
            features["mean_y"] = float(landmarks[1::3].mean())
            features["mean_z"] = float(landmarks[2::3].mean())
            features["std_x"] = float(landmarks[0::3].std())
            features["std_y"] = float(landmarks[1::3].std())
            features["std_z"] = float(landmarks[2::3].std())

            all_features.append(features)

    return all_features


if __name__ == "__main__":
    feats = extract_features_for_all()
    logger.info(f"Extracted features for {len(feats)} faces.")
