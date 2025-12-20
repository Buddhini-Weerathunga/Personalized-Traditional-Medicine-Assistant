const mongoose = require("mongoose");

const PatientInputSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* ---------------- BASIC BODY & EATING ---------------- */

    body_frame: {
      type: String,
      enum: ["Thin", "Medium", "Heavy"]
    },

    appetite_level: {
      type: String,
      enum: ["High", "Moderate", "Low", "Variable"]
    },

    meal_regular: {
      type: String,
      enum: ["Yes", "No", "Sometimes"]
    },

    /* ---------------- FOOD INTAKE (1–5) ---------------- */

    spicy_food_frequency: { type: Number, min: 1, max: 5 },
    oily_food_frequency: { type: Number, min: 1, max: 5 },
    sweet_food_frequency: { type: Number, min: 1, max: 5 },
    caffeine_intake: { type: Number, min: 1, max: 5 },
    processed_food_intake: { type: Number, min: 1, max: 5 },
    fruits_intake: { type: Number, min: 1, max: 5 },
    vegetables_intake: { type: Number, min: 1, max: 5 },

    veg_nonveg: {
      type: String,
      enum: ["Vegetarian", "Eggetarian", "Non-Vegetarian"]
    },

    /* ---------------- URINE ---------------- */

    urine_color: {
      type: String,
      enum: ["Clear", "Pale Yellow", "Yellow", "Dark Yellow"]
    },

    /* ---------------- MENTAL ---------------- */

    stress_level: { type: Number, min: 1, max: 5 },
    focus_level: { type: Number, min: 1, max: 5 },

    /* ---------------- SLEEP ---------------- */

    sleep_issues: { type: Number, min: 1, max: 5 },

    /* ---------------- PAIN ---------------- */

    headaches: { type: Number, min: 1, max: 5 },
    joint_pain: { type: Number, min: 1, max: 5 },

    /* ---------------- ENVIRONMENT ---------------- */

    living_environment: {
      type: String,
      enum: ["Hot", "Cool", "Moderate"]
    },

    /* ---------------- FAMILY HISTORY ---------------- */

    family_diabetes: { type: String, enum: ["Yes", "No"], default: "No" },
    family_thyroid: { type: String, enum: ["Yes", "No"], default: "No" },
    family_cholesterol: { type: String, enum: ["Yes", "No"], default: "No" },
    family_obesity: { type: String, enum: ["Yes", "No"], default: "No" },
    family_asthma: { type: String, enum: ["Yes", "No"], default: "No" },
    family_heart_disease: { type: String, enum: ["Yes", "No"], default: "No" },
    family_mental_health: { type: String, enum: ["Yes", "No"], default: "No" },

    /* ---------------- DEMOGRAPHIC ---------------- */

    age: { type: Number },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientInput", PatientInputSchema);
