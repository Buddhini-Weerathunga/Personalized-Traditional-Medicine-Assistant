export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  mlApiBaseUrl: import.meta.env.VITE_ML_API_BASE_URL || "http://127.0.0.1:8000",
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  groqModel: import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant",
  openWeatherApiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || "",
  yogaTestMode: import.meta.env.VITE_YOGA_TEST_MODE === "true",
  yogaTestUserId: import.meta.env.VITE_YOGA_TEST_USER_ID || "",
};
