import API from "../api/axios";

// Get all yoga poses
export const getYogaPoses = (params = {}) => {
  return API.get("/yoga/poses", { params });
};

// Start a yoga session
export const startYogaSession = (data) => {
  return API.post("/yoga/session/start", data);
};

// Analyze pose in real-time
export const analyzePose = (data) => {
  return API.post("/yoga/session/analyze", data);
};

// End yoga session
export const endYogaSession = (data) => {
  return API.post("/yoga/session/end", data);
};

// Get user progress
export const getUserProgress = () => {
  return API.get("/yoga/progress");
};

// Update personalization settings
export const updatePersonalization = (data) => {
  return API.put("/yoga/personalization", data);
};