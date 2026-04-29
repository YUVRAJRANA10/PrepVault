const fs = require('fs/promises')
const path = require('path')

const logDir = path.join(__dirname, '../logs')
const logPath = path.join(logDir, 'requests.log')

async function logger(req, res, next) {
  try {
    // Ensure logs directory exists
    await fs.mkdir(logDir, { recursive: true })
    
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`
    await fs.appendFile(logPath, log)
  } catch (error) {
    console.error('Logger error:', error.message)
  }
  next()
}

module.exports = logger