require('dotenv').config()
const { connectDB } = require('./db')
const app = require('./app')

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Admin API running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
