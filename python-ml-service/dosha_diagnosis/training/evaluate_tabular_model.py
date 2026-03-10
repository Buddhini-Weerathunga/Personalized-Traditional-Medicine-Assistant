import pandas as pd
import joblib
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from config import TABULAR_DATA_FILE, TABULAR_MODEL_PATH, RANDOM_STATE

TARGET_COL = "Dominant_Dosha"

def main():
    # Load dataset
    df = pd.read_csv(TABULAR_DATA_FILE)

    X = df.drop(columns=[TARGET_COL])
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=y
    )

    # Load trained model
    model = joblib.load(TABULAR_MODEL_PATH)

    # Predict
    y_pred = model.predict(X_test)

    # Accuracy
    acc = accuracy_score(y_test, y_pred) * 100

    # ------------------------
    # 1️⃣ Accuracy TABLE
    # ------------------------
    accuracy_table = pd.DataFrame({
        "Model": ["Random Forest (Tabular Dosha Model)"],
        "Accuracy (%)": [round(acc, 2)]
    })

    print("\n📊 Accuracy Table")
    print(accuracy_table)

    # Save table for report
    accuracy_table.to_csv("tabular_model_accuracy.csv", index=False)

    # ------------------------
    # 2️⃣ Accuracy GRAPH
    # ------------------------
    plt.figure(figsize=(5, 4))
    plt.bar(
        accuracy_table["Model"],
        accuracy_table["Accuracy (%)"]
    )
    plt.ylim(0, 100)
    plt.ylabel("Accuracy (%)")
    plt.title("Model Accuracy")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
