require('dotenv').config()

const serverless = require('serverless-http')
const { connectDB } = require('../../AdminPanelBackend/src/db')
const app = require('../../AdminPanelBackend/src/app')

let dbConnected = false
const handler = serverless(app)

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const rawUri = process.env.MONGODB_URI || ''

  // Debug endpoint — visit /api/debug to see what URI the function receives
  if (event.path && event.path.includes('/debug')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uriLength: rawUri.length,
        first30Chars: rawUri.substring(0, 30),
        charCodes: Array.from(rawUri.substring(0, 10)).map(c => c.charCodeAt(0)),
        startsWithMongodb: rawUri.startsWith('mongodb'),
      }),
    }
  }

  if (!rawUri) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MONGODB_URI is not set in Netlify environment variables.' }),
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
