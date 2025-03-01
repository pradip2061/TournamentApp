const mongoose = require("mongoose");

require("dotenv").config();

// Replace with your MongoDB Atlas URI
const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if connection fails
  }
}

// Export the function
module.exports = connectToDatabase;














// const mongoose = require("mongoose");
// const signUp = require("../model/signUpModel");
// const bcrypt = require("bcrypt");
// require("dotenv").config();

// const mongoURI = process.env.MONGO_URI;

// async function connectToDatabase() {
//   try {
//     await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB Connected Successfully");

   // Function to seed multiple users
   

//     // Call the function to seed admin users
//     await adminSeeded();
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// }

// module.exports = connectToDatabase;
