const axios = require("axios");

// 🔥 Python ML service URL
// Make sure FastAPI is running on this port
const ML_SERVICE_URL = "http://localhost:8000/predict";

/**
 * Send health profile data to Python ML service
 * @param {Object} mlInput - mapped ML-ready input
 * @returns {Object} prediction result
 */
async function getPrediction(mlInput) {
  try {
    const response = await axios.post(ML_SERVICE_URL, mlInput, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 10000 // 10 seconds timeout
    });

    return response.data;

  } catch (error) {
    console.error("❌ ML SERVICE ERROR:");

    if (error.response) {
      // Python service responded with error
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // Python service not reachable
      console.error("No response from ML service");
    } else {
      console.error("Error:", error.message);
    }

    throw new Error("Failed to get prediction from ML service");
  }
}

module.exports = { getPrediction };
