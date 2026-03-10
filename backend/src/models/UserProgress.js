// backend/src/models/UserProgress.js
const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  personalization: {
    age: { type: Number, default: 30 },
    flexibilityLevel: { type: String, default: 'medium' },
    mobilityRestrictions: [String],
    preferredFeedback: { type: String, default: 'both' }
  },
  overallStats: {
    totalSessions: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 }
  },
  poseProficiency: [{
    poseId: { type: mongoose.Schema.Types.ObjectId, ref: 'YogaPose' },
    attempts: Number,
    bestScore: Number,
    averageScore: Number,
    lastPracticed: Date
  }],
  lastSession: Date
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);