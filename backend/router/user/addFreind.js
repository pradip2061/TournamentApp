const express = require("express");
const router = express.Router();
const { User } = require("../../model/schema");

router.get("/addFriends", (req, res) => {
  res.send("Add Friends Page");
});

router.post("/addFriends/:userId", async (req, res) => {
  console.log("add Friend route hit >>>>>>>>> ");
  try {
    const { userId } = req.params;
    const { friendId, username, photoUrl } = req.body; // Expecting friend data in request body

    if (!friendId || !username || !photoUrl) {
      return res
        .status(400)
        .json({ message: "FriendId, username , and photoUrl are required" });
    }

    const user = await User.findOne({ _id: userId }); // Find user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friends.some((friend) => friend.id === friendId)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    // Add friend data to user's friends array
    user.friends.push({ id: friendId, username: username, photoUrl: photoUrl });
    await user.save();

    res
      .status(200)
      .json({ message: "Friend added successfully", friends: user.friends });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
