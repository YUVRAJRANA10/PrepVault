const fs = require('fs/promises')
const path = require('path')

const logsDir = path.join(__dirname, '../logs')
const logPath = path.join(logsDir, 'requests.log')

let logInitPromise = null

async function ensureLogFile() {
  if (!logInitPromise) {
    logInitPromise = (async () => {
      await fs.mkdir(logsDir, { recursive: true })
      await fs.appendFile(logPath, '')
    })().catch((err) => {
      console.warn('Logger disabled:', err.message)
    })
  }

  return logInitPromise
}

async function logger(req, res, next) {
  try {
    await ensureLogFile()
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`
    await fs.appendFile(logPath, log)
  } catch (err) {
    console.warn('Failed to write request log:', err.message)
  }

  next()
}

module.exports = logger