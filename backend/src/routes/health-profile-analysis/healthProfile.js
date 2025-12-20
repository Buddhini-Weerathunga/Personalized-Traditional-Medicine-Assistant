const express = require("express");
const router = express.Router();

const auth = require("../../middleware/authMiddleware"); 
const PatientInput = require("../../models/health-profile-analysis/PatientInput");

// 🔐 Get latest health profile of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const profile = await PatientInput
      .findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
