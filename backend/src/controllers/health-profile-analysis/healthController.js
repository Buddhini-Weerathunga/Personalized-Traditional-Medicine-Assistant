const PatientInput = require("../../models/health-profile-analysis/PatientInput");
const { getPrediction } = require("../../services/ml.service");
const mapProfileToML = require("../../utils/mapProfileToML");

exports.predictMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 Get latest profile of this user
    const profile = await PatientInput
      .findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!profile) {
      return res.status(404).json({
        error: "No health profile found for this user"
      });
    }

    const mlInput = mapProfileToML(profile);
    const prediction = await getPrediction(mlInput);

    res.json({ success: true, prediction });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
};
