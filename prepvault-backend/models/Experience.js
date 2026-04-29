const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    trim: true
  },
  difficulty: {
    type: Number,
    required: [true, 'Please provide difficulty level (1-5)'],
    min: 1,
    max: 5
  },
  questions: {
    type: [String],
    required: [true, 'Please provide at least one question'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0
      },
      message: 'Questions must be a non-empty array'
    }
  },
  rounds: {
    type: Number,
    default: 1
  },
  tags: {
    type: [String],
    default: []
  },
  tips: {
    type: String,
    default: ''
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update updatedAt on save
experienceSchema.pre('save', function() {
  this.updatedAt = Date.now()
})

module.exports = mongoose.model('Experience', experienceSchema)
