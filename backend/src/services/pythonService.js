// backend/src/services/pythonService.js
const axios = require("axios");

const PYTHON_BASE_URL =
  process.env.PYTHON_ML_SERVICE_URL || "http://localhost:8001";

async function analyzePrakriti(imageBase64) {
  try {
    const res = await axios.post(`${PYTHON_BASE_URL}/analyze`, {
      image_base64: imageBase64,
    });

    return res.data;
  } catch (err) {
    console.error("[PythonService] Error calling ML service:", err.message);
    throw new Error("Failed to analyze image using ML service");
  }
}

module.exports = { analyzePrakriti };
