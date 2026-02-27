const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected!')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

const plcDataSchema = new mongoose.Schema({
  temperature: Number,
  pressure: Number,
  beltSpeed: Number,
  itemCount: Number,
  alarms: [String],
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const PlcData = mongoose.model('PlcData', plcDataSchema)

module.exports = { connectDB, PlcData }