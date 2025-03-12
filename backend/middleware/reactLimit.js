const {User} = require("../model/schema");

const userRateLimiter = async (req, res,next) => {
  try {
    const userId = req.user; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isplaying === true) {
      return res
        .status(400)
        .json({ message: "previous is running you can't setup matches" });
    }
    next()
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports =userRateLimiter