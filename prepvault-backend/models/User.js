const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  savedFavorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)
