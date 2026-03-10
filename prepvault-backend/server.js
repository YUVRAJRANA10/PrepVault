require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // middleware: parses incoming JSON request bodies

app.get('/', (req, res) => {
  res.json({ message: 'PrepVault API is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})