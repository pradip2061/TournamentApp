
const mongoose = require('mongoose');
const signUp = require('../model/signUpModel');


const userRateLimiter = async (req, res, next) => {
  try{
    const userId = req.user
    const user = await signUp.findById(userId)
    if(user.isplaying == true){
      return res.status(404).json({ message: "you can't setup matches until the previous match is finished" });
    }

  next()
 
} catch (error) {
  console.error("Error fetching matches:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
};

module.exports = userRateLimiter;

// const userMatches = await ClashSquad.find({
//   $or: [{ "teamHost.userid": userId }, { "teamopponent.userid": userId }], // Match if user is in host or opponent
//   status: { $in: ["pending", "running"] }, // Only fetch pending or running matches
// });