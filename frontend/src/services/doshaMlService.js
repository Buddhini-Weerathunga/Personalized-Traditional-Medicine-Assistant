// frontend/src/services/doshaMlService.js
import axios from "axios";

const ML_BASE_URL = "http://127.0.0.1:8000"; // FastAPI URL

// 1) Send face image → get dosha prediction
export async function predictDoshaFromFace(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${ML_BASE_URL}/predict/face`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { dosha_label, probabilities }
}

// 2) (Later) Send quiz features → get dosha prediction
export async function predictDoshaFromQuiz(features) {
  const res = await axios.post(`${ML_BASE_URL}/predict/quiz`, {
    features, // object with keys = column names
  });

  return res.data; // { dosha_label }
}
