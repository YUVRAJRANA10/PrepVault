require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // middleware: parses incoming JSON request bodies

const loggerMiddlewear = require('./middleware/loggerMiddleware')
app.use(loggerMiddlewear)

app.use(express.static('public')) // serves public/index.html at http://localhost:5000/



app.get('/', (req, res) => {
  res.json({ message: 'PrepVault API is running' })
})

const errorMiddleware = require('./middleware/errorMiddleware')
app.use(errorMiddleware) // must be last

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})