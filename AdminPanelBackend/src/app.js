const express = require('express')
const cors = require('cors')

const storesRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Routes with /api prefix — matches both local dev and Netlify Function paths
app.use('/api/auth', authRouter)
app.use('/api/stores', storesRouter)
app.use('/api/users', storesRouter)

module.exports = app
