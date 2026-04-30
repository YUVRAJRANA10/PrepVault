let ioInstance = null

function init(server) {
  const { Server } = require('socket.io')
  // Frontend runs on 5173 by default (Vite dev server)
  ioInstance = new Server(server, { cors: { origin: 'http://localhost:5173', credentials: true } })
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
