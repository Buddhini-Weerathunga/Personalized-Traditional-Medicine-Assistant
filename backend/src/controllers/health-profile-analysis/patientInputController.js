const PatientInput = require("../../models/health-profile-analysis/PatientInput");

exports.saveOrUpdatePatientInput = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = {
      ...req.body,
      userId,
    };

    const record = await PatientInput.findOneAndUpdate(
      { userId },
      data,
      { new: true, upsert: true }
    );

    res.json({ success: true, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
