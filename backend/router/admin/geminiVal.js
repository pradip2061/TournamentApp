const express = require("express");
const router = express.Router();
const { Tournament } = require("../../model/schema");
require("dotenv").config();

router.get("/matchValidation", (req, res) => {
  res.send("This is the Gemini router");
});
router.post("/matchValidation/geminiValidate", async (req, res) => {
  console.log("Gemini Route Got hit !!!!!!!!!!..............");
  let message = "";
  let tournament = {};
  let confirmationData = null;

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  async function sendImageToGemini(base64, question) {
    const base64Image = base64;

    if (!base64Image) {
      return; // Or handle the error as needed
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    };

    try {
      const result = await model.generateContent([question, imagePart]);
      const response = result.response;

      if (response && response.candidates && response.candidates.length > 0) {
        const text = response.candidates[0].content.parts[0].text;
        console.log("\n\n\n\n" + text);
        return text;
      } else {
        console.error("Unexpected API response format:", response);
      }
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
    }
  }

  const { photo, which, matchId, top1, top2, type } = req.body;
  console.log(which, matchId);

  if (which == "first") {
    try {
      const response = await Tournament.findById(matchId);
      tournament = response;
      console.log(`${tournament} ${process.env.PROMPT1}`);
      const msg = await sendImageToGemini(
        photo,
        `${tournament} ${process.env.PROMPT1}`
      );
      console.log(msg);
      res.json({ message: msg });
    } catch (error) {
      console.log(error);
      message = "Error finding tournament";
      res.status(401).json({ message });
    }
  } else if (which == "last") {
    console.log(which);
    console.log("Prompt , ", `${tournament} ${process.env.PROMPT2}`);
    try {
      const response = await Tournament.findById(matchId);
      tournament = response;
      const msg = await sendImageToGemini(
        photo,
        `${tournament} ${process.env.PROMPT2}`
      );
      console.log(msg);

      // Store confirmation data for potential future use
      confirmationData = {
        matchId,
        top1,
        top2,
        type,
      };

      // Send confirmation request
      res.json({
        message: msg,
        confirmationRequired: true,
        prompt: "Are you sure you want to confirm and distribute rewards?",
      });
    } catch (error) {
      console.log(error);
      message = "Error finding tournament";
      res.status(401).json({ message });
    }
  }
});

// New route to handle confirmation and reward distribution
router.post("/confirm-match-rewards", async (req, res) => {
  const { confirmation, matchId, top1, top2, type } = req.body;

  // Validate confirmation
  if (!confirmation) {
    return res.status(400).json({
      message: "Reward distribution not confirmed",
    });
  }

  // Create a new session for the transaction
  const session = await mongoose.startSession();

  try {
    if (!type) {
      return res.status(400).json({ message: "Invalid Match Type" });
    }

    if (!top1 || !top2 || !Array.isArray(top1) || !Array.isArray(top2)) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    // Start a database transaction
    await session.startTransaction();

    // Determine the correct model based on type
    const MatchModel = type === "ff" ? FFMatch : PUBGMatch;

    const match = await MatchModel.findById(matchId).session(session);
    if (!match) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Match not found" });
    }

    const entryFee = match.entryFee;

    // Process top1 players (3x entry fee)
    const top1Rewards = await Promise.all(
      top1.map(async (player) => {
        const user = await User.findById(player.id).session(session);
        if (!user) {
          throw new Error(`User not found: ${player.id}`);
        }

        user.balance += entryFee * 3;
        await user.save({ session });

        return {
          userId: player.id,
          username: player.username,
          reward: entryFee * 3,
        };
      })
    );

    // Process top2 players (1.5x entry fee)
    const top2Rewards = await Promise.all(
      top2.map(async (player) => {
        const user = await User.findById(player.id).session(session);
        if (!user) {
          throw new Error(`User not found: ${player.id}`);
        }

        user.balance += entryFee * 1.5;
        await user.save({ session });

        return {
          userId: player.id,
          username: player.username,
          reward: entryFee * 1.5,
        };
      })
    );

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      message: "Rewards distributed successfully",
      top1Rewards,
      top2Rewards,
    });
  } catch (error) {
    // Abort transaction if there's an error
    await session.abortTransaction();
    console.error("Error distributing match rewards:", error);
    res.status(500).json({
      error: "Failed to distribute rewards",
      details: error.message,
    });
  } finally {
    // End the session
    session.endSession();
  }
});

module.exports = router;
