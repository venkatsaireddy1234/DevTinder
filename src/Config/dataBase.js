const mongoose = require("mongoose");

const connectDB = async () => {
  const connectionString = process.env.MONGO_URI;
  if (!connectionString) {
    throw new Error("Missing MONGO_URI environment variable");
  }
  await mongoose.connect(connectionString);
};

module.exports = { connectDB };
