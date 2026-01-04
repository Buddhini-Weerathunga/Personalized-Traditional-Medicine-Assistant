const mongoose = require('mongoose');

const YogaSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  duration: Number, // in seconds
  jointAngles: {
    type: Map,
    of: {
      current: Number,
      ideal: Number,
      deviation: Number
    }
  },
  corrections: [{
    joint: String,
    message: String,
    timestamp: Date,
    correctionType: {
      type: String,
      enum: ['visual', 'audio', 'both']
    }
  }],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    postureAccuracy: Number,
    alignmentScore: Number,
    suggestions: [String]
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  toleranceThresholds: {
    type: Map,
    of: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('YogaSession', YogaSessionSchema);