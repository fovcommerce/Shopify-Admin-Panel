const mongoose = require('mongoose')

let isConnected = false

async function connectDB() {
  if (isConnected) return

  // Trim whitespace and strip any accidental surrounding quotes
  const uri = (process.env.MONGODB_URI || '').trim().replace(/^["']|["']$/g, '')
  if (!uri) throw new Error('MONGODB_URI is not defined in .env')

  await mongoose.connect(uri)
  isConnected = true
  console.log('✅ Connected to MongoDB')
}

module.exports = { connectDB }
