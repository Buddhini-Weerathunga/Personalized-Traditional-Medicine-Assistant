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
        
        # If confidence is 50% or below, treat as "not a plant" or unrecognizable
        if top_confidence <= 70:
            return {
                "success": True,
                "is_plant": False,
                "plantName": "Not Recognized",
                "scientificName": "",
                "confidence": top_confidence,
                "predictions": predictions,
                "totalClasses": len(model_wrapper.class_names),
                "message": "Unable to identify this image as a known medicinal plant. The confidence level is too low. Please try with a clearer image of a plant leaf."
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
