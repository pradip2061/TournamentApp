const ClashSquad = require('../model/ClashSquadModel');
const RateLimit = require('../model/RateLimitModel')
const mongoose = require('mongoose');




// // 🔹 Extract User ID from Authorization Header
// const extractUserId = (req) => {
//   const authHeader = req.headers.authorization;
//   return authHeader ? authHeader : req.ip; // Use User ID if available, else fallback to IP
// };

// 🔹 Rate Limiting Middleware (2 requests per 24 hours)
const userRateLimiter = async (req, res, next) => {
  try {
    const userId = req.user
    const now = new Date();
    const windowMs = 1 * 60 * 60 * 1000; // 1 hours

    // Find user request record
    let userRecord = await RateLimit.findOne({ userId });
    console.log(userRecord)
    if (!userRecord) {
      // First request, create a new record
      await RateLimit.create({ userId });
      return next();
    }

    
    const timeDiff = now - userRecord.lastRequest;
    if (timeDiff > windowMs) {
      await RateLimit.deleteOne({ userId });
      // await RateLimit.updateOne({ userId }, { requestCount: 1, lastRequest: now });

      await ClashSquad.updateOne(
        { userid: userId },
        { $pull: { matchDetails: { status: 'completed' } } }
      );
      return next();
    }


    // Block if request limit exceeded
    if (userRecord.requestCount >= 1) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again in 1 hours.' });
    }

    // // Increment request count
    // await RateLimit.updateOne({ userId }, { 
    //   $inc: { requestCount: 1 },
    //   lastRequest: now 
    // });

    // return next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = userRateLimiter;
