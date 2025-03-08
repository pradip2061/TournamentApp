const RateLimit = require("../model/RateLimitModel");

const rateLimitMiddleware = async (req, res, next) => {
    const userId = req.user; // Assuming userId is sent in request
  
    let userRate = await RateLimit.findOne({ userId });
  
    if (!userRate) {
      // Create new record if user is not in DB
      await RateLimit.create({ userId });
      return next();
    }
  
    const now = new Date();
    const timeDiff = (now - userRate.lastRequest) / (1000 * 60); // Convert to minutes
  
    if (timeDiff > 10) {
      // Reset request count after 10 mins
      await RateLimit.updateOne({ userId }, { requestCount: 1, lastRequest: now });
      return next();
    }
  
    if (userRate.requestCount >= 3) {
      return res.status(429).json({ message: "Too many requests. Try again after 10 minutes." });
    }
  
    // Increment request count
    await RateLimit.updateOne({ userId }, { $inc: { requestCount: 1 }, lastRequest: now });
  
    next();
  };

  module.exports = rateLimitMiddleware