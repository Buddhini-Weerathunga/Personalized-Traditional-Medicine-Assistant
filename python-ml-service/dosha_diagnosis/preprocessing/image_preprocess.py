from pathlib import Path
from typing import List, Tuple

from PIL import Image
import torch
from torchvision import transforms

from config import IMAGES_DIR
from utils.logging_utils import get_logger

logger = get_logger(__name__)

# Default transform for training/inference
default_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    # (Optional) normalize; adjust if you want ImageNet stats:
    # transforms.Normalize(mean=[0.485, 0.456, 0.406],
    #                      std=[0.229, 0.224, 0.225]),
])

LABEL_MAP = {
    "Vata": 0,
    "Pitta": 1,
    "Kapha": 2,
}
INV_LABEL_MAP = {v: k for k, v in LABEL_MAP.items()}


def find_face_image(person_dir: Path) -> Path | None:
    """
    In each folder (1, 2, ...), try to find face image by multiple possible names.
    """
    candidates = ["face.jpg", "Face.jpg", "face.jpeg", "Face.jpeg", "face.png"]
    for name in candidates:
        p = person_dir / name
        if p.exists():
            return p
    # fallback: any jpg
    for p in person_dir.glob("*.jpg"):
        return p
    return None


def load_dataset_paths() -> List[Tuple[Path, int]]:
    """
    Returns list of (image_path, label_index)
    based on folder structure: IMAGES_DIR / (Kapha|Pitta|Vata) / person_id / images...
    """
    data = []
    if not IMAGES_DIR.exists():
        logger.warning(f"Images directory does not exist: {IMAGES_DIR}")
        return data

    for dosha_name, label_idx in LABEL_MAP.items():
        class_dir = IMAGES_DIR / dosha_name
        if not class_dir.exists():
            continue

        for person_dir in class_dir.iterdir():
            if not person_dir.is_dir():
                continue
            face_img = find_face_image(person_dir)
            if face_img is None:
                logger.warning(f"No face image found in: {person_dir}")
                continue
            data.append((face_img, label_idx))

    logger.info(f"Found {len(data)} face images for training.")
    return data


def load_image_as_tensor(path: Path, transform=default_transform) -> torch.Tensor:
    img = Image.open(path).convert("RGB")
    if transform is not None:
        img = transform(img)
    return img
