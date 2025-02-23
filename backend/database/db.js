const mongoose = require("mongoose");

require("dotenv").config();

// Replace with your MongoDB Atlas URI
const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if connection fails
  }
}

// Export the function
module.exports = connectToDatabase;
