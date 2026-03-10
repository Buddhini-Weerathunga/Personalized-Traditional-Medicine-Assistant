const mongoose = require('mongoose');

const JointAngleSchema = new mongoose.Schema({
  min: { type: Number, required: true, default: 160 },
  max: { type: Number, required: true, default: 200 },
  ideal: { type: Number, required: true, default: 180 }
}, { _id: false });

const TimerSettingsSchema = new mongoose.Schema({
  defaultHoldTime: { type: Number, default: 30 },
  minHoldTime: { type: Number, default: 15 },
  maxHoldTime: { type: Number, default: 60 },
  restTimeBetweenPoses: { type: Number, default: 10 },
  breathingCycles: { type: Number, default: 5 },
  holdTimeByLevel: {
    beginner: { type: Number, default: 20 },
    intermediate: { type: Number, default: 30 },
    advanced: { type: Number, default: 45 }
  }
}, { _id: false });

const YogaPoseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  sanskritName: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    default: 'beginner'
  },
  category: {
    type: String,
    enum: ['standing', 'seated', 'supine', 'prone', 'inversion', 'balance'],
    required: true,
    default: 'standing'
  },
  description: String,
  benefits: [String],
  precautions: [String],
  idealAngles: {
    type: Map,
    of: JointAngleSchema,
    required: true,
    default: new Map([
      ['left_shoulder', { min: 160, max: 200, ideal: 180 }],
      ['right_shoulder', { min: 160, max: 200, ideal: 180 }],
      ['left_elbow', { min: 160, max: 200, ideal: 180 }],
      ['right_elbow', { min: 160, max: 200, ideal: 180 }],
      ['left_hip', { min: 160, max: 200, ideal: 180 }],
      ['right_hip', { min: 160, max: 200, ideal: 180 }],
      ['left_knee', { min: 170, max: 190, ideal: 180 }],
      ['right_knee', { min: 170, max: 190, ideal: 180 }]
    ])
  },
  instructions: [String],
  timerSettings: {
    type: TimerSettingsSchema,
    default: () => ({})
  },
  duration: {
    recommended: Number,
    min: Number,
    max: Number
  },
  defaultTolerance: {
    type: Number,
    default: 20
  }
}, { timestamps: true });

module.exports = mongoose.model('YogaPose', YogaPoseSchema);