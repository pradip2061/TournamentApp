const express = require("express");
const router = express.Router();

const { moneyRequest, User } = require("../../model/schema");

const jwtDecode = require("jwt-decode");
const { decode } = require("jsonwebtoken");

router.get("/getMoneyRequest", async (req, res) => {
  console.log("getMoney Route >>>>>>");

  try {
    const requests = await moneyRequest.find();
    console.log(requests);
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching money requests" });
  }
});
router.post("/:option/:token", async (req, res) => {
  console.log("Release Money Request >>>>>>>>>>>>********<<<<<<<<<<");
  const { option, token } = req.params;
  const { released, date, balance, senderId, message } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const decoded = jwtDecode(token).id;
  const admin = await User.findById(decoded);

  if (!admin || admin.role !== "admin") {
    return res.status(400).json({ error: "Unauthorized Request" });
  }

  if (option === "release") {
    try {
      const request = await moneyRequest.findById(req.body.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      const sender = await User.findById(senderId);
      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }
      sender.balance += balance;
      const historyRecord = {
        released,
        date,
        balance,
      };

      sender.history.push(historyRecord);

      await sender.save();

      return res
        .status(200)
        .json({ message: "Balance updated and history recorded successfully" });
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (option === "drop") {
    try {
      const request = await moneyRequest.findById(req.body.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      const sender = await User.findById(senderId);
      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }

      // Create history record for dropped request
      const historyRecord = {
        message,
        date,
      };

      sender.history.push(historyRecord);

      // Delete request
      await moneyRequest.findByIdAndDelete(req.body.id);

      await sender.save();

      return res
        .status(200)
        .json({ message: "Request dropped and history recorded successfully" });
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(400).json({ error: "Invalid option" });
});

module.exports = router;