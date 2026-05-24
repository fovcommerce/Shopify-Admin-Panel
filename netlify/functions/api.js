const serverless = require('serverless-http')
const { connectDB } = require('../../AdminPanelBackend/src/db')
const app = require('../../AdminPanelBackend/src/app')

// Cache DB connection across warm Lambda invocations
let dbConnected = false

const handler = serverless(app)

module.exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for the event loop to be empty
  context.callbackWaitsForEmptyEventLoop = false

  if (!dbConnected) {
    await connectDB()
    dbConnected = true
  }

  return handler(event, context)
}
