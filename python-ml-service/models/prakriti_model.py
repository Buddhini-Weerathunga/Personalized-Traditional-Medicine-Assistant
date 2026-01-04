# python-ml-service/models/prakriti_model.py

import io

import numpy as np
from PIL import Image

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.preprocessing import image as keras_image


class PrakritiModel:
    """
    CNN-based model for dosha prediction using face images.
    NOTE: This uses ImageNet weights + random head.
    For real accuracy, you must fine-tune it on labeled dosha data.
    """

    def __init__(self):
        self.model = self._build_model()

    def _build_model(self):
        base_model = MobileNetV2(
            weights="imagenet", include_top=False, input_shape=(224, 224, 3)
        )

        for layer in base_model.layers:
            layer.trainable = False

        x = GlobalAveragePooling2D()(base_model.output)
        x = Dense(128, activation="relu")(x)
        predictions = Dense(3, activation="softmax")(x)

        model = Model(inputs=base_model.input, outputs=predictions)
        model.compile(
            optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"]
        )
        return model

    def _extract_features(self, img_bytes: bytes):
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img = img.resize((224, 224))
        x = keras_image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        preds = self.model.predict(x)[0]
        return preds  # [vata_like, pitta_like, kapha_like]

    def analyze_single_image(self, img_bytes: bytes):
        """
        Returns normalized dosha scores from single image.
        """
        raw = self._extract_features(img_bytes)

        doshas = {
            "Vata": float(raw[0]),
            "Pitta": float(raw[1]),
            "Kapha": float(raw[2]),
        }

        total = sum(doshas.values()) or 1.0
        for k in doshas:
            doshas[k] = (doshas[k] / total) * 100.0

        return doshas


def load_model():
    """
    Called once at app startup in app.py
    """
    # To avoid OneDNN warnings:
    # import os; os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
    return PrakritiModel()


def predict_dosha(image_bytes: bytes, model=None) -> dict:
    """
    Wrapper used by app.py → predict dosha using CNN model.
    """
    if model is None:
        model = load_model()

    scores = model.analyze_single_image(image_bytes)
    dominant = max(scores, key=scores.get)

    return {
        "dominant_dosha": dominant,
        "scores": scores,
        "details": {
            "note": "CNN-based prediction from MobileNetV2 head. For real accuracy, fine-tune on labeled dosha data."
        },
    }
