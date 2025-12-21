const axios = require("axios");

exports.analyzeHealthProfile = async (req, res) => {
  try {
    const {
      _id,
      userId,
      name,
      email,
      createdAt,
      updatedAt,
      __v,
      ...mlPayload
    } = req.body;

    const mlResponse = await axios.post(
      "http://localhost:8000/predict",
      mlPayload
    );

    res.json({
      success: true,
      prediction: mlResponse.data
    });

  } catch (err) {
    console.error("ML ERROR:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Health prediction failed"
    });
  }
};
