# python-ml-service/train_dosha_tabular_model.py

import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# ---- PATHS ----
DATA_PATH = "data/AI_Dosha_Unified_Dataset_1000rows.csv"
MODEL_OUTPUT_PATH = "models/dosha_tabular_model.pkl"


def main():
    # 1) Load the dataset
    print(f"[INFO] Loading dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)

    # 2) Target and features
    target_col = "Dominant_Dosha"   # <--- make sure this column exists in your CSV

    # IMPORTANT:
    # These names MUST match columns in your CSV exactly.
    # If some names differ, change them here.
    feature_cols = [
        "Age",
        "Gender",
        "Face_Shape",
        "Face_Width_Ratio",
        "Jaw_Width_Ratio",
        "Forehead_Height_Ratio",
        "Eye_Size",
        "Skin_Type",
        "Body_Frame",
        "Body_Weight",
        "Sleep_Pattern",
        "Activity_Level",
        "Diet_Type",
        "Stress_Level",
    ]

    print("[INFO] Using feature columns:", feature_cols)

    # Subset dataframe
    X = df[feature_cols].copy()
    y = df[target_col].copy()

    # 3) Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    # 4) Setup preprocessing
    categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
    numeric_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

    print("[INFO] Categorical columns:", categorical_cols)
    print("[INFO] Numeric columns:", numeric_cols)

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
            ("num", "passthrough", numeric_cols),
        ]
    )

    # 5) Model
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
    )

    clf = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ])

    # 6) Train
    print("[INFO] Training model...")
    clf.fit(X_train, y_train)

    # 7) Evaluate
    print("[INFO] Evaluating model...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[RESULT] Accuracy on test set: {acc:.3f}")
    print("[RESULT] Classification report:")
    print(classification_report(y_test, y_pred))

    # 8) Save model bundle
    os.makedirs("models", exist_ok=True)

    bundle = {
        "pipeline": clf,
        "feature_cols": feature_cols,
    }

    joblib.dump(bundle, MODEL_OUTPUT_PATH)
    print(f"[INFO] Saved trained model to: {MODEL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
