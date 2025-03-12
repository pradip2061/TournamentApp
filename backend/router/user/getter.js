const express = require("express");
const router = express.Router();
const { jwtDecode } = require("jwt-decode");
const { User } = require("../../model/schema");
const ClashSquad = require("../../model/ClashSquadModel");

// Route to send specific data only *****************************
router.get("/:request/:token", async (req, res) => {
  console.log("Route request Active >>>>>>>>>>>>>>>>>>>>>>>>>>>");

  try {
    const { token, request } = req.params;

    console.log(token);

    if (!token) {
      console.log("Token not found");
      return res.status(400).json({ message: "Token is required" });
    }

    const id = await jwtDecode(token).id;
    const user = await User.findById(id).populate(request);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (request === "user") {
      return res.json(user);
    }

    const requestedData = user[request];

    if (requestedData === undefined) {
      return res
        .status(400)
        .json({ message: `Invalid request: ${request} not found` });
    }

    // Handle different data types
    if (Array.isArray(requestedData)) {
      return res.json(requestedData); // Return array directly
    } else if (typeof requestedData === "object" && requestedData !== null) {
      return res.json(requestedData); // Return object directly
    } else {
      return res.json({ data: requestedData }); // Wrap primitive values in an object
    }
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
