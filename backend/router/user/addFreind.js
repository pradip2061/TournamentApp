const express = require("express");
const router = express.Router();
const { User } = require("../../model/schema");

const { jwtDecode } = require("jwt-decode");
const Authverify = require("../../middleware/AuthVerify");

router.get("/addFriends", (req, res) => {
  res.send("Add Friends Page");
});

router.post("/search-users", Authverify, async (req, res) => {
  console.log("Search user route _-------->");
  try {
    const { name } = req.body;
    const userId = req.user; // Extract _id properly

    console.log("User ID:", userId);

    if (!userId) {
      console.log("User ID not found .........");
      return res.status(400).json({ message: "User ID not found" });
    }

    // Fetch the user's friends list
    const user = await User.findById(userId).lean();
    const mainuser = user;
    const userFriends = user?.friends || []; // Ensure it's always an array

    console.log("User's friends:", userFriends);

    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    const searchTerm = name.toLowerCase();
    const regex = new RegExp(searchTerm, "i");

    // Find users with matching usernames, including the friends field
    const users = await User.find({ username: regex })
      .select("_id username image friends")
      .lean();

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found with that name",
        users: [],
      });
    }

    const formattedUsers = users
      .filter(
        (user) =>
          user._id.toString() !== userId.toString() &&
          !mainuser.friends.some((f) => f.id === user._id.toString())
      )
      .map((user) => ({
        id: user._id,
        username: user.username,
        image: user.image || null,
      }));

    return res.status(200).json({
      message: `Found ${formattedUsers.length} users matching "${name}"`,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// route to search
router.post("/addFriends", Authverify, async (req, res) => {
  console.log("add Friend route hit >>>>>>>>> ");
  try {
    const { friendId } = req.body;
    const userId = req.user;

    console.log("User Id ----> " + userId);

    if (!friendId) {
      return res.status(400).json({ message: "FriendId is required" });
    }

    const user = await User.findOne({ _id: userId }).lean();
    const friend = await User.findOne({ _id: friendId }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Check if they are already friends
    const isUserAlreadyFriends = await User.exists({
      _id: userId,
      "friends.id": friendId,
    });

    const isFriendAlreadyFriends = await User.exists({
      _id: friendId,
      "friends.id": userId,
    });

    console.log("Friend data:", friend);

    if (isUserAlreadyFriends) {
      return res.json({ message: "Friend already added" });
    }

    // Add friend to user's friend list
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          friends: {
            id: friendId,
            latestMessage: {
              message: {},
            },
          },
        },
      }
    );

    // Only add user to friend's friend list if user is NOT already in their list
    if (!isFriendAlreadyFriends) {
      await User.updateOne(
        { _id: friendId },
        {
          $push: {
            friends: {
              id: userId,
            },
          },
        }
      );
    }

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
