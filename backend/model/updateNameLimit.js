const mongoose = require('mongoose');

// Define Rate Limit Schema
const rateLimitSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  userid: { type: String, required: true },
  lastRequest: { type: Date, default: Date.now ,expires:7200},
});

// Create Model
const namelimit= mongoose.model('namelimit', rateLimitSchema);
module.exports = namelimit;