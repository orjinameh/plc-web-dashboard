const { broadcast } = require('./websocket')
const { PlcData } = require('./db')

let itemCount = 0
let saveCounter = 0

const generateFakeData = async () => {
  itemCount++
  saveCounter++

  const data = {
    temperature: +(20 + Math.random() * 10).toFixed(1),
    pressure: +(1.0 + Math.random() * 1.5).toFixed(2),
    beltSpeed: Math.floor(40 + Math.random() * 20),
    itemCount,
    alarms: [],
    timestamp: new Date()
  }

  // Randomly trigger alarms 10% of the time
  if (Math.random() > 0.9) {
    data.temperature = +(85 + Math.random() * 10).toFixed(1)
    data.alarms.push('HIGH_TEMPERATURE')
  }

  if (Math.random() > 0.95) {
    data.pressure = +(0.3 + Math.random() * 0.1).toFixed(2)
    data.alarms.push('LOW_PRESSURE')
  }

  // Broadcast to dashboard
  broadcast(data)

  // Save to MongoDB every 10 seconds
  if (saveCounter >= 10) {
    saveCounter = 0
    try {
      await new PlcData(data).save()
      console.log('Saved to MongoDB!')
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }
}

const startFakePlc = () => {
  console.log('Fake PLC started!')
  setInterval(generateFakeData, 1000)
}

module.exports = { startFakePlc }