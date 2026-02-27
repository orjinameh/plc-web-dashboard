const { broadcast } = require('./websocket')

let itemCount = 0

const generateFakeData = () => {
  itemCount++

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

  broadcast(data)
}

const startFakePlc = () => {
  console.log('Fake PLC started!')
  setInterval(generateFakeData, 1000)
}

module.exports = { startFakePlc }