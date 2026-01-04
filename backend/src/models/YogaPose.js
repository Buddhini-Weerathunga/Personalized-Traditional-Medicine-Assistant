const mongoose = require('mongoose');

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
    required: true
  },
  category: {
    type: String,
    enum: ['standing', 'seated', 'supine', 'prone', 'inversion', 'balance']
  },
  description: String,
  benefits: [String],
  precautions: [String],
  idealAngles: {
    type: Map,
    of: {
      min: Number,
      max: Number,
      ideal: Number
    }
  },
  keyPoints: [String],
  instructions: [String],
  duration: {
    recommended: Number,
    min: Number,
    max: Number
  },
  imageUrl: String,
  videoUrl: String,
  defaultTolerance: {
    type: Number,
    default: 10
  }
});

module.exports = mongoose.model('YogaPose', YogaPoseSchema);