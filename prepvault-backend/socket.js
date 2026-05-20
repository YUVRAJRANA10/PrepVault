let ioInstance = null

function getCorsOrigins() {
  return (process.env.CORS_ORIGINS || 'http://localhost:5173,https://prep-vault-phi.vercel.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function init(server) {
  const { Server } = require('socket.io')
  // Allow local dev and deployed frontend origins
  ioInstance = new Server(server, { cors: { origin: getCorsOrigins(), credentials: true } })
  ioInstance.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id))
  })
  return ioInstance
}

function getIO() {
  if (!ioInstance) throw new Error('Socket.IO not initialized')
  return ioInstance
}

module.exports = { init, getIO }
