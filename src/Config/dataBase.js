const mongoose = require('mongoose');
const connectionString = require('./.env');
const connectDB = async () =>{
    await mongoose.connect(connectionString)
}

module.exports = { connectDB }