const express = require("express");

const { User } = require("../../model/schema");

const router = express.Router();

const Authverify = require("../../middleware/AuthVerify");
const PubgFull = require("../../model/PubgFullMatchModel");
const FFfreefire = require("../../model/FullMatchFFModel");
const { default: axios } = require("axios");

router.get("/updatePubg", async (req, res) => {
  console.log("Update Route .....");
  res.send("Update Route .....");
});

router.post("/updateFullMatch", Authverify, async (req, res) => {
  try {
    const userId = req.user;
    const admin = await User.findById(userId).lean();

    console.log("Request Body:", req.body);

    if (!admin || admin.role !== "admin") {
      console.log("Unauthorized Request ........");
      return res.json({ status: "Failed ", message: "Unauthorized Request" });
    }

    const { matchId, coustum, time, matchType } = req.body;
    if (!matchId || !coustum || !matchType) {
      console.log("Missing Request! ........");
      return res
        .status(400)
        .json({ status: "Failed ", message: "Missing Request Parameters" });
    }

    let match;
    if (matchType === "pubG") {
      match = await PubgFull.findById(matchId);
    } else if (matchType === "FF") {
      match = await FFfreefire.findById(matchId);
      console.log(match);
    } else {
      return res.status(400).json({ message: "Invalid match type" });
    }

    console.log("match Game NAme !! .....", match.userid);

    if (!match) {
      console.log("Match Not Found ........");
      return res.status(404).json({ message: "Match not found" });
    }

    match.coustum = coustum;

    if (time) {
      match.time = time;
    }

    await match.save();

    return res.status(200).json({
      message: "Match updated successfully",
      match,
      matchType,
    });
  } catch (error) {
    console.error("Error updating match:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/hideMatch", Authverify, async (req, res) => {
  try {
    const { matchId, matchType } = req.body;

    console.log(matchId, matchType);
    if (!matchId || !matchType) {
      console.log("Missing Request! ........");
      return res.status(400).json({ message: "Missing Request Parameters" });
    }
    let match;
    if (matchType == "pubG") {
      console.log("Creating PubG Match ........");
      match = await PubgFull.findById(matchId.toString());
    } else if (matchType === "FF") {
      console.log("Creating Free Fire  Match ........");
      match = await FFfreefire.findById(matchId.toString());
      console.log("FF", match);
    }

    if (match) {
      console.log(match);
      match.hidden = true;
      match.save();
      res.status(200).send({ message: "Match Hidden Successfully" });
    } else {
      console.log("Ummatched Prospecaity ++++++++++++ " + match);
      console.log("match not found .......");
      return res.status(400).json({ message: "Invalid match type" });
    }
  } catch (error) {
    console.error("Error hiding match:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
