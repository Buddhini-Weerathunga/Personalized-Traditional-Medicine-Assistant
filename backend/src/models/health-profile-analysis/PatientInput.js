const mongoose = require("mongoose");

const PatientInputSchema = new mongoose.Schema(
  {
    /* ================= USER ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* ================= BASIC BODY & EATING ================= */

    body_frame: {
      type: String,
      enum: ["thin", "medium", "heavy"],
      default: "medium"
    },

    appetite_level: {
      type: String,
      enum: ["Low", "Moderate", "High", "Variable"],
      default: "Moderate"
    },

    meal_regular: {
      type: String,
      enum: ["Yes", "No", "Sometime"],
      default: "Yes"
    },

    /* ================= FOOD INTAKE (1–5 SCALE) ================= */

    spicy_food_frequency: { type: Number, min: 1, max: 5, default: 3 },
    oily_food_frequency: { type: Number, min: 1, max: 5, default: 3 },
    sweet_food_frequency: { type: Number, min: 1, max: 5, default: 3 },
    caffeine_intake: { type: Number, min: 1, max: 5, default: 2 },
    processed_food_intake: { type: Number, min: 1, max: 5, default: 2 },

    veg_nonveg: {
      type: String,
      enum: ["Vegetarian", "Eggetarian", "Non-Vegetarian"],
      default: "Vegetarian"
    },

    /* ================= URINE ================= */

    urine_color: {
      type: String,
      enum: ["clear", "Pale Yellow", "Yellow", "Dark Yellow"],
      default: "Yellow"
    },

    /* ================= MENTAL ================= */

    stress_level: { type: Number, min: 1, max: 5, default: 3 },

    /* ================= SLEEP ================= */
    /* ML expects POSITIVE quality (higher = better) */

    sleep_quality: { type: Number, min: 1, max: 5, default: 3 },

    /* ================= PAIN ================= */

    headache_severity: { type: Number, min: 1, max: 5, default: 3 },
    joint_pain_severity: { type: Number, min: 1, max: 5, default: 3 },

    /* ================= ENVIRONMENT ================= */
    /* MUST MATCH ORDINAL ENCODER */

    environment_temperature: {
      type: String,
      enum: ["cold", "Moderate", "hot"],
      default: "Moderate"
    },

    environment_humidity: {
      type: String,
      enum: ["cold", "Moderate", "hot"],
      default: "Moderate"
    },

    environment_wind: {
      type: String,
      enum: ["cold", "Moderate", "hot"],
      default: "Moderate"
    },

    /* ================= FAMILY HISTORY ================= */

    family_diabetes: { type: String, enum: ["Yes", "No"], default: "No" },
    family_thyroid: { type: String, enum: ["Yes", "No"], default: "No" },
    family_cholesterol: { type: String, enum: ["Yes", "No"], default: "No" },
    family_obesity: { type: String, enum: ["Yes", "No"], default: "No" },
    family_asthma: { type: String, enum: ["Yes", "No"], default: "No" },
    family_heart_disease: { type: String, enum: ["Yes", "No"], default: "No" },
    family_mental_health: { type: String, enum: ["Yes", "No"], default: "No" },

    /* ================= DEMOGRAPHIC ================= */

    age: { type: Number, min: 1, max: 120, default: null },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientInput", PatientInputSchema);
