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


def find_region_images(person_path: Path) -> List[Path]:
    """
    Return ALL region images inside a person folder (face, eyes, mouth, skin, profile)
    or directly inside the dosha folder.

    We simply take every JPG / JPEG / PNG file.
    """
    exts = ["*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"]
    images: List[Path] = []

    for pattern in exts:
        images.extend(person_path.glob(pattern))

    # remove duplicates and sort (optional)
    images = sorted(set(images))
    return images


def load_dataset_paths() -> List[Tuple[Path, int]]:
    """
    Returns list of (image_path, label_index)
    based on folder structure:

        IMAGES_DIR /
            Vata /
                1 / face.jpg, eyes.jpg, mouth.jpg, skin.jpg, profile.jpg ...
                2 / ...
            Pitta /
            Kapha /

    If you keep images directly in Vata/Pitta/Kapha (no person subfolder),
    they will also be picked.
    """
    data: List[Tuple[Path, int]] = []

    if not IMAGES_DIR.exists():
        logger.warning(f"Images directory does not exist: {IMAGES_DIR}")
        return data

    for dosha_name, label_idx in LABEL_MAP.items():
        class_dir = IMAGES_DIR / dosha_name
        if not class_dir.exists():
            logger.warning(f"Class directory not found: {class_dir}")
            continue

        # 1) images directly inside the dosha folder (optional)
        direct_imgs = find_region_images(class_dir)
        for img_path in direct_imgs:
            data.append((img_path, label_idx))

        # 2) images inside person subfolders (recommended structure)
        for entry in class_dir.iterdir():
            if not entry.is_dir():
                continue

            region_imgs = find_region_images(entry)
            if not region_imgs:
                logger.warning(f"No region images found in: {entry}")
                continue

            for img_path in region_imgs:
                data.append((img_path, label_idx))

    logger.info(f"Found {len(data)} images (all regions) for training.")
    return data


def load_image_as_tensor(path: Path, transform=default_transform) -> torch.Tensor:
    img = Image.open(path).convert("RGB")
    if transform is not None:
        img = transform(img)
    return img
