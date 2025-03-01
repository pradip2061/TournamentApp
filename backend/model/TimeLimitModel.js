const mongoose = require('mongoose');

// Define Rate Limit Schema
const rateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lastRequest: { type: Date, default: Date.now ,expires:30},
});

// Create Model
const timelimit= mongoose.model('timelimit', rateLimitSchema);
module.exports = timelimit;