const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const { initWebSocket } = require('./websocket')
const { connectDB } = require('./db')
const { startModbus } = require('./modbus')
const { startFakePlc } = require('./fakePlc')


dotenv.config()

const app = express()
const server = http.createServer(app)

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
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