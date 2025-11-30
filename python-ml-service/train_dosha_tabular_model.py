# python-ml-service/train_dosha_tabular_model.py

import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "data", "AI_Dosha_Unified_Dataset_1000rows.csv")
MODEL_OUTPUT_PATH = os.path.join(BASE_DIR, "models", "dosha_tabular_model.pkl")

FEATURE_COLS = [
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

TARGET_COL = "Dominant_Dosha"


def main():
    print(f"[INFO] Loading dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)

    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    # One-hot encode all categorical columns into numeric dummies
    print("[INFO] Encoding categorical features with pandas.get_dummies...")
    X_enc = pd.get_dummies(X, drop_first=False)
    dummy_cols = list(X_enc.columns)

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_enc, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[INFO] Training RandomForest model...")
    clf = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    print("[INFO] Evaluating model...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[RESULT] Accuracy on test set: {acc:.3f}")
    print("[RESULT] Classification report:")
    print(classification_report(y_test, y_pred))

    # Save bundle: model + dummy column list + original feature names
    os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
    bundle = {
        "model": clf,
        "dummy_cols": dummy_cols,
        "feature_cols": FEATURE_COLS,
        "target_col": TARGET_COL,
    }

    joblib.dump(bundle, MODEL_OUTPUT_PATH)
    print(f"[INFO] Saved trained model to: {MODEL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
