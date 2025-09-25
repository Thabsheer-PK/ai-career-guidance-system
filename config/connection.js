require('dotenv').config()
const mongoose = require('mongoose')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('DB CONNECTED');
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }

}

module.exports = {connectDB};