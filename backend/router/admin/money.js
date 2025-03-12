const express = require("express");
const router = express.Router();

const { moneyRequest, User } = require("../../model/schema");
const { getFormattedDate } = require("../../utility/dateformat");

const { jwtDecode } = require("jwt-decode");

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
  const { id, senderId, message } = req.body;
  console.log(req.body);

  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const request = await moneyRequest.findById(id);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  console.log("money Request ;", request);

  try {
    const decoded = jwtDecode(token);
    const admin = await User.findById(decoded.id).lean();

    console.log("adminUserName", admin.username);
    const amount = request.amount || 200; // Use request amount or fallback to 200

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized Request" });
    }

    //  >>>>>>>>>>>>>>> if released <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    if (option === "release") {
      // Set status to approved for release
      request.status = "approved";

      const sender = await User.findById(senderId);

      console.log("user Name ---------->", sender.username);

      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }

      // Create the history record
      const oldBalance = sender.balance;

      // Ensure accountHistory exists
      if (!Array.isArray(sender.accountHistory)) {
        sender.accountHistory = [];
      }

      // Update balance
      sender.balance += amount;

      const historyRecord = {
        updated: new getFormattedDate(),
        admin: admin.username,
        message: `${oldBalance} to ${sender.balance}`,
      };

      // Push to history array
      sender.accountHistory.push(historyRecord);

      // Save the user document and request
      await sender.save();
      await request.save();

      return res.status(200).json({
        message:
          "Balance updated, history recorded, and request released successfully",
      });
    }
    //  >>>>>>>>>>>>>>> if dropped <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    else if (option === "drop") {
      // Set status to rejected for drop
      request.status = "rejected";
      const sender = await User.findById(senderId);

      if (!sender) {
        return res.status(404).json({ error: "Sender not found" });
      }

      // Ensure history array exists
      if (!Array.isArray(sender.history)) {
        sender.history = [];
      }

      const historyRecord = {
        message:
          message ||
          `Deposite request dropped by admin : ${admin.username} : Reason ${message}`,
        date: new Date(),
      };

      // Add to history
      sender.history.push(historyRecord);

      // Save changes
      await sender.save();
      await request.save();

      return res.status(200).json({
        message: "Request dropped and history recorded successfully",
      });
    } else {
      console.log("Invalid option");
      return res.status(400).json({ error: "Invalid option" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
