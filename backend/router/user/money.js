const express = require("express");
const { moneyRequest, User, withdraw } = require("../../model/schema");
const router = express.Router();
const mongoose = require("mongoose");
const { jwtDecode } = require("jwt-decode");
const Authverify = require("../../middleware/AuthVerify");
const { getFormattedDate } = require("../../utility/dateformat");

router.get("/money", (req, res) => {
  res.send("This is Money page ! ");
});

router.post("/withDraw", Authverify, async (req, res) => {
  const { amount, selectedMethod, number } = req.body;
  const userId = req.user; // No need for await

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const username = user.username;

  console.log(req.body);

  if (!amount || !selectedMethod || !number) {
    console.log("Missing fields ----------> ");
    return res.status(400).json({ error: "All fields are required." });
  }

  if (amount > user.balance) {
    return res.json({ message: "Insufficeint Fund " });
  }

  try {
    const senderId = req.user;

    const formattedDate = getFormattedDate();
    console.log(formattedDate);

    const Request = new withdraw({
      _id: new mongoose.Types.ObjectId(),
      senderId,
      username,
      amount,
      image: "",
      selectedMethod,
      Number: number, // Ensure `number` is assigned properly
      date: formattedDate,
      statusmessage: "",
      status: "pending",
    });

    console.log("----------Here ----------->");

    console.log(Request);
    const history = {
      message: `Withdrawal Request of ${amount} made for ${selectedMethod}: ${Request.Number}`,
      date: getFormattedDate(), // Ensure date is stored
    };
    user.balance -= amount;

    user.accountHistory.push(history); // Correct way to push history

    await Request.save();
    await user.save(); // Ensure user history is saved
    console.log("_____Acount Updated _____");
    res.status(200).json({
      message:
        "Request sent, your wallet will recive the amount within an hour!",
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/Deposite", Authverify, async (req, res) => {
  console.log("Add money Route --------------------> ");
  const { amount, selectedMethod, image, Number, date } = req.body;
  const userId = req.user; // No need for await

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const username = user.username;
  console.log(username, "made Deposit Request ------------->");

  if (!amount || !selectedMethod || !image || !Number || !date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const senderId = req.user;

    const addMoney = new moneyRequest({
      _id: new mongoose.Types.ObjectId(),
      senderId,
      username,
      amount,
      image,
      selectedMethod,
      Number: Number,
      statusmessage: "",
      date: getFormattedDate(),
      status: "pending",
    });

    const history = {
      date: getFormattedDate(),
      message: `Made a deposit request of ${amount} using ${selectedMethod} with image ${addMoney.Number}`,
      image: `${image}`,
    };

    user.accountHistory.push(history); // Correct way to push history
    await addMoney.save();
    await user.save(); // Save user history

    res.status(200).json({
      message: "Request sent, your balance will be updated within an hour!",
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
