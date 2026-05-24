// Load env vars from .env file (only has effect locally; Netlify injects them from the dashboard)
require('dotenv').config()

const serverless = require('serverless-http')
const { connectDB } = require('../../AdminPanelBackend/src/db')
const app = require('../../AdminPanelBackend/src/app')

// Cache the DB connection across warm function invocations
let dbConnected = false

const handler = serverless(app)

module.exports.handler = async (event, context) => {
  // Don't wait for empty event loop — keeps MongoDB connection alive between calls
  context.callbackWaitsForEmptyEventLoop = false

  // Guard: fail fast with a clear message if the env var is missing
  if (!process.env.MONGODB_URI) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MONGODB_URI environment variable is not set. Add it in Netlify → Site Settings → Environment Variables.' }),
    }
  }

  try {
    if (!dbConnected) {
      await connectDB()
      dbConnected = true
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to MongoDB', detail: err.message }),
    }
  }

  return handler(event, context)
}
