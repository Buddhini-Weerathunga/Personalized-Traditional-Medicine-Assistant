import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

from config import (
    TABULAR_DATA_FILE,
    TABULAR_MODEL_PATH,
    RANDOM_STATE,
)
from utils.logging_utils import get_logger

logger = get_logger(__name__)

def load_tabular_data():
    logger.info(f"Loading tabular data from: {TABULAR_DATA_FILE}")
    df = pd.read_csv(TABULAR_DATA_FILE)

    # Change this if your target column name is different
    target_col = "dosha_label"

    if target_col not in df.columns:
        raise ValueError(
            f"Target column '{target_col}' not found in CSV. "
            f"Available columns: {df.columns.tolist()}"
        )

    X = df.drop(columns=[target_col])
    y = df[target_col]

    return X, y


def build_tabular_pipeline(X: pd.DataFrame) -> Pipeline:
    cat_cols = X.select_dtypes(include=["object"]).columns.tolist()
    num_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

    logger.info(f"Categorical columns: {cat_cols}")
    logger.info(f"Numeric columns: {num_cols}")

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
            ("num", "passthrough", num_cols),
        ]
    )

    clf = RandomForestClassifier(
        n_estimators=200,
        random_state=RANDOM_STATE,
        class_weight="balanced",
    )

    pipe = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("clf", clf),
        ]
    )

    return pipe


def train_tabular_model():
    X, y = load_tabular_data()
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    pipe = build_tabular_pipeline(X)
    logger.info("Training tabular model...")
    pipe.fit(X_train, y_train)

    logger.info("Evaluating on validation set...")
    y_pred = pipe.predict(X_val)
    report = classification_report(y_val, y_pred)
    logger.info("\n" + report)

    logger.info(f"Saving tabular model to: {TABULAR_MODEL_PATH}")
    TABULAR_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipe, TABULAR_MODEL_PATH)


if __name__ == "__main__":
    train_tabular_model()
