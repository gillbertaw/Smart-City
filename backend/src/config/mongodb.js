const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB terhubung');
  } catch (error) {
    console.error('Gagal koneksi MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connectMongoDB };
