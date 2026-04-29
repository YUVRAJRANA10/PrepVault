const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateCredentials({ name, email, password }, isRegister = false) {
  if (!email || !password) return 'email and password required'
  if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) return 'Enter a valid email address'
  if (String(password).length < 8) return 'Password must be at least 8 characters long'
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number'
  }
  if (isRegister && (!name || String(name).trim().length < 2)) {
    return 'Name must be at least 2 characters long'
  }
  return null
}

async function register(req, res) {
  const { name, email, password } = req.body
  const validationError = validateCredentials({ name, email, password }, true)
  if (validationError) return res.status(400).json({ success: false, message: validationError })

  const normalizedEmail = String(email).trim().toLowerCase()

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ success: false, message: 'User already exists' })

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = new User({ name: String(name).trim(), email: normalizedEmail, passwordHash: hash, savedFavorites: [] })
  await user.save()

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '6h' })

  res.status(201).json({ success: true, data: { id: user._id, email: user.email, name: user.name }, token })
}

async function login(req, res) {
  const { email, password } = req.body
  const validationError = validateCredentials({ email, password })
  if (validationError) return res.status(400).json({ success: false, message: validationError })

  const normalizedEmail = String(email).trim().toLowerCase()
  const user = await User.findOne({ email: normalizedEmail })
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '6h' })
  res.json({ success: true, data: { id: user._id, email: user.email, name: user.name }, token })
}

module.exports = { register, login }
