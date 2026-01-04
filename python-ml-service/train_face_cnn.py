# python-ml-service/train_face_cnn.py

import os
import json
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "dosha")
MODELS_DIR = os.path.join(BASE_DIR, "models")

IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 15


def main():
    if not os.path.isdir(DATA_DIR):
        raise RuntimeError(f"Dataset folder not found: {DATA_DIR}")

    print(f"[INFO] Loading images from: {DATA_DIR}")

    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        label_mode="categorical",  # one-hot labels
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATA_DIR,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        label_mode="categorical",
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"[INFO] Classes: {class_names}")

    # Prefetch for speed
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds_pref = train_ds.prefetch(buffer_size=AUTOTUNE)
    val_ds_pref = val_ds.prefetch(buffer_size=AUTOTUNE)

    # ------------------ Model Definition ------------------
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = False  # freeze base for initial training

    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = layers.Rescaling(1.0 / 255)(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    model.summary()

    # ------------------ Training ------------------
    print("[INFO] Training model...")
    history = model.fit(
        train_ds_pref,
        validation_data=val_ds_pref,
        epochs=EPOCHS,
    )

    # ------------------ Optional Fine-Tune ------------------
    # Unfreeze some layers of base_model if you want better accuracy later
    # base_model.trainable = True
    # model.compile(
    #     optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    #     loss="categorical_crossentropy",
    #     metrics=["accuracy"],
    # )
    # history_fine = model.fit(
    #     train_ds_pref,
    #     validation_data=val_ds_pref,
    #     epochs=5,
    # )

    # ------------------ Save Model & Class Mapping ------------------
    os.makedirs(MODELS_DIR, exist_ok=True)

    model_path = os.path.join(MODELS_DIR, "dosha_face_cnn.h5")
    model.save(model_path)
    print(f"[INFO] Saved face CNN model to: {model_path}")

    # Save class names for later inference
    mapping_path = os.path.join(MODELS_DIR, "dosha_face_cnn_classes.json")
    with open(mapping_path, "w") as f:
        json.dump({"classes": class_names}, f, indent=2)
    print(f"[INFO] Saved class mapping to: {mapping_path}")


if __name__ == "__main__":
    main()
