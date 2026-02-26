// src/services/api.js
import API from "../api/axios";

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);

// REGISTER
export const registerUser = (data) => API.post("/auth/register", data);

// PROFILE (Protected)
export const getProfile = () => API.get("/user/profile");



// ✅ HEALTH PREDICTION (FIXED PATH)
// ML prediction for logged-in user
export const getMyHealthPrediction = () =>
  API.get("/health-prediction/predict/me");


// ✅ Ayurveda Diet Prediction (Python FastAPI - direct call)
// Set this baseURL to your Python service base URL in axios file OR use full URL here.
export const predictAyurvedaDiet = (data) =>
  API.post("http://127.0.0.1:8000/api/diet/predict", data);
