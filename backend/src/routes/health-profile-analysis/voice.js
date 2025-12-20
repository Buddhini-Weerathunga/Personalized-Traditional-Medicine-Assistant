const express = require("express");
const router = express.Router();

const auth = require("../../middleware/authMiddleware");
const parseText = require("../../nlp/parser");
const PatientInput = require("../../models/health-profile-analysis/PatientInput");

// ✅ Per-user session storage
const sessionData = {};

router.post("/", auth, async (req, res) => {
  const { step, text } = req.body;
  const userId = req.user.id;

  const parsed = parseText(step, text);

  // Initialize user session
  if (!sessionData[userId]) {
    sessionData[userId] = {};
  }

  // Merge parsed data
  sessionData[userId] = {
    ...sessionData[userId],
    ...parsed
  };

  // ✅ Save ONLY at last step
  if (step === 9) {
    await PatientInput.create({
      userId,
      ...sessionData[userId]
    });

    delete sessionData[userId]; // clear memory
  }

  res.json({ parsed });
});

module.exports = router;
