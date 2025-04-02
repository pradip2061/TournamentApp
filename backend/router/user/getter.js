const express = require("express");
const router = express.Router();

const { User } = require("../../model/schema");
const ClashSquad = require("../../model/ClashSquadModel");
const Authverify = require("../../middleware/AuthVerify");
const mongoose = require("mongoose");
// Route to send specific data only *****************************
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/userRequest/:request", Authverify, async (req, res) => {
  console.log("Route request Active >>>>>>>>>>>>>>>>>>>>>>>>>>>");

  try {
    const { request } = req.params;
    console.log("User data from auth middleware:", req.user);

    // Ensure req.user is a valid ObjectId
    if (!req.user || !isValidObjectId(req.user)) {
      return res.status(401).json({ message: "Unauthorized: Invalid user ID" });
    }

    // Convert req.user to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user);
    const user = await User.findById(userId).lean();

    if (!user) {
      console.log("User not Found ------->");
      return res.status(404).json({ message: "User not found" });
    }
    if (request === "friends") {
      if (!Array.isArray(user.friends) || user.friends.length === 0) {
        return res.json({ message: "No friends found" });
      }

      console.log("Fetching friend details...");

      // Map friend IDs and maintain structure
      const friendIdMap = new Map();
      const friendIds = user.friends
        .map((f) => {
          if (isValidObjectId(f?.id)) {
            friendIdMap.set(f.id, f); // Store original object
            return new mongoose.Types.ObjectId(f.id);
          }
          return null;
        })
        .filter(Boolean);

      if (friendIds.length === 0) {
        return res.json({ message: "No valid friends found" });
      }

      // Fetch all friends in parallel
      const friends = await User.find({ _id: { $in: friendIds } }).select(
        "_id username image"
      );

      // Merge fetched data with existing friend objects
      const updatedFriends = user.friends.map((f) => {
        const updatedFriend = friends.find((friend) => friend._id.equals(f.id));
        return updatedFriend
          ? {
              ...f,
              username: updatedFriend.username,
              image: updatedFriend.image,
            }
          : f;
      });

      console.log("Friends fetched and merged successfully!");
      return res.json(updatedFriends);
    }

    if (request === "user") {
      return res.send(user);
    }

    // Validate request key
    if (!Object.prototype.hasOwnProperty.call(user, request)) {
      return res
        .status(400)
        .json({ message: `Invalid request: '${request}' not found` });
    }

    console.log("Returned......... ", user[request]);
    return res.json(user[request]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  ********** fix this to use admin token instead of direct admin userId **********
router.post("/admin/updateUser/:adminId/:userId", async (req, res) => {
  console.log("update Route Active >>>>>>>>>>>>>>>>>>>>>>>>>> ");
  try {
    const { adminId, userId } = req.params;
    const admin = await User.findById(adminId).lean();

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized Request" });
    }

    const updateData = req.body;

    const formattedDate = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
        $push: {
          accountHistory: {
            date: formattedDate,
            description: `${admin.username}: updated  ${JSON.stringify(
              req.body
            )}`,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(updatedUser.username);
    res.status(200).json({
      message: `Updated balance: ${updatedUser.balance}, Trophy: ${updatedUser.trophy}`,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getMatch/:matchId", async (req, res) => {
  try {
    const matchId = req.params.matchId; // No need for JSON()
    const match = await ClashSquad.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.status(200).json(match);
  } catch (error) {
    console.error("Error getting match:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
