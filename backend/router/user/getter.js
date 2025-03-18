const express = require("express");
const router = express.Router();

const { User } = require("../../model/schema");
const ClashSquad = require("../../model/ClashSquadModel");
const Authverify = require("../../middleware/AuthVerify");

// Route to send specific data only *****************************
router.get("/userRequest/:request", Authverify, async (req, res) => {
  console.log("Route request Active >>>>>>>>>>>>>>>>>>>>>>>>>>>");

  try {
    const { request } = req.params;
    console.log("User data from auth middleware:", req.user);

    const user = await User.findById(req.user);

    if (request === "friends") {
      let friendInfo = [];

      for (let i = 0; i < user.friends.length; i++) {
        console.log();

        const friend = await User.findById(user.friends[i].id);

        console.log(user.friends[i].id);
        friendInfo.push({
          id: user.friends[i].id,
          username: friend.username,
          image: friend.image,
        });

        console.log(friendInfo);
      }

      console.log("Friend info: ", friendInfo);
      return res.json(friendInfo);
    }

    if (!user) {
      console.log("User not found .........");
      return res.status(400).json({ message: "User not found" });
    }

    if (request === "user") {
      return res.json(user);
    }

    if (!(request in user)) {
      return res
        .status(400)
        .json({ message: `Invalid request: ${request} not found` });
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
