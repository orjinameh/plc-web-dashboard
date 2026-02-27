const ModbusRTU = require('modbus-serial')
const { PlcData } = require('./db')
const { broadcast } = require('./websocket')

const client = new ModbusRTU()

// PLC data state
let plcState = {
  temperature: 0,
  pressure: 0,
  beltSpeed: 0,
  itemCount: 0,
  alarms: []
}

const connectModbus = async () => {
  try {
    // Connect to CODESYS via Modbus TCP
    await client.connectTCP(
      process.env.PLC_HOST || '127.0.0.1',
      { port: process.env.PLC_PORT || 502 }
    )
    client.setID(1)
    console.log('Modbus connected!')
  } catch (error) {
    console.error('Modbus connection failed:', error)
    // Retry after 5 seconds
    setTimeout(connectModbus, 5000)
  }
}

const readPLCData = async () => {
  try {
    // Read 4 registers starting from address 0
    // Register 0 = temperature
    // Register 1 = pressure
    // Register 2 = belt speed
    // Register 3 = item count
    const registers = await client.readHoldingRegisters(0, 4)

    plcState = {
      temperature: registers.data[0] / 10, // e.g. 254 → 25.4°C
      pressure: registers.data[1] / 100,   // e.g. 120 → 1.20 bar
      beltSpeed: registers.data[2],        // e.g. 50 rpm
      itemCount: registers.data[3],        // e.g. 142 items
      alarms: getAlarms(registers.data),
      timestamp: new Date()
    }

    // Broadcast to dashboard via WebSocket
    broadcast(plcState)

    // Save to MongoDB every 10 seconds
    if (Date.now() % 10000 < 1000) {
      await new PlcData(plcState).save()
    }

  } catch (error) {
    console.error('Error reading PLC data:', error)
  }
}

const getAlarms = (data) => {
  const alarms = []

  if (data[0] / 10 > 80) alarms.push('HIGH_TEMPERATURE')
  if (data[1] / 100 < 0.5) alarms.push('LOW_PRESSURE')
  if (data[2] === 0) alarms.push('BELT_STOPPED')

  return alarms
}

const startModbus = async () => {
  await connectModbus()
  // Read PLC data every 1 second
  setInterval(readPLCData, 1000)
}

module.exports = { startModbus }