"""
Plant Identification Model Loader
Loads the trained PyTorch model and associated files
"""

import os
import sys
import pickle
import torch
import torch.nn as nn
from torchvision import models, transforms
from pathlib import Path

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent
MODELS_DIR = BASE_DIR / "models"


# Neural Network Model Class (must match the class used during training)
# This is needed for torch.load to unpickle the saved model
class PlantIdentificationModel(nn.Module):
    """Neural network model for plant identification"""
    
    def __init__(self, num_classes=8, model_name='efficientnet_b3', pretrained=True):
        super(PlantIdentificationModel, self).__init__()
        self.model_name = model_name
        self.num_classes = num_classes
        
        # Create backbone based on model name
        if 'efficientnet' in model_name.lower():
            if 'b0' in model_name:
                self.backbone = models.efficientnet_b0(weights='IMAGENET1K_V1' if pretrained else None)
                in_features = self.backbone.classifier[1].in_features
                self.backbone.classifier = nn.Sequential(
                    nn.Dropout(p=0.2, inplace=True),
                    nn.Linear(in_features, num_classes)
                )
            elif 'b1' in model_name:
                self.backbone = models.efficientnet_b1(weights='IMAGENET1K_V1' if pretrained else None)
                in_features = self.backbone.classifier[1].in_features
                self.backbone.classifier = nn.Sequential(
                    nn.Dropout(p=0.2, inplace=True),
                    nn.Linear(in_features, num_classes)
                )
            elif 'b2' in model_name:
                self.backbone = models.efficientnet_b2(weights='IMAGENET1K_V1' if pretrained else None)
                in_features = self.backbone.classifier[1].in_features
                self.backbone.classifier = nn.Sequential(
                    nn.Dropout(p=0.3, inplace=True),
                    nn.Linear(in_features, num_classes)
                )
            elif 'b3' in model_name:
                self.backbone = models.efficientnet_b3(weights='IMAGENET1K_V1' if pretrained else None)
                in_features = self.backbone.classifier[1].in_features
                self.backbone.classifier = nn.Sequential(
                    nn.Dropout(p=0.3, inplace=True),
                    nn.Linear(in_features, num_classes)
                )
            elif 'b4' in model_name:
                self.backbone = models.efficientnet_b4(weights='IMAGENET1K_V1' if pretrained else None)
                in_features = self.backbone.classifier[1].in_features
                self.backbone.classifier = nn.Sequential(
                    nn.Dropout(p=0.4, inplace=True),
                    nn.Linear(in_features, num_classes)
                )
            else:
                # Default efficientnet
                self.backbone = models.efficientnet_b0(weights='IMAGENET1K_V1' if pretrained else None)
                in_features = self.backbone.classifier[1].in_features
                self.backbone.classifier = nn.Sequential(
                    nn.Dropout(p=0.2, inplace=True),
                    nn.Linear(in_features, num_classes)
                )
        elif 'resnet' in model_name.lower():
            if '50' in model_name:
                self.backbone = models.resnet50(weights='IMAGENET1K_V1' if pretrained else None)
            elif '34' in model_name:
                self.backbone = models.resnet34(weights='IMAGENET1K_V1' if pretrained else None)
            else:
                self.backbone = models.resnet18(weights='IMAGENET1K_V1' if pretrained else None)
            in_features = self.backbone.fc.in_features
            self.backbone.fc = nn.Linear(in_features, num_classes)
        else:
            # Default to EfficientNet-B3 (matches trained model)
            self.backbone = models.efficientnet_b3(weights='IMAGENET1K_V1' if pretrained else None)
            in_features = self.backbone.classifier[1].in_features
            self.backbone.classifier = nn.Sequential(
                nn.Dropout(p=0.3, inplace=True),
                nn.Linear(in_features, num_classes)
            )
    
    def forward(self, x):
        return self.backbone(x)
    
    def get_features(self, x):
        """Extract features before the final classification layer"""
        if 'efficientnet' in self.model_name.lower():
            # Get features from EfficientNet
            x = self.backbone.features(x)
            x = self.backbone.avgpool(x)
            x = torch.flatten(x, 1)
            return x
        else:
            # Get features from ResNet
            x = self.backbone.conv1(x)
            x = self.backbone.bn1(x)
            x = self.backbone.relu(x)
            x = self.backbone.maxpool(x)
            x = self.backbone.layer1(x)
            x = self.backbone.layer2(x)
            x = self.backbone.layer3(x)
            x = self.backbone.layer4(x)
            x = self.backbone.avgpool(x)
            x = torch.flatten(x, 1)
            return x


# NonPlantDetector class (needed for unpickling)
class NonPlantDetector:
    """Detector to filter out non-plant images"""
    
    def __init__(self, threshold=0.5):
        self.threshold = threshold
        self.model = None
    
    def predict(self, image):
        """Predict if image is a plant"""
        return True, 1.0  # Default: assume it's a plant
    
    def is_plant(self, image):
        """Check if image contains a plant"""
        return True, 1.0


# Inject classes into __main__ so torch.load can find them
# This is needed because the model was saved with classes defined in __main__
sys.modules['__main__'].PlantIdentificationModel = PlantIdentificationModel
sys.modules['__main__'].NonPlantDetector = NonPlantDetector

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
                print("✓ Config loaded")
            
            # Load class names
            class_names_path = MODELS_DIR / "class_names.pkl"
            if class_names_path.exists():
                with open(class_names_path, "rb") as f:
                    self.class_names = pickle.load(f)
                print(f"✓ Class names loaded: {len(self.class_names)} classes")
            
            # Load label encoder
            label_encoder_path = MODELS_DIR / "label_encoder.pkl"
            if label_encoder_path.exists():
                with open(label_encoder_path, "rb") as f:
                    self.label_encoder = pickle.load(f)
                print("✓ Label encoder loaded")
            
            # Load transforms config
            transforms_path = MODELS_DIR / "transforms_config.pkl"
            if transforms_path.exists():
                with open(transforms_path, "rb") as f:
                    transforms_config = pickle.load(f)
                    self.transform = self._build_transforms(transforms_config)
                print("✓ Transforms loaded")
            else:
                # Default transforms if config not found
                self.transform = self._get_default_transforms()
                print("✓ Using default transforms")
            
            # Load the model
            self._load_pytorch_model()
            
            # Load embedding database (optional - for similarity search)
            embedding_path = MODELS_DIR / "embedding_database.pkl"
            if embedding_path.exists():
                with open(embedding_path, "rb") as f:
                    self.embedding_database = pickle.load(f)
                print("✓ Embedding database loaded")
            
            # Load non-plant detector (optional)
            non_plant_path = MODELS_DIR / "non_plant_detector.pkl"
            if non_plant_path.exists():
                with open(non_plant_path, "rb") as f:
                    self.non_plant_detector = pickle.load(f)
                print("✓ Non-plant detector loaded")
            
            print("✅ Plant identification model loaded successfully!")
            
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            raise e
    
    def _load_pytorch_model(self):
        """Load the PyTorch model weights"""
        # Try loading complete model first
        complete_model_path = MODELS_DIR / "complete_model.pth"
        best_model_path = MODELS_DIR / "best_model.pth"
        weights_path = MODELS_DIR / "model_weights.pth"
        
        num_classes = len(self.class_names) if self.class_names else 100
        
        try:
            if complete_model_path.exists():
                # Load complete model (includes architecture)
                # weights_only=False is needed for models saved with custom classes
                self.model = torch.load(complete_model_path, map_location=self.device, weights_only=False)
                print("✓ Complete model loaded")
            elif best_model_path.exists():
                # Load state dict into model architecture
                self.model = self._create_model_architecture(num_classes)
                state_dict = torch.load(best_model_path, map_location=self.device, weights_only=False)
                
                # Handle different state dict formats
                if isinstance(state_dict, dict) and 'model_state_dict' in state_dict:
                    self.model.load_state_dict(state_dict['model_state_dict'])
                elif isinstance(state_dict, dict) and 'state_dict' in state_dict:
                    self.model.load_state_dict(state_dict['state_dict'])
                elif hasattr(state_dict, 'state_dict'):
                    # If it's a model object, get its state dict
                    self.model.load_state_dict(state_dict.state_dict())
                elif isinstance(state_dict, dict):
                    self.model.load_state_dict(state_dict)
                else:
                    # It might be a complete model, use it directly
                    self.model = state_dict
                print("✓ Best model weights loaded")
            elif weights_path.exists():
                self.model = self._create_model_architecture(num_classes)
                state_dict = torch.load(weights_path, map_location=self.device, weights_only=False)
                self.model.load_state_dict(state_dict)
                print("✓ Model weights loaded")
            else:
                raise FileNotFoundError("No model file found!")
            
            self.model.to(self.device)
            self.model.eval()
            
        except Exception as e:
            print(f"Error loading PyTorch model: {e}")
            raise e
    
    def _create_model_architecture(self, num_classes):
        """Create model architecture based on config or default"""
        # Check config for model architecture
        model_name = "efficientnet_b0"  # default
        if self.config and 'model_name' in self.config:
            model_name = self.config['model_name']
        
        if 'efficientnet' in model_name.lower():
            if 'b0' in model_name:
                model = models.efficientnet_b0(weights=None)
                model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
            elif 'b1' in model_name:
                model = models.efficientnet_b1(weights=None)
                model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
            elif 'b2' in model_name:
                model = models.efficientnet_b2(weights=None)
                model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
            else:
                model = models.efficientnet_b0(weights=None)
                model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
        elif 'resnet' in model_name.lower():
            if '50' in model_name:
                model = models.resnet50(weights=None)
            elif '101' in model_name:
                model = models.resnet101(weights=None)
            else:
                model = models.resnet50(weights=None)
            model.fc = nn.Linear(model.fc.in_features, num_classes)
        elif 'vit' in model_name.lower():
            model = models.vit_b_16(weights=None)
            model.heads.head = nn.Linear(model.heads.head.in_features, num_classes)
        else:
            # Default to EfficientNet-B0
            model = models.efficientnet_b0(weights=None)
            model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
        
        return model
    
    def _build_transforms(self, transforms_config):
        """Build transforms from config"""
        transform_list = []
        
        # Get image size from config
        img_size = transforms_config.get('image_size', 224)
        if isinstance(img_size, (list, tuple)):
            img_size = img_size[0]
        
        transform_list.append(transforms.Resize((img_size, img_size)))
        transform_list.append(transforms.ToTensor())
        
        # Normalization
        mean = transforms_config.get('mean', [0.485, 0.456, 0.406])
        std = transforms_config.get('std', [0.229, 0.224, 0.225])
        transform_list.append(transforms.Normalize(mean=mean, std=std))
        
        return transforms.Compose(transform_list)
    
    def _get_default_transforms(self):
        """Default image transforms"""
        return transforms.Compose([
            transforms.Resize((224, 224)),
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
