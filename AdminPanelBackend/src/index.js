require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./db')

const storesRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Local dev keeps /api prefix
app.use('/api/auth', authRouter)
app.use('/api/stores', storesRouter)
app.use('/api/users', storesRouter)

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Admin API running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
