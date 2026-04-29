const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  rounds: { type: Number, default: 1 },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  questions: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  tips: { type: String, default: '' },
  submittedBy: { type: String, default: 'Anonymous' },
  // New richer fields
  notes: { type: String, default: '' },
  links: { type: [{ label: String, url: String }], default: [] },
  resources: { type: [String], default: [] },
  attachments: { type: [{ filename: String, url: String, mime: String }], default: [] },
  checklist: { type: [{ text: String, done: Boolean }], default: [] },
  comments: { type: [{ user: String, text: String, createdAt: Date }], default: [] },
  upvotes: { type: Number, default: 0 },
  flagged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Experience', experienceSchema)
