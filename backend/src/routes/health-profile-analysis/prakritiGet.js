const express = require("express");
const router = express.Router();

const auth = require("../../middleware/authMiddleware");
const PrakritiReport = require("../../dosha-diagnosis/models/PrakritiReport");

/**
 * GET /api/prakriti/my-report
 */
router.get("/my-report", auth, async (req, res) => {
  try {
    const report = await PrakritiReport
      .findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!report) {
      return res.status(404).json({ message: "No Prakriti report found" });
    }

    res.json({ report });
  } catch (err) {
    console.error("Prakriti get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
