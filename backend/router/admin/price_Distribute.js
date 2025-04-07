const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { User } = require("../../model/schema");
const FFfreefire = require("../../model/FullMatchFFModel");
const PubgFull = require("../../model/PubgFullMatchModel");

router.get("/distribute-prizes", async (req, res) => {
  res.send("Distribution Route ");
});

router.post("/distribute-prizes", async (req, res) => {
  console.log("Distribute Route got Hit !!!!!");

  const session = await mongoose.startSession();

  try {
    const { player3x, player1_5x, unselected, match_id, matchType } = req.body;

    if (!player3x || !player1_5x || !unselected || !match_id || !matchType) {
      console.log("Missing Fields -------<> ");
      return res.status(400).json({ message: "Invalid Request" });
    }

    const results = [];
    const allPlayers = [
      ...player3x.map((p) => ({ ...p, multiplier: 3 })),
      ...player1_5x.map((p) => ({ ...p, multiplier: 1.5 })),
    ];

    let matchModel;
    let matchKey;

    if (matchType === "FF") {
      matchModel = FFfreefire;
      matchKey = "FreefireFull";
    } else if (matchType === "pubg") {
      matchModel = PubgFull;
      matchKey = "PubgFull";
    } else {
      return res.status(400).json({ message: "Invalid Match Type" });
    }

    const match = await matchModel.findById(match_id);
    if (!match) throw new Error("Match not found");

    await session.withTransaction(async () => {
      // Winners
      for (const player of allPlayers) {
        const { userId, position, multiplier } = player;
        const prize = match.entryFee * multiplier;

        console.log(
          `Distributing ${prize} points to ${userId} with multiplier ${multiplier} at position ${position}`
        );

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $inc: { balance: prize },
            $push: {
              [`victory.${matchKey}`]: {
                match_id,
                position,
              },
            },
          },
          { new: true, session }
        );

        if (!updatedUser) throw new Error(`User not found: ${userId}`);

        results.push({
          userId,
          position,
          multiplier,
          prize,
          status: "success",
        });
      }

      // Unselected (Loss)
      for (const user of unselected) {
        const { userId, position } = user;

        console.log(`Saving history only for unselected user ${userId}`);

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              [`Loss.${matchKey}`]: {
                match_id,
                position,
              },
            },
          },
          { new: true, session }
        );

        if (!updatedUser)
          throw new Error(`Unselected user not found: ${userId}`);

        results.push({
          userId,
          position,
          prize: 0,
          status: "history-only",
        });
      }
    });

    session.endSession();

    res.status(200).json({
      message: "Prizes distributed and history updated successfully",
      data: results,
    });
  } catch (error) {
    session.endSession();
    console.error("Error distributing prizes:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
