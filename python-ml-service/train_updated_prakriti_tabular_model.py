# python-ml-service/train_updated_prakriti_tabular_model.py

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
DATA_PATH = "data/Updated_Prakriti_With_Features.csv"
MODEL_OUTPUT_PATH = "models/updated_prakriti_tabular_model.pkl"


def main():
    # 1) Load data
    df = pd.read_csv(DATA_PATH)

    target_col = "Dosha"

    # 2) Features & labels
    X = df.drop(columns=[target_col])
    y = df[target_col]

    feature_cols = list(X.columns)

    # 3) Treat all as categorical again (simple)
    categorical_features = feature_cols

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ]
    )

    clf = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=200,
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )

    # 4) Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 5) Train
    clf.fit(X_train, y_train)

    # 6) Evaluate
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[INFO] Accuracy on test set: {acc:.4f}")
    print("[INFO] Classification report:")
    print(classification_report(y_test, y_pred))

    # 7) Save model bundle
    os.makedirs("models", exist_ok=True)

    bundle = {
        "pipeline": clf,
        "feature_cols": feature_cols,
        "target_col": target_col,
    }

    joblib.dump(bundle, MODEL_OUTPUT_PATH)
    print(f"[INFO] Saved trained model to: {MODEL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
