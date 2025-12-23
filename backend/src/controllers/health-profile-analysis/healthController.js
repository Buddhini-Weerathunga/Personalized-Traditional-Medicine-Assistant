const axios = require("axios");
const PatientInput = require("../../models/health-profile-analysis/PatientInput");
const HealthPrediction = require("../../models/health-profile-analysis/HealthPrediction");

/**
 * @route   POST /api/health-prediction/analyze
 * @desc    Analyze health profile and predict health risks
 * @access  Private
 */
exports.analyzeHealthProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the latest patient input for this user
    const patientInput = await PatientInput
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!patientInput) {
      return res.status(404).json({
        success: false,
        message: "No health profile found. Please create one first."
      });
    }

    // Prepare ML payload (remove MongoDB fields)
    const {
      _id,
      userId: uid,
      createdAt,
      updatedAt,
      __v,
      ...mlPayload
    } = patientInput.toObject();

    console.log("Sending to ML API:", mlPayload);

    // Call Python ML API
    const mlResponse = await axios.post(
      "http://localhost:8000/predict",
      mlPayload,
      {
        timeout: 30000,
        headers: { "Content-Type": "application/json" }
      }
    );

    const predictionData = mlResponse.data;

    // Count active risks
    const activeRisksCount = Object.values(predictionData.health_risk)
      .filter(risk => risk.present === 1)
      .length;

    // Save prediction to database
    const healthPrediction = new HealthPrediction({
      userId,
      patientInputId: patientInput._id,
      predicted_dosha: predictionData.predicted_dosha,
      dosha_distribution: predictionData.dosha_distribution,
      dosha_risk: predictionData.dosha_risk,
      health_risk: predictionData.health_risk,
      primary_future_condition: predictionData.primary_future_condition,
      risk_level: predictionData.risk_level,
      recommendations: predictionData.recommendations,
      active_risks_count: activeRisksCount
    });

    await healthPrediction.save();

    res.json({
      success: true,
      message: "Health prediction completed successfully",
      prediction: healthPrediction
    });

  } catch (err) {
    console.error("ML Prediction Error:", err.response?.data || err.message);
    
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "ML prediction service is unavailable. Please try again later."
      });
    }

    res.status(500).json({
      success: false,
      message: "Health prediction failed",
      error: err.message
    });
  }
};

/**
 * @route   GET /api/health-prediction/latest
 * @desc    Get latest health prediction for logged-in user
 * @access  Private
 */
exports.getLatestPrediction = async (req, res) => {
  try {
    const prediction = await HealthPrediction
      .findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("patientInputId", "age gender body_frame");

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "No health prediction found"
      });
    }

    res.json({
      success: true,
      prediction
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @route   GET /api/health-prediction/history
 * @desc    Get prediction history for logged-in user
 * @access  Private
 */
exports.getPredictionHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const predictions = await HealthPrediction
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("patientInputId", "age gender body_frame meal_regular");

    const total = await HealthPrediction.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      predictions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @route   GET /api/health-prediction/:id
 * @desc    Get specific prediction by ID
 * @access  Private
 */
exports.getPredictionById = async (req, res) => {
  try {
    const prediction = await HealthPrediction
      .findOne({
        _id: req.params.id,
        userId: req.user.id
      })
      .populate("patientInputId");

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found"
      });
    }

    res.json({
      success: true,
      prediction
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @route   DELETE /api/health-prediction/:id
 * @desc    Delete a specific prediction
 * @access  Private
 */
exports.deletePrediction = async (req, res) => {
  try {
    const prediction = await HealthPrediction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found"
      });
    }

    res.json({
      success: true,
      message: "Prediction deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * @route   GET /api/health-prediction/stats
 * @desc    Get health statistics overview
 * @access  Private
 */
exports.getHealthStats = async (req, res) => {
  try {
    const latestPrediction = await HealthPrediction
      .findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!latestPrediction) {
      return res.status(404).json({
        success: false,
        message: "No predictions found"
      });
    }

    const totalPredictions = await HealthPrediction.countDocuments({ 
      userId: req.user.id 
    });

    const riskTrend = await HealthPrediction
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("risk_level active_risks_count createdAt");

    res.json({
      success: true,
      stats: {
        current_dosha: latestPrediction.predicted_dosha,
        current_risk_level: latestPrediction.risk_level,
        active_risks: latestPrediction.active_risks_count,
        total_predictions: totalPredictions,
        risk_trend: riskTrend
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
