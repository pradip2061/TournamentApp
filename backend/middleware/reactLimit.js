const ClashSquad = require('../model/ClashSquadModel');
const RateLimit = require('../model/RateLimitModel')
const mongoose = require('mongoose');


const userRateLimiter = async (req, res, next) => {
  try{
    const userId = req.user
  const userMatches = await ClashSquad.find({
    $or: [{ "teamHost.userid": userId }, { "teamopponent.userid": userId }], // Match if user is in host or opponent
    status: { $in: ["pending", "running"] }, // Only fetch pending or running matches
  });

  if (userMatches.length>0) {
    return res.status(404).json({ message: "you can't setup matches until the previous match is finished" });
  }

  next()
 
} catch (error) {
  console.error("Error fetching matches:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
};

module.exports = userRateLimiter;
