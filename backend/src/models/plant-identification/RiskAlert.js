const mongoose = require('mongoose');

const riskAlertSchema = new mongoose.Schema({
  plantName: { type: String, required: true },
  plantPart: { type: String, required: true },
  purpose: { type: String, default: '' },
  riskLevel: { type: String, enum: ['high', 'medium', 'low'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  howToUse: { type: String, required: true },
  warnings: [String],
  recommendations: [String],
  healthData: {
    age: String,
    medications: [String],
    allergies: [String],
    conditions: [String],
    isPregnant: Boolean,
    isBreastfeeding: Boolean,
    otherHealthInfo: String,
  },
  dismissed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('RiskAlert', riskAlertSchema);
