from pathlib import Path

# Base directory = folder where this config.py lives, then go up one level
BASE_DIR = Path(__file__).resolve().parent

DOSHA_ROOT = BASE_DIR / "dosha_diagnosis"

DATA_DIR = DOSHA_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
IMAGES_DIR = DATA_DIR / "images" / "dosha"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

MODELS_DIR = DOSHA_ROOT / "models"
TABULAR_MODELS_DIR = MODELS_DIR / "tabular"
VISION_MODELS_DIR = MODELS_DIR / "vision"
FUSION_MODELS_DIR = MODELS_DIR / "fusion"

# Files
TABULAR_DATA_FILE = RAW_DATA_DIR / "AI_Dosha_Unified_Dataset_1000rows.csv"
PRAKRITI_FILE = RAW_DATA_DIR / "Prakriti.csv"
UPDATED_PRAKRITI_FILE = RAW_DATA_DIR / "Updated_Prakriti_With_Features.csv"
FACES_METADATA_FILE = RAW_DATA_DIR / "faces_metadata.csv"

TABULAR_TRAIN_PROCESSED = PROCESSED_DATA_DIR / "tabular_train.csv"
TABULAR_VAL_PROCESSED = PROCESSED_DATA_DIR / "tabular_val.csv"
IMAGE_FEATURES_FILE = PROCESSED_DATA_DIR / "image_features.parquet"

TABULAR_MODEL_PATH = TABULAR_MODELS_DIR / "dosha_tabular_model.pkl"
VISION_MODEL_PATH = VISION_MODELS_DIR / "dosha_cnn_model.pth"
FUSION_MODEL_PATH = FUSION_MODELS_DIR / "dosha_fusion_model.pkl"

# General settings
RANDOM_STATE = 42

for p in [
    DATA_DIR,
    RAW_DATA_DIR,
    IMAGES_DIR,
    PROCESSED_DATA_DIR,
    TABULAR_MODELS_DIR,
    VISION_MODELS_DIR,
    FUSION_MODELS_DIR,
]:
    p.mkdir(parents=True, exist_ok=True)
