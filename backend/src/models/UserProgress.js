const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  overallStats: {
    totalSessions: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 }, // in minutes
    averageScore: { type: Number, default: 0 },
    consistency: { type: Number, default: 0 }
  },
  poseProficiency: [{
    poseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'YogaPose'
    },
    attempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    lastPracticed: Date,
    improvements: [{
      date: Date,
      score: Number,
      feedback: String
    }]
  }],
  personalization: {
    age: Number,
    flexibilityLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    mobilityRestrictions: [String],
    preferredFeedback: {
      type: String,
      enum: ['visual', 'audio', 'both'],
      default: 'both'
    },
    toleranceSettings: {
      type: Map,
      of: Number
    }
  },
  goals: [{
    name: String,
    target: String,
    current: String,
    deadline: Date,
    achieved: { type: Boolean, default: false }
  }],
  lastSession: Date,
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);