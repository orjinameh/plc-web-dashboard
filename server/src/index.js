const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')
const { initWebSocket } = require('./websocket')
const { connectDB } = require('./db')
const { startModbus } = require('./modbus')
const { startFakePlc } = require('./fakePlc')


dotenv.config()

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Historical data endpoint
app.get('/api/history', async (req, res) => {
  try {
    const { PlcData } = require('./db')
    const history = await PlcData
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
    res.json(history)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

const PORT = process.env.PORT || 4000

server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await connectDB()
    initWebSocket(server)
    //startModbus()
    // Replace startModbus() with:
    startFakePlc()
})