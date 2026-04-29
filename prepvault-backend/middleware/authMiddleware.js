const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in first'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'prepvault_secret_key_2026')
    
    // Find user
    const user = await User.findById(decoded.id)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // Attach user to request
    req.user = user
    req.userId = user._id
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again'
      })
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

module.exports = authenticate
