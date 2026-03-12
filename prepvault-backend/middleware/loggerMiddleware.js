const fs = require('fs/promises')

const path = require('path')

const logPath = path.join(__dirname, '../logs/requests.log')

async function logger(req, res, next) {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`
  await fs.appendFile(logPath, log)
  next()
}



module.exports = logger