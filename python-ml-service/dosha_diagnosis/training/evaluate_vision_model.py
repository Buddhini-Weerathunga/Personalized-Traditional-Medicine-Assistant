import os, argparse, pandas as pd, numpy as np
import torch, torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from PIL import Image
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def normalize_rel_path(p: str) -> str:
    p = str(p).strip().replace("\\", "/")
    if p.startswith("data/"):
        p = p[len("data/"):]
    parts = p.split("/")
    if len(parts) >= 2 and parts[0].lower() == "dosha":
        parts[1] = parts[1].capitalize()  # kapha -> Kapha, vata -> Vata
        p = "/".join(parts)
    return p.replace("/", os.sep)

def resolve_image_path(row, base_dir):
    cols = ["face_path","profile_path","skin_path","eye_path","mouth_path"]
    fallback_files = ["face.jpg","profile.jpg","skin.jpg","eye.jpg","mouth.jpg"]
    for col in cols:
        if col not in row or pd.isna(row[col]): 
            continue
        rel = normalize_rel_path(row[col])
        full = os.path.join(base_dir, rel) if not os.path.isabs(rel) else rel
        if os.path.exists(full):
            return full
        folder = os.path.dirname(full)
        for fn in fallback_files:
            alt = os.path.join(folder, fn)
            if os.path.exists(alt):
                return alt
    return None

class DoshaCNN(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.pool = nn.AdaptiveAvgPool2d((1,1))
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.pool(x)
        return self.classifier(x)

def load_image_tensor(img_path, img_size):
    img = Image.open(img_path).convert("RGB").resize((img_size, img_size))
    arr = (np.array(img, dtype=np.float32)/255.0).transpose(2,0,1)
    return torch.from_numpy(arr)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta_csv", default="dosha_diagnosis/data/raw/faces_metadata.csv")
    ap.add_argument("--model_path", default="dosha_diagnosis/models/vision/dosha_cnn_model.pth")
    ap.add_argument("--base_dir", default="dosha_diagnosis/data/images")
    ap.add_argument("--label_col", default="dominant_dosha")
    ap.add_argument("--batch_size", type=int, default=16)
    ap.add_argument("--img_size", type=int, default=224)
    ap.add_argument("--out_csv", default="dosha_diagnosis/vision_model_accuracy.csv")
    ap.add_argument("--missing_csv", default="dosha_diagnosis/vision_missing_images.csv")
    args = ap.parse_args()

    df = pd.read_csv(args.meta_csv)

    if args.label_col not in df.columns:
        raise ValueError(f"--label_col={args.label_col} not found. Available: {df.columns.tolist()}")

    ckpt = torch.load(args.model_path, map_location="cpu")
    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        ckpt = ckpt["state_dict"]

    out_w = ckpt.get("classifier.3.weight", None)
    if out_w is None:
        raise ValueError("Could not find classifier.3.weight in checkpoint (unexpected model).")
    trained_num_classes = int(out_w.shape[0])

    classes = sorted(df[args.label_col].astype(str).unique().tolist())
    if len(classes) != trained_num_classes:
        raise ValueError(
            f"Label column '{args.label_col}' has {len(classes)} classes, "
            f"but model was trained for {trained_num_classes} classes. "
            f"Try --label_col dominant_dosha OR retrain."
        )
    label_map = {cls:i for i,cls in enumerate(classes)}

    # ✅ Build a "valid rows only" list
    valid = []
    missing = []
    for idx, row in df.iterrows():
        p = resolve_image_path(row, args.base_dir)
        if p is None:
            missing.append({
                "row_index": idx,
                "face_path": row.get("face_path", None),
                "profile_path": row.get("profile_path", None),
                "skin_path": row.get("skin_path", None),
                "label": row.get(args.label_col, None),
            })
        else:
            valid.append((p, label_map[str(row[args.label_col]).strip()]))

    if len(valid) == 0:
        raise RuntimeError("No valid images found after path resolution. Check base_dir / dataset.")

    # save missing report
    pd.DataFrame(missing).to_csv(args.missing_csv, index=False)
    print(f"⚠️ Missing images: {len(missing)} (saved to {args.missing_csv})")
    print(f"✅ Valid images used for accuracy: {len(valid)}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = DoshaCNN(num_classes=trained_num_classes).to(device)
    model.load_state_dict(ckpt, strict=False)
    model.eval()

    y_true, y_pred = [], []

    # simple manual batching (no Dataset needed)
    with torch.no_grad():
        for i in range(0, len(valid), args.batch_size):
            batch = valid[i:i+args.batch_size]
            xs = torch.stack([load_image_tensor(p, args.img_size) for p,_ in batch]).to(device)
            ys = [y for _,y in batch]

            logits = model(xs)
            preds = torch.argmax(logits, dim=1).cpu().numpy().tolist()

            y_true.extend(ys)
            y_pred.extend(preds)

    acc = accuracy_score(y_true, y_pred)
    cm = confusion_matrix(y_true, y_pred)

    pd.DataFrame([{
        "model":"vision_cnn",
        "samples_used":len(y_true),
        "samples_missing":len(missing),
        "accuracy":float(acc),
        "label_col_used":args.label_col,
        "classes":trained_num_classes
    }]).to_csv(args.out_csv, index=False)

    print("\n✅ Saved:", args.out_csv)
    print("Accuracy:", acc)
    print("\nConfusion Matrix:\n", cm)
    print("\nReport:\n", classification_report(y_true, y_pred))

if __name__ == "__main__":
    main()
