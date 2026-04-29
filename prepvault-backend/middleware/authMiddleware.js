const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' })

  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.id).select('-passwordHash')
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

module.exports = authMiddleware
