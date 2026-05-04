"""
Plant Identification Predictor
Loads complete_model.pth (full model object) directly for exact predictions.
"""

import io
import sys
import pickle
from pathlib import Path
from typing import Optional

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
import timm
from torchvision import transforms

# ─── Paths ────────────────────────────────────────────────────────────────────
MODELS_DIR      = Path(__file__).resolve().parent / "models"
COMPLETE_MODEL  = MODELS_DIR / "complete_model.pth"
CLASS_NAMES_PATH = MODELS_DIR / "class_names.pkl"
EMBEDDING_DB_PATH = MODELS_DIR / "embedding_database.pkl"

# ─── Config ───────────────────────────────────────────────────────────────────
IMAGE_SIZE = 380
CROP_SIZE  = 320
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]
ENTROPY_REJECT = 2.07   # ln(8) ≈ 2.08 — reject only truly uniform predictions

_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_base_transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.CenterCrop(CROP_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD),
])

# TTA variants — different crops/flips to give BN real batch variance
_tta_transforms = [
    transforms.Compose([transforms.Resize(IMAGE_SIZE), transforms.CenterCrop(CROP_SIZE),  transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(IMAGE_SIZE), transforms.RandomCrop(CROP_SIZE),   transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(IMAGE_SIZE), transforms.CenterCrop(CROP_SIZE),  transforms.RandomHorizontalFlip(p=1.0), transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(IMAGE_SIZE), transforms.RandomCrop(CROP_SIZE),   transforms.RandomHorizontalFlip(p=1.0), transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(int(IMAGE_SIZE*1.1)), transforms.CenterCrop(CROP_SIZE), transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(int(IMAGE_SIZE*1.1)), transforms.RandomCrop(CROP_SIZE),  transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(int(IMAGE_SIZE*0.9)), transforms.CenterCrop(int(CROP_SIZE*0.85)), transforms.Resize(CROP_SIZE), transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
    transforms.Compose([transforms.Resize(IMAGE_SIZE), transforms.CenterCrop(CROP_SIZE),  transforms.RandomVerticalFlip(p=1.0), transforms.ToTensor(), transforms.Normalize(MEAN, STD)]),
]

# ─── Stub classes so pickle can deserialize complete_model.pth ────────────────
# The file was saved with torch.save(model) where model's class was defined in
# the training script as __main__.SEBlock / __main__.PlantIdentifier.
# We register matching classes in sys.modules['__main__'] before loading.

class SEBlock(nn.Module):
    def __init__(self, in_features):
        super().__init__()
        r = in_features // 16
        self.fc = nn.Sequential(
            nn.Linear(in_features, r, bias=False),
            nn.ReLU(inplace=True),
            nn.Linear(r, in_features, bias=False),
            nn.Sigmoid(),
        )
    def forward(self, x):
        return x * self.fc(x)

class PlantIdentifier(nn.Module):
    def __init__(self, num_classes=8, backbone_name='efficientnet_b4', pretrained=True):
        super().__init__()
        self.backbone = timm.create_model(backbone_name, pretrained=False,
                                          num_classes=0, global_pool='avg')
        feat_dim = self.backbone.num_features
        self.se = SEBlock(feat_dim)
        self.classifier = nn.Sequential(
            nn.BatchNorm1d(feat_dim), nn.Dropout(0.45),
            nn.Linear(feat_dim, 512), nn.GELU(),
            nn.BatchNorm1d(512), nn.Dropout(0.36),
            nn.Linear(512, 256), nn.GELU(),
            nn.BatchNorm1d(256), nn.Dropout(0.18),
            nn.Linear(256, num_classes),
        )
    def forward(self, x):
        f = self.backbone(x)
        f = self.se(f)
        return self.classifier(f)
    def get_embedding(self, x):
        f = self.backbone(x)
        f = self.se(f)
        return F.normalize(f, dim=1)

# Register in __main__ so pickle finds them
_main = sys.modules.setdefault('__main__', sys.modules[__name__])
_main.__dict__.setdefault('SEBlock', SEBlock)
_main.__dict__.setdefault('PlantIdentifier', PlantIdentifier)

# ─── Caches ───────────────────────────────────────────────────────────────────
_model: Optional[nn.Module] = None
_class_names: Optional[list] = None
_embedding_db: Optional[dict] = None


def _load_model() -> nn.Module:
    global _model
    if _model is None:
        print("[PlantID] Loading complete_model.pth …")
        m = torch.load(COMPLETE_MODEL, map_location=_device, weights_only=False)
        # Replace stale BatchNorm1d running stats with Identity — the Linear weights
        # carry the classification signal; BN running stats are unreliable for single images.
        for name, module in list(m.classifier.named_children()):
            if isinstance(module, nn.BatchNorm1d):
                setattr(m.classifier, name, nn.Identity())
        m.eval().to(_device)
        _model = m
        print("[PlantID] Model loaded OK.")
    return _model


def _load_class_names() -> list:
    global _class_names
    if _class_names is None:
        with open(CLASS_NAMES_PATH, "rb") as f:
            _class_names = pickle.load(f)
    return _class_names


def _load_embedding_db() -> Optional[dict]:
    global _embedding_db
    if _embedding_db is None and EMBEDDING_DB_PATH.exists():
        with open(EMBEDDING_DB_PATH, "rb") as f:
            _embedding_db = pickle.load(f)
    return _embedding_db


def _preprocess(image_bytes: bytes) -> torch.Tensor:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return _base_transform(img).unsqueeze(0).to(_device)


def _entropy(probs: np.ndarray) -> float:
    p = np.clip(probs, 1e-9, 1.0)
    return float(-np.sum(p * np.log(p)))


def _fmt(name: str) -> str:
    return name.replace("_", " ").title()


# ─── Plant info DB ────────────────────────────────────────────────────────────
_PLANT_INFO = {
    "adathoda": {
        "scientificName": "Justicia adhatoda",
        "commonNames": ["Malabar nut", "Adathoda", "Vasaka"],
        "description": "A widely used medicinal shrub in Ayurveda and Siddha medicine, known for its powerful bronchodilator and expectorant properties.",
        "medicinalUses": ["Respiratory disorders", "Asthma & bronchitis", "Cough relief", "Anti-inflammatory", "Fever reduction", "Wound healing"],
        "partsUsed": ["Leaves", "Flowers", "Roots", "Bark"],
        "category": "Respiratory",
        "ayurvedicProperties": {"rasa": "Bitter, Astringent", "guna": "Light, Dry", "virya": "Cooling", "vipaka": "Pungent"},
        "doshaEffect": "Balances Kapha and Pitta",
        "warnings": ["Avoid during pregnancy", "Not for prolonged use without guidance", "May lower blood pressure"],
    },
    "diyamiththa": {
        "scientificName": "Glycyrrhiza glabra",
        "commonNames": ["Licorice", "Diya Miththa", "Athimaduram"],
        "description": "A well-known medicinal plant used for its sweet root in both Ayurvedic and Western herbalism, with potent anti-inflammatory and adaptogenic properties.",
        "medicinalUses": ["Digestive health", "Respiratory support", "Anti-inflammatory", "Adrenal support", "Ulcer healing", "Sore throat relief"],
        "partsUsed": ["Roots", "Oil/Extract"],
        "category": "Digestive",
        "ayurvedicProperties": {"rasa": "Sweet", "guna": "Heavy, Moist", "virya": "Cooling", "vipaka": "Sweet"},
        "doshaEffect": "Balances Vata and Pitta, may increase Kapha",
        "warnings": ["Long-term use can raise blood pressure", "Avoid if hypertensive", "Can lower potassium levels"],
    },
    "garudaraja": {
        "scientificName": "Aristolochia indica",
        "commonNames": ["Garudaraja", "Indian Birthwort", "Ishwari"],
        "description": "A climbing plant used in traditional Sri Lankan and Indian medicine, particularly for snakebite treatment and as an antidote for poisons.",
        "medicinalUses": ["Snakebite antidote", "Fever reduction", "Anti-inflammatory", "Digestive stimulant", "Skin disorders", "Menstrual regulation"],
        "partsUsed": ["Roots", "Leaves", "Stem"],
        "category": "General Wellness",
        "ayurvedicProperties": {"rasa": "Bitter, Pungent", "guna": "Light, Dry", "virya": "Heating", "vipaka": "Pungent"},
        "doshaEffect": "Balances Kapha and Vata",
        "warnings": ["Contains aristolochic acid — professional supervision only", "Avoid during pregnancy", "Do NOT self-medicate"],
    },
    "heen nidikumba": {
        "scientificName": "Mimosa pudica",
        "commonNames": ["Sensitive Plant", "Touch-me-not", "Heen Nidikumba"],
        "description": "The famous 'sensitive plant' known for its ability to fold its leaves when touched. Widely used in traditional medicine for wound healing and nerve disorders.",
        "medicinalUses": ["Wound healing", "Anti-inflammatory", "Anxiety & sleep", "Urinary disorders", "Hair loss treatment", "Antidepressant"],
        "partsUsed": ["Whole Plant", "Leaves", "Roots"],
        "category": "General Wellness",
        "ayurvedicProperties": {"rasa": "Bitter, Astringent", "guna": "Light, Dry", "virya": "Cooling", "vipaka": "Pungent"},
        "doshaEffect": "Balances Pitta and Kapha",
        "warnings": ["Avoid high doses during pregnancy", "May interact with sedatives", "Consult a practitioner before use"],
    },
    "nika": {
        "scientificName": "Vitex negundo",
        "commonNames": ["Five-leaved Chaste Tree", "Nika", "Nirgundi"],
        "description": "A large aromatic shrub used extensively in Ayurveda for its powerful anti-inflammatory and analgesic properties.",
        "medicinalUses": ["Joint pain & arthritis", "Anti-inflammatory", "Fever reduction", "Respiratory support", "Headache relief", "Muscle spasms"],
        "partsUsed": ["Leaves", "Roots", "Bark", "Seeds", "Flowers"],
        "category": "Anti-inflammatory",
        "ayurvedicProperties": {"rasa": "Bitter, Pungent, Astringent", "guna": "Light, Dry", "virya": "Heating", "vipaka": "Pungent"},
        "doshaEffect": "Balances Kapha and Vata",
        "warnings": ["Avoid during pregnancy", "Mild sedative effects possible", "Do not use with hormonal medications without guidance"],
    },
    "kaladuru": {
        "scientificName": "Cinnamomum zeylanicum",
        "commonNames": ["True Cinnamon", "Ceylon Cinnamon", "Kaladuru"],
        "description": "Sri Lanka's native true cinnamon, considered the finest in the world. Used in Ayurveda for blood sugar regulation and digestive health.",
        "medicinalUses": ["Blood sugar regulation", "Digestive support", "Anti-inflammatory", "Antimicrobial", "Heart health", "Warming tonic"],
        "partsUsed": ["Bark", "Oil/Extract", "Leaves"],
        "category": "Digestive",
        "ayurvedicProperties": {"rasa": "Sweet, Pungent, Bitter", "guna": "Light, Dry", "virya": "Heating", "vipaka": "Sweet"},
        "doshaEffect": "Balances Kapha and Vata, may slightly increase Pitta",
        "warnings": ["Large doses may affect liver", "Ceylon cinnamon is safer for regular use", "Avoid in excess during pregnancy"],
    },
    "kothala himbutu": {
        "scientificName": "Salacia reticulata",
        "commonNames": ["Kothala Himbutu", "Salacia", "Ekanayakam"],
        "description": "A woody climber endemic to Sri Lanka and India, renowned for its exceptional anti-diabetic properties.",
        "medicinalUses": ["Diabetes management", "Blood sugar regulation", "Weight management", "Anti-obesity", "Digestive health", "Joint support"],
        "partsUsed": ["Roots", "Bark", "Stem"],
        "category": "General Wellness",
        "ayurvedicProperties": {"rasa": "Astringent, Bitter", "guna": "Light, Dry", "virya": "Cooling", "vipaka": "Pungent"},
        "doshaEffect": "Balances Kapha and Pitta",
        "warnings": ["Monitor blood sugar with diabetes medications", "May cause hypoglycemia if overused", "Consult healthcare provider before combining with diabetes drugs"],
    },
    "pila": {
        "scientificName": "Gloriosa superba",
        "commonNames": ["Flame Lily", "Glory Lily", "Pila", "Niyangala"],
        "description": "A spectacular climbing lily. Highly medicinal but EXTREMELY TOXIC — used only under strict professional supervision.",
        "medicinalUses": ["Arthritis (topical, professional use)", "Anti-inflammatory (professional)", "Gout treatment"],
        "partsUsed": ["Roots (TOXIC — professional use only)"],
        "category": "General Wellness",
        "ayurvedicProperties": {"rasa": "Bitter, Pungent", "guna": "Light, Sharp", "virya": "Heating", "vipaka": "Pungent"},
        "doshaEffect": "Strongly increases Pitta; decreases Kapha",
        "warnings": [
            "EXTREMELY TOXIC — All parts are poisonous",
            "NEVER self-medicate — can be fatal",
            "Toxic even through skin contact",
            "Only handled by trained practitioners",
        ],
    },
}


# ─── Public API ───────────────────────────────────────────────────────────────
def identify_plant(image_bytes: bytes, top_k: int = 5) -> dict:
    try:
        model = _load_model()
        class_names = _load_class_names()
        tensor = _preprocess(image_bytes)

        with torch.no_grad():
            logits = model(tensor)      # (1, num_classes)
            probs = F.softmax(logits, dim=1).cpu().numpy()[0]

        top_k_actual = min(top_k, len(probs))
        top_indices = np.argsort(probs)[::-1][:top_k_actual]
        top_idx = int(top_indices[0])
        top_conf = float(probs[top_idx]) * 100.0
        ent = _entropy(probs)

        predicted_class = class_names[top_idx] if top_idx < len(class_names) else f"class_{top_idx}"
        display_name = _fmt(predicted_class)

        alternatives = [
            {"name": _fmt(class_names[i] if i < len(class_names) else f"class_{i}"),
             "confidence": round(float(probs[i]) * 100, 2)}
            for i in top_indices[1:]
        ]

        return {
            "success": True,
            "isPlant": True,
            "plantName": display_name,
            "confidence": round(top_conf, 2),
            "alternatives": alternatives,
            "allProbabilities": {
                _fmt(class_names[i] if i < len(class_names) else f"class_{i}"): round(float(p) * 100, 2)
                for i, p in enumerate(probs)
            },
        }

    except Exception as e:
        return {"success": False, "isPlant": False, "error": str(e)}


def get_plant_info(plant_name: str) -> dict:
    key = plant_name.lower().strip()
    if key in _PLANT_INFO:
        return _PLANT_INFO[key]
    for k, v in _PLANT_INFO.items():
        if k in key or key in k:
            return v
    return {
        "scientificName": "Unknown",
        "commonNames": [plant_name],
        "description": f"{plant_name} is a traditional medicinal plant.",
        "medicinalUses": ["Consult an Ayurvedic practitioner for specific uses"],
        "partsUsed": ["Leaves", "Roots"],
        "category": "General Wellness",
        "ayurvedicProperties": {},
        "doshaEffect": "Unknown",
        "warnings": ["Always consult a qualified practitioner before use"],
    }


def get_similar_plants(image_bytes: bytes, top_k: int = 5) -> list:
    try:
        db = _load_embedding_db()
        if db is None:
            return []

        model = _load_model()
        tensor = _preprocess(image_bytes)

        with torch.no_grad():
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            single = _base_transform(img).unsqueeze(0).to(_device)
            # Run backbone+se only (no classifier BN issue for embeddings)
            f = model.backbone(single)
            embedding = F.normalize(model.se(f), dim=1).cpu().numpy()[0]

        db_embs  = db["embeddings"]
        db_labels = db["labels"]
        sims = db_embs @ embedding
        top_n = np.argsort(sims)[::-1]

        seen, results = set(), []
        for i in top_n:
            name = _fmt(str(db_labels[i]))
            if name not in seen:
                seen.add(name)
                results.append({"name": name, "similarity": round(float(sims[i]), 4)})
            if len(results) >= top_k:
                break
        return results

    except Exception as e:
        print(f"[PlantID] get_similar_plants error: {e}")
        return []
