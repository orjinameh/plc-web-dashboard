const jwt = require('jsonwebtoken')
const { User } = require('./user')

const JWT_SECRET = process.env.JWT_SECRET || 'plc-dashboard-secret'

// Register
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const user = new User({ username, password, role })
    await user.save()

    res.json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
}

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token, username: user.username, role: user.role })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
}

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { register, login, protect }