const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  force: String,
  level: String,
  mechanic: String,
  equipment: String,
  primaryMuscles: [{
    type: String,
    required: true
  }],
  secondaryMuscles: [String],
  instructions: [String],
  category: String,
  images: [String],
  id: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
exerciseSchema.index({ primaryMuscles: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ category: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);