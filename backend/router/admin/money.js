const express = require("express");
const router = express.Router();

const { moneyRequest, User, withdraw } = require("../../model/schema");
const { getFormattedDate } = require("../../utility/dateformat");

const { jwtDecode } = require("jwt-decode");
const Authverify = require("../../middleware/AuthVerify");

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

router.get("/getWithdrawRequest", async (req, res) => {
  console.log("getMoney Route >>>>>>");

  try {
    const requests = await withdraw.find();
    console.log(requests);
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching money requests" });
  }
});

router.post("/withdraw/:option", Authverify, async (req, res) => {
  console.log("Withdraw Admin Route ----------->");

  console.log(req.body);

  try {
    const adminId = req.user;
    const admin = await User.findById(adminId);

    if (!admin || admin.role !== "admin") {
      console.log("Unauthorized Request ❌ ❌ ❌ ❌");
      return res.status(401).json({
        error: "Unauthorized Request",
        message: "Unauthorized Request",
      });
    }

    const { requestId, image, message } = req.body;
    const option = req.params.option;

    if ((!option, !requestId, !message)) {
      console.log("Missing Fields  ❌ ❌ ❌ ❌");
      return res.status(400).json({
        error: "Missing Fields",
        message: "Missing Fields",
      });
    }

    const request = await withdraw.findById(requestId);
    if (!request) {
      console.log("Request Not Found ❌ ❌ ❌ ❌");
      return res.status(404).json({ error: "Request Not Found" });
    }

    console.log(request);
    const sender = await User.findById(request.senderId);
    if (!sender) {
      console.log("Sender Not Found ❌ ❌ ❌ ❌");
      return res.status(400).json({ error: "Sender Not Found" });
    }

    let summaryMessage = "";
    let reason = message || " ";

    if (option === "release") {
      summaryMessage = `Withdraw Request Released by Admin: ${admin.username} for amount ${request.amount} in ${request.selectedMethod}: ${request.Number}`;
      request.status = "approved";
      request.image = image;
    } else if (option === "drop") {
      summaryMessage = `Withdraw Request dropped by Admin: ${admin.username} for amount ${request.amount}`;
      sender.balance += request.amount;
      request.status = "rejected";
    } else {
      return res.status(400).json({ error: "Invalid option" });
    }

    // Update request & sender details

    // Update image
    request.statusmessage = summaryMessage;

    sender.accountHistory.push({
      admin: admin.username,
      statusmessage: summaryMessage,
      image: image,
      reason: reason,
    });

    await sender.save();
    await request.save();

    res.json({
      message: `Withdraw Request ${option}ed for user ${sender.username}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing withdrawal request" });
  }
});

router.post("/:option/:token", async (req, res) => {
  console.log("Release Money Request >>>>>>>>>>>>********<<<<<<<<<<");
  const { option, token } = req.params;
  const { id, message } = req.body;
  console.log(req.body);

  const adminMessage = message;
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  const request = await moneyRequest.findById(id);
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  try {
    const decoded = jwtDecode(token);
    const admin = await User.findById(decoded.id).lean();

    console.log("adminUserName", admin.username);
    const amount = request.amount; // Use request amount or fallback to 200

    if (!admin || admin.role !== "admin") {
      console.log("Unauthorized Request ❌  ❌ ❌ ❌ ");
      return res.status(401).json({ error: "Unauthorized Request" });
    }

    //  >>>>>>>>>>>>>>> if released <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const senderId = request.senderId.toString();
    console.log("sender Id >>>>>>>>>>>>>>>>>", senderId);
    if (option === "release") {
      console.log(" before release option _------------<....>");

      const sender = await User.findById(senderId);

      console.log("type of senderId , ", typeof senderId);
      if (!sender) {
        console.log("Sender not found------>");
        return res.status(404).json({ error: "Sender not found" });
      }

      if (!Array.isArray(sender.accountHistory)) {
        sender.accountHistory = [];
      }

      // Update balance

      request.status = "approved";
      sender.balance += amount;

      console.log(" Balance Updated -------------> ");

      const summaryMessage = `Deposite  request approved for ${request.amount} by ${admin.username} for ${request.selectedMethod} ${request.Number}`;

      const historyRecord = {
        updated: new getFormattedDate(),
        admin: admin.username,
        message: summaryMessage,
        image: request.image,
      };

      request.statusmessage = summaryMessage;

      // Push to history array
      sender.accountHistory.push(historyRecord);

      // Save the user document and request
      await sender.save();
      await request.save();

      console.log(sender.accountHistory);
      return res.status(200).json({
        message:
          "Balance updated, history recorded, and request released successfully",
      });
    }
    //  >>>>>>>>>>>>>>> if dropped <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    else if (option === "drop") {
      // Set status to rejected for drop

      console.log("Drop Request -------------------> ");

      const sender = await User.findById(senderId);

      if (!sender) {
        console.log("Sender not found------>");
        return res.status(404).json({ error: "Sender not found" });
      }

      // Ensure history array exists
      if (!Array.isArray(sender.history)) {
        sender.history = [];
      }

      const requestSummary = `Deposite request dropped by admin : ${admin.username} image : ${request.image}`;

      const historyRecord = {
        message: requestSummary,
        Reason: adminMessage,
        date: getFormattedDate(),
      };

      request.status = "rejected";
      request.statusmessage = requestSummary;

      console.log("Status Message", request.statusmessage);
      // Add to history
      sender.accountHistory.push(historyRecord);

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
