const WebSocket = require('ws')

let wss

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('Dashboard connected!')

    ws.on('close', () => {
      console.log('Dashboard disconnected!')
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })

  console.log('WebSocket server started!')
}

const broadcast = (data) => {
  if (!wss) return

  const message = JSON.stringify(data)

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

module.exports = { initWebSocket, broadcast }