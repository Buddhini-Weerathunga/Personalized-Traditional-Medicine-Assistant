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
    type: Map,
    of: {
      current: Number,
      ideal: Number,
      deviation: Number,
      isCorrect: Boolean
    }
  },
  corrections: [{
    joint: String,
    message: String,
    timestamp: Date,
    severity: String
  }],
  score: Number,
  feedback: {
    postureAccuracy: Number,
    alignmentScore: Number,
    suggestions: [String]
  },
  difficultyLevel: String
}, { timestamps: true });

module.exports = mongoose.model('YogaSession', YogaSessionSchema);