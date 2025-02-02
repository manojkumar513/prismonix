// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Use the MongoDB URI from environment variables for better security
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://kanaparthimanojkumar184:2RuI7hTFDNkKo1Vu@cluster0.e42zt.mongodb.net/";

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
