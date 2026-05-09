require('dotenv').config()
const express = require('express')
const cors = require('cors')

const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, () => console.log(`Admin API running on http://localhost:${PORT}`))
