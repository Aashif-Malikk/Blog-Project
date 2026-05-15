const mongoose = require('mongoose')
require('dotenv').config()

const DB_NAME = 'blog'

const ConnectDB = async () => {
  try {
    let uri = (process.env.MONGO_URL || '').trim()
    if (!uri) {
      throw new Error('MONGO_URL is missing in .env')
    }
    // Avoid mongodb://host:port//blog — trailing slash on MONGO_URL causes invalid namespace (e.g. /blog.images)
    uri = uri.replace(/\/+$/, '')

    await mongoose.connect(uri, { dbName: DB_NAME })
    console.log(`MongoDB connected successfully (database: ${DB_NAME})`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

module.exports = ConnectDB
