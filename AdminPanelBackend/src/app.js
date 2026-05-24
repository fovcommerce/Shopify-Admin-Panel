const express = require('express')
const cors = require('cors')

const storesRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Routes — no /api prefix here so the Netlify Function works cleanly.
// The local dev server (index.js) adds /api when mounting.
app.use('/auth', authRouter)
app.use('/stores', storesRouter)
app.use('/users', storesRouter)

module.exports = app
