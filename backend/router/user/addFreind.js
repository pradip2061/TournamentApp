const express = require("express");
const router = express.Router();
const { User } = require("../../model/schema");

const { jwtDecode } = require("jwt-decode");

router.get("/addFriends", (req, res) => {
  res.send("Add Friends Page");
});
// route to search
router.post("/search-users", async (req, res) => {
  console.log("Search user route _-------->");
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    // Convert the search term to lowercase for case-insensitive comparison
    const searchTerm = name.toLowerCase();

    // Create a regex pattern for flexible matching
    // This will match parts of usernames containing the search term
    const regex = new RegExp(searchTerm, "i");

    // Find users with usernames matching the search pattern
    const users = await User.find({ username: regex })
      .select("_id username image")
      .lean();

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found with that name",
        users: [],
      });
    }

    // Format the response to include only the required fields
    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      image: user.image || null, // Handle cases where image might be undefined
    }));
    console.log(formattedUsers);

    return res.status(200).json({
      message: `Found ${formattedUsers.length} users matching "${name}"`,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/addFriends/:token", async (req, res) => {
  console.log("add Friend route hit >>>>>>>>> ");
  try {
    const { token } = req.params;
    const { friendId } = req.body; // Expecting friend data in request body

    const userId = await jwtDecode(token).id;

    console.log("decoded Id ----> " + userId);

    if (!friendId) {
      return res.status(400).json({ message: "FriendId is required" });
    }

    const user = await User.findOne({ _id: userId }).lean(); // Convert to plain object
    const friend = await User.findOne({ _id: friendId }).lean(); // Convert to plain object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (user.friends.some((f) => f.id === friendId)) {
      return res.json({ message: "Friend already added" });
    }

    if (friend.friends.some((f) => f.id === friendId)) {
      return res.json({ message: "Friend already added" });
    }

    console.log("Friend data:", friend);

    // Add friend to user's friend list
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          friends: {
            id: friendId,
            username: friend.username, // Corrected
            image: friend.image, // Corrected
          },
        },
      }
    );

    // Add user to friend's friend list
    await User.updateOne(
      { _id: friendId },
      {
        $push: {
          friends: {
            id: userId,
            username: user.username, // Corrected
            image: user.image, // Corrected
          },
        },
      }
    );

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;