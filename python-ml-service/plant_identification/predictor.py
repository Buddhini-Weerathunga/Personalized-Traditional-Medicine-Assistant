"""
Plant Identification Predictor
Handles plant identification from images
"""

import torch
import torch.nn.functional as F
from PIL import Image
import io
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

from .model_loader import get_model


def preprocess_image(image_source: Union[str, bytes, Path, Image.Image]) -> Image.Image:
    """
    Preprocess image from various sources
    
    Args:
        image_source: Can be file path, bytes, or PIL Image
    
    Returns:
        PIL Image in RGB format
    """
    if isinstance(image_source, Image.Image):
        image = image_source
    elif isinstance(image_source, bytes):
        image = Image.open(io.BytesIO(image_source))
    elif isinstance(image_source, (str, Path)):
        image = Image.open(image_source)
    else:
        raise ValueError(f"Unsupported image source type: {type(image_source)}")
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    return image


def identify_plant(
    image_source: Union[str, bytes, Path, Image.Image],
    top_k: int = 5,
    confidence_threshold: float = 0.1
) -> Dict:
    """
    Identify plant from image
    
    Args:
        image_source: Image file path, bytes, or PIL Image
        top_k: Number of top predictions to return
        confidence_threshold: Minimum confidence to include in results
    
    Returns:
        Dictionary with identification results
    """
    model_wrapper = get_model()
    
    try:
        # Preprocess image
        image = preprocess_image(image_source)
        
        # --- Pre-check: Image-level heuristics to reject non-leaf images ---
        # Medicinal plant leaf images are typically close-up shots dominated by green.
        # Big trees (lots of sky), colorful flowers, etc. have very different profiles.
        img_array = np.array(image.resize((128, 128)))
        r_mean, g_mean, b_mean = img_array[:,:,0].mean(), img_array[:,:,1].mean(), img_array[:,:,2].mean()
        total_brightness = (r_mean + g_mean + b_mean) / 3

        # Check upper third for sky (high blue or high brightness = sky/clouds)
        upper_third = img_array[:img_array.shape[0]//3, :, :]
        upper_b = upper_third[:,:,2].mean()
        upper_brightness = upper_third.mean()

        # Check for flower-like images: high saturation non-green colors
        # Convert to a simple saturation measure
        img_float = img_array.astype(np.float32) / 255.0
        c_max = img_float.max(axis=2)
        c_min = img_float.min(axis=2)
        saturation = np.where(c_max > 0, (c_max - c_min) / c_max, 0)
        mean_saturation = saturation.mean()

        # Red+yellow dominance (flowers)
        red_dominant = np.sum((img_array[:,:,0] > img_array[:,:,1] + 30) & (img_array[:,:,0] > 100))
        total_pixels = img_array.shape[0] * img_array.shape[1]
        red_ratio = red_dominant / total_pixels

        # Green ratio: for leaves, green channel should be notable
        green_dominant = np.sum((img_array[:,:,1] > img_array[:,:,0]) & (img_array[:,:,1] > img_array[:,:,2]))
        green_ratio = green_dominant / total_pixels

        image_rejected = False
        rejection_reason = ""

        # Debug logging for threshold tuning
        print(f"[IMG HEURISTIC] brightness={total_brightness:.1f}, upper_brightness={upper_brightness:.1f}, "
              f"green_ratio={green_ratio:.3f}, red_ratio={red_ratio:.3f}, mean_sat={mean_saturation:.3f}")

        # Big tree / landscape: upper third is bright (sky), overall image has low green dominance
        if upper_brightness > 180 and green_ratio < 0.45:
            image_rejected = True
            rejection_reason = "Image appears to be a landscape or full tree photo, not a close-up plant leaf."

        # Flower: high saturation + strong red/yellow dominance
        if red_ratio > 0.15 and mean_saturation > 0.4:
            image_rejected = True
            rejection_reason = "Image appears to contain a flower rather than a medicinal plant leaf."

        # Very bright/washed out images (sky, white background)
        if total_brightness > 200:
            image_rejected = True
            rejection_reason = "Image is too bright. Please use a close-up image of a plant leaf."

        if image_rejected:
            return {
                "success": True,
                "is_plant": False,
                "plantName": "Not Recognized",
                "scientificName": "",
                "confidence": 0,
                "predictions": [],
                "totalClasses": len(model_wrapper.class_names),
                "message": (
                    f"{rejection_reason} "
                    "Our model identifies specific medicinal plants (Aloe Vera, Cinnamon, "
                    "Hathawariya, Papaya, Turmeric). Please upload a clear, close-up image "
                    "of a medicinal plant leaf."
                )
            }

        # Check if it's a plant image (optional)
        is_plant, plant_confidence = model_wrapper.is_plant_image(image)
        if not is_plant:
            return {
                "success": False,
                "error": "Image does not appear to contain a plant",
                "is_plant": False,
                "plant_confidence": plant_confidence
            }
        
        # Apply transforms
        input_tensor = model_wrapper.transform(image)
        input_batch = input_tensor.unsqueeze(0).to(model_wrapper.device)
        
        # Run inference
        with torch.no_grad():
            outputs = model_wrapper.model(input_batch)
            probabilities = F.softmax(outputs, dim=1)
        
        # Get top predictions
        probs = probabilities[0].cpu().numpy()
        raw_logits = outputs[0].cpu().numpy()
        top_indices = np.argsort(probs)[::-1][:top_k]
        
        predictions = []
        for idx in top_indices:
            confidence = float(probs[idx])
            if confidence >= confidence_threshold:
                plant_name = model_wrapper.class_names[idx]
                predictions.append({
                    "class_index": int(idx),
                    "plant_name": plant_name,
                    "confidence": round(confidence * 100, 2),
                    "scientific_name": get_scientific_name(plant_name)
                })
        
        # Get the top prediction
        top_prediction = predictions[0] if predictions else None
        top_confidence = top_prediction["confidence"] if top_prediction else 0
        
        # --- Rejection checks for non-matching images (flowers, trees, etc.) ---
        # With only a few classes, the model is forced to pick one even for
        # unrelated images. These checks catch those cases:

        # 1) Entropy check: high entropy = model is spreading confidence evenly
        #    For 5 classes, max entropy (uniform) = ln(5) ≈ 1.609
        entropy = -float(np.sum(probs * np.log(probs + 1e-10)))
        max_entropy = np.log(len(probs))
        entropy_ratio = entropy / max_entropy  # 0 = certain, 1 = uniform

        # 2) Margin check: gap between top-1 and top-2
        sorted_probs = np.sort(probs)[::-1]
        margin = float(sorted_probs[0] - sorted_probs[1]) if len(sorted_probs) > 1 else 1.0

        # 3) Max logit check: raw output magnitude before softmax
        #    Low max logit = the model isn't strongly activated
        max_logit = float(np.max(raw_logits))

        # Debug logging for model-level rejection
        print(f"[MODEL CHECK] top_conf={top_confidence:.2f}%, entropy_ratio={entropy_ratio:.3f}, "
              f"margin={margin:.3f}, max_logit={max_logit:.3f}")

        # Reject if any of these indicate the image isn't a known medicinal plant:
        #  - Top confidence ≤ 85%
        #  - Entropy ratio > 0.55 (model spreading confidence = guessing)
        #  - Margin < 0.25 (top two predictions too close)
        #  - Max logit < 4.0 (model isn't strongly activated by any class)
        is_rejected = (
            top_confidence <= 85
            or entropy_ratio > 0.55
            or margin < 0.25
            or max_logit < 4.0
        )

        if is_rejected:
            return {
                "success": True,
                "is_plant": False,
                "plantName": "Not Recognized",
                "scientificName": "",
                "confidence": top_confidence,
                "predictions": predictions,
                "totalClasses": len(model_wrapper.class_names),
                "message": (
                    "Unable to identify this image as a known medicinal plant. "
                    "This may be a flower, tree, or non-medicinal plant that is not in our database. "
                    "Please try with a clear, close-up image of a medicinal plant leaf."
                )
            }
        
        return {
            "success": True,
            "is_plant": True,
            "plantName": top_prediction["plant_name"] if top_prediction else "Unknown",
            "scientificName": top_prediction.get("scientific_name", "") if top_prediction else "",
            "confidence": top_confidence,
            "predictions": predictions,
            "totalClasses": len(model_wrapper.class_names)
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "is_plant": None
        }


def get_scientific_name(common_name: str) -> str:
    """
    Get scientific name for a plant (placeholder - expand with actual data)
    """
    # This is a placeholder mapping - you should expand this
    # or load from a database/file
    scientific_names = {
        "aloevera": "Aloe barbadensis miller",
        "aloe vera": "Aloe barbadensis miller",
        "cinnamon": "Cinnamomum verum",
        "hathawariya": "Asparagus racemosus",
        "papaya": "Carica papaya",
        "turmeric": "Curcuma longa",
        "tulsi": "Ocimum tenuiflorum",
        "holy basil": "Ocimum tenuiflorum",
        "neem": "Azadirachta indica",
        "ginger": "Zingiber officinale",
        "ashwagandha": "Withania somnifera",
        "brahmi": "Bacopa monnieri",
        "mint": "Mentha",
        "peppermint": "Mentha piperita",
        "moringa": "Moringa oleifera",
        "amla": "Phyllanthus emblica",
        "giloy": "Tinospora cordifolia",
        "shatavari": "Asparagus racemosus",
    }
    
    # Try to find a match (case-insensitive)
    name_lower = common_name.lower().strip()
    for key, value in scientific_names.items():
        if key in name_lower or name_lower in key:
            return value
    
    return ""


def get_plant_info(plant_name: str) -> Dict:
    """
    Get detailed information about a plant
    """
    # Placeholder - you should expand this with actual plant data
    plant_database = {
        "aloevera": {
            "description": "Aloe vera is a succulent plant species known for its medicinal properties in Ayurveda.",
            "uses": ["Skin care", "Burns treatment", "Digestive health", "Wound healing"],
            "parts_used": ["Gel", "Latex", "Leaves"],
            "precautions": ["May cause skin irritation in some people", "Not recommended for internal use during pregnancy"],
            "ayurvedic_properties": {
                "rasa": "Bitter, Sweet",
                "virya": "Cold",
                "vipaka": "Sweet",
                "dosha_effect": "Balances Pitta and Kapha"
            }
        },
        "cinnamon": {
            "description": "Cinnamon is a spice obtained from the inner bark of several tree species, widely used in traditional medicine.",
            "uses": ["Blood sugar regulation", "Anti-inflammatory", "Digestive aid", "Respiratory health"],
            "parts_used": ["Bark", "Leaves", "Essential oil"],
            "precautions": ["May interact with diabetes medications", "Avoid excessive consumption during pregnancy"],
            "ayurvedic_properties": {
                "rasa": "Pungent, Sweet",
                "virya": "Hot",
                "vipaka": "Sweet",
                "dosha_effect": "Balances Vata and Kapha"
            }
        },
        "hathawariya": {
            "description": "Hathawariya (Asparagus racemosus / Shatavari) is a highly valued Ayurvedic herb known as the 'Queen of Herbs'.",
            "uses": ["Female reproductive health", "Immunity booster", "Digestive tonic", "Anti-aging"],
            "parts_used": ["Roots", "Leaves"],
            "precautions": ["Avoid if allergic to asparagus", "Consult doctor if on hormonal medications"],
            "ayurvedic_properties": {
                "rasa": "Sweet, Bitter",
                "virya": "Cold",
                "vipaka": "Sweet",
                "dosha_effect": "Balances Vata and Pitta"
            }
        },
        "papaya": {
            "description": "Papaya is a tropical fruit plant with significant medicinal value in traditional medicine systems.",
            "uses": ["Digestive enzyme source", "Wound healing", "Anti-parasitic", "Skin health"],
            "parts_used": ["Fruit", "Leaves", "Seeds", "Latex"],
            "precautions": ["Avoid unripe papaya during pregnancy", "May interact with blood-thinning medications"],
            "ayurvedic_properties": {
                "rasa": "Sweet, Bitter",
                "virya": "Hot",
                "vipaka": "Sweet",
                "dosha_effect": "Balances Vata and Kapha"
            }
        },
        "turmeric": {
            "description": "Turmeric is a golden spice and one of the most important herbs in Ayurvedic medicine.",
            "uses": ["Anti-inflammatory", "Antioxidant", "Wound healing", "Digestive health", "Skin care"],
            "parts_used": ["Rhizome", "Powder"],
            "precautions": ["May interact with blood-thinning medications", "Avoid excessive use during pregnancy"],
            "ayurvedic_properties": {
                "rasa": "Bitter, Pungent",
                "virya": "Hot",
                "vipaka": "Pungent",
                "dosha_effect": "Balances all three doshas"
            }
        }
    }
    
    name_lower = plant_name.lower().strip()
    for key, info in plant_database.items():
        if key in name_lower or name_lower in key:
            return info
    
    return {
        "description": f"Information about {plant_name}",
        "uses": [],
        "parts_used": [],
        "precautions": [],
        "ayurvedic_properties": {}
    }


def get_similar_plants(
    image_source: Union[str, bytes, Path, Image.Image],
    top_k: int = 5
) -> List[Dict]:
    """
    Find similar plants using embedding similarity (if embedding database is available)
    """
    model_wrapper = get_model()
    
    if model_wrapper.embedding_database is None:
        return []
    
    try:
        # This is a placeholder for embedding-based similarity
        # Implement based on your embedding database structure
        return []
    except Exception as e:
        print(f"Error finding similar plants: {e}")
        return []
