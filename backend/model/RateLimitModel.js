const mongoose = require('mongoose');

// Define Rate Limit Schema
const rateLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  requestCount: { type: Number, default: 1 },
  lastRequest: { type: Date, default: Date.now },
});

// Create Model
const RateLimit = mongoose.model('RateLimit', rateLimitSchema);
module.exports = RateLimit;
