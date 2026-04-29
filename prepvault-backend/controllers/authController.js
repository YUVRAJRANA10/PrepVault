const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'prepvault_secret_key_2026', {
    expiresIn: '7d'
  })
}

// @route POST /api/auth/signup
async function signup(req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      })
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] })
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      })
    }

    // Create user
    user = await User.create({
      username,
      email,
      password
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @route POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      })
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect email or password' 
      })
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password)
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect email or password' 
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  signup,
  login,
  generateToken
}
