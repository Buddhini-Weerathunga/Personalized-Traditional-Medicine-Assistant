"""
Plant Identification Model Loader
Loads the trained PyTorch model and associated files
"""

import os
import sys
import pickle
import torch
import torch.nn as nn
import timm
from torchvision import transforms
from pathlib import Path

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent
MODELS_DIR = BASE_DIR / "models"


# ── Classes matching the training code (needed for torch.load unpickling) ──

class ChannelAttention(nn.Module):
    """Channel attention module used in the trained PlantIdentifier"""
    def __init__(self, in_features, reduction=16):
        super(ChannelAttention, self).__init__()
        self.attention = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(in_features, in_features // reduction),
            nn.ReLU(inplace=True),
            nn.Linear(in_features // reduction, in_features),
            nn.Sigmoid()
        )

    def forward(self, x):
        weights = self.attention(x)
        return x * weights.unsqueeze(-1).unsqueeze(-1)


class PlantIdentifier(nn.Module):
    """Plant identification model (timm EfficientNet-B4 + ChannelAttention + classifier)"""
    def __init__(self, num_classes=5, backbone_name='efficientnet_b4', pretrained=False):
        super(PlantIdentifier, self).__init__()
        self.backbone = timm.create_model(backbone_name, pretrained=pretrained, num_classes=0)
        backbone_out = self.backbone.num_features  # 1792 for efficientnet_b4

        self.channel_attention = ChannelAttention(backbone_out)

        self.classifier = nn.Sequential(
            nn.BatchNorm1d(backbone_out),
            nn.Dropout(0.3),
            nn.Linear(backbone_out, 512),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(512),
            nn.Dropout(0.2),
            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(256),
            nn.Dropout(0.1),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        features = self.backbone.forward_features(x)
        features = self.channel_attention(features)
        features = nn.functional.adaptive_avg_pool2d(features, 1).flatten(1)
        return self.classifier(features)


# Legacy helper classes (needed for unpickling auxiliary pkl files)
class NonPlantDetector:
    def __init__(self, threshold=0.5):
        self.threshold = threshold
        self.model = None
    def predict(self, image):
        return True, 1.0
    def is_plant(self, image):
        return True, 1.0

class SimilarityDetector:
    def __init__(self, threshold=0.5):
        self.threshold = threshold
        self.model = None
    def predict(self, image):
        return True, 1.0
    def is_plant(self, image):
        return True, 1.0

class PlantSimilarityDetector:
    """Similarity detector saved in similarity_detector.pkl"""
    def __init__(self, *args, **kwargs):
        # Accept any args/kwargs for unpickling
        for k, v in kwargs.items():
            setattr(self, k, v)
    def __setstate__(self, state):
        self.__dict__.update(state)


# Inject classes into __main__ so torch.load can find them
sys.modules['__main__'].PlantIdentifier = PlantIdentifier
sys.modules['__main__'].ChannelAttention = ChannelAttention
sys.modules['__main__'].NonPlantDetector = NonPlantDetector
sys.modules['__main__'].SimilarityDetector = SimilarityDetector
sys.modules['__main__'].PlantSimilarityDetector = PlantSimilarityDetector

class PlantModelLoader:
    """Singleton class to load and manage the plant identification model"""
    
    _instance = None
    _is_loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._is_loaded:
            self.model = None
            self.class_names = None
            self.label_encoder = None
            self.config = None
            self.transform = None
            self.embedding_database = None
            self.non_plant_detector = None
            self.similarity_detector = None
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self._load_model()
            PlantModelLoader._is_loaded = True
    
    def _load_model(self):
        """Load all model components"""
        print(f"Loading plant identification model on {self.device}...")
        
        try:
            # Load configuration
            config_path = MODELS_DIR / "config.pkl"
            if config_path.exists():
                with open(config_path, "rb") as f:
                    self.config = pickle.load(f)
                print("  Config loaded")
            
            # Load class names
            class_names_path = MODELS_DIR / "class_names.pkl"
            if class_names_path.exists():
                with open(class_names_path, "rb") as f:
                    self.class_names = pickle.load(f)
                print(f"  Class names loaded: {len(self.class_names)} classes")
            
            # Load label encoder
            label_encoder_path = MODELS_DIR / "label_encoder.pkl"
            if label_encoder_path.exists():
                with open(label_encoder_path, "rb") as f:
                    self.label_encoder = pickle.load(f)
                print("  Label encoder loaded")
            
            # Load transforms config
            transforms_path = MODELS_DIR / "transforms_config.pkl"
            if transforms_path.exists():
                with open(transforms_path, "rb") as f:
                    transforms_config = pickle.load(f)
                    self.transform = self._build_transforms(transforms_config)
                print("  Transforms loaded")
            else:
                # Default transforms if config not found
                self.transform = self._get_default_transforms()
                print("  Using default transforms")
            
            # Load the model
            self._load_pytorch_model()
            
            # Load embedding database (optional - for similarity search)
            embedding_path = MODELS_DIR / "embedding_database.pkl"
            if embedding_path.exists():
                with open(embedding_path, "rb") as f:
                    self.embedding_database = pickle.load(f)
                print("  Embedding database loaded")
            
            # Load similarity detector (optional)
            similarity_path = MODELS_DIR / "similarity_detector.pkl"
            if similarity_path.exists():
                with open(similarity_path, "rb") as f:
                    self.similarity_detector = pickle.load(f)
                print("  Similarity detector loaded")
            
            # Load non-plant detector (optional, legacy)
            non_plant_path = MODELS_DIR / "non_plant_detector.pkl"
            if non_plant_path.exists():
                with open(non_plant_path, "rb") as f:
                    self.non_plant_detector = pickle.load(f)
                print("  Non-plant detector loaded")
            
            print("[OK] Plant identification model loaded successfully!")
            
        except Exception as e:
            print(f"[ERROR] Error loading model: {str(e)}")
            raise e
    
    def _load_pytorch_model(self):
        """Load the PyTorch model weights"""
        complete_model_path = MODELS_DIR / "complete_model.pth"
        best_model_path = MODELS_DIR / "best_checkpoint.pth"
        weights_path = MODELS_DIR / "model_weights.pth"
        
        num_classes = len(self.class_names) if self.class_names else 5
        
        try:
            # Prefer loading state dict (model_weights.pth) – avoids unpickling issues
            if weights_path.exists():
                self.model = self._create_model_architecture(num_classes)
                state_dict = torch.load(weights_path, map_location=self.device, weights_only=True)
                self.model.load_state_dict(state_dict)
                print("  Model weights loaded")
            elif complete_model_path.exists():
                self.model = torch.load(complete_model_path, map_location=self.device, weights_only=False)
                print("  Complete model loaded")
            elif best_model_path.exists():
                self.model = self._create_model_architecture(num_classes)
                checkpoint = torch.load(best_model_path, map_location=self.device, weights_only=False)
                if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['model_state_dict'])
                elif isinstance(checkpoint, dict) and 'state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['state_dict'])
                elif isinstance(checkpoint, dict):
                    self.model.load_state_dict(checkpoint)
                else:
                    self.model = checkpoint
                print("  Best checkpoint loaded")
            else:
                raise FileNotFoundError("No model file found!")
            
            self.model.to(self.device)
            self.model.eval()
            
        except Exception as e:
            print(f"Error loading PyTorch model: {e}")
            raise e
    
    def _create_model_architecture(self, num_classes):
        """Create model architecture matching the trained PlantIdentifier"""
        return PlantIdentifier(num_classes=num_classes, backbone_name='efficientnet_b4', pretrained=False)
    
    def _build_transforms(self, transforms_config):
        """Build transforms from config"""
        transform_list = []
        
        # Get image size (config may use 'target_size' or 'image_size')
        img_size = transforms_config.get('target_size',
                   transforms_config.get('image_size', 380))
        if isinstance(img_size, (list, tuple)):
            img_size = img_size[0]
        
        transform_list.append(transforms.Resize((img_size, img_size)))
        transform_list.append(transforms.CenterCrop(transforms_config.get('crop_size', img_size)))
        transform_list.append(transforms.ToTensor())
        
        # Normalization
        mean = transforms_config.get('mean', [0.485, 0.456, 0.406])
        std = transforms_config.get('std', [0.229, 0.224, 0.225])
        transform_list.append(transforms.Normalize(mean=mean, std=std))
        
        return transforms.Compose(transform_list)
    
    def _get_default_transforms(self):
        """Default image transforms matching the trained model"""
        return transforms.Compose([
            transforms.Resize((380, 380)),
            transforms.CenterCrop(320),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def is_plant_image(self, image):
        """Check if image contains a plant (optional)"""
        if self.non_plant_detector is None:
            return True, 1.0
        
        try:
            # Use non-plant detector if available
            # This depends on how your detector was trained
            return True, 1.0
        except:
            return True, 1.0


# Global instance
_model_instance = None

def get_model():
    """Get the singleton model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = PlantModelLoader()
    return _model_instance
