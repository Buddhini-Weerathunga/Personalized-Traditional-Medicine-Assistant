// backend/src/models/YogaSession.js
const mongoose = require('mongoose');

const YogaSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  poseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YogaPose',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number,
  jointAngles: {
    type: mongoose.Schema.Types.Mixed,  // 🔥 CHANGE from Map to Mixed
    default: {}
  },
  corrections: [{
    joint: String,
    message: String,
    timestamp: Date,
    severity: String,
    currentAngle: Number,
    idealAngle: Number,
    deviation: Number
  }],
  score: Number,
  feedback: {
    postureAccuracy: Number,
    alignmentScore: Number,
    suggestions: [String],
    validJointsCount: Number,
    wrongJointsCount: Number,
    correctJointsCount: Number,
    canStartTimer: Boolean
  },
  difficultyLevel: String
}, { timestamps: true });

module.exports = mongoose.model('YogaSession', YogaSessionSchema);