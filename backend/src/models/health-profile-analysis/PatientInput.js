const mongoose = require("mongoose");

const PatientInputSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  body_frame: String,
  appetite_level: String,
  meal_regular: String,

  prakriti_vata_score: Number,
  prakriti_pitta_score: Number,
  prakriti_kapha_score: Number,

  stress_level: Number,
  sleep_issues: Number,
  fatigue: Number,

  age: Number,
  gender: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientInput", PatientInputSchema);
