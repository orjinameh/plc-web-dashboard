export type PlcData = {
  temperature: number
  pressure: number
  beltSpeed: number
  itemCount: number
  alarms: string[]
  timestamp: string
}

let socket: WebSocket | null = null

export const connectWebSocket = (
  onData: (data: PlcData) => void,
  onConnect: () => void,
  onDisconnect: () => void
) => {
  socket = new WebSocket('ws://localhost:4000')

  socket.onopen = () => {
    console.log('Connected to PLC server!')
    onConnect()
  }

  socket.onmessage = (event) => {
    const data: PlcData = JSON.parse(event.data)
    onData(data)
  }

  socket.onclose = () => {
    console.log('Disconnected from PLC server!')
    onDisconnect()
    // Reconnect after 3 seconds
    setTimeout(() => connectWebSocket(onData, onConnect, onDisconnect), 3000)
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}