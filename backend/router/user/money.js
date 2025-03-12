const express = require("express");
const { moneyRequest, User } = require("../../model/schema");
const router = express.Router();
const mongoose = require("mongoose");
const { jwtDecode } = require("jwt-decode");

router.get("/money", (req, res) => {
  res.send("This is Money page ! ");
});

router.post("/withDrawl/:token", async (req, res) => {
  const token = req.params.token;
  const userId = await jwtDecode(token).id;
});

router.post("/Deposite/:token", async (req, res) => {
  console.log("Addmoney Route >>>>>>>>>>>>>>>>>>>>> ");
  const { amount, selectedMethod, image, esewaNumber, date } = req.body;
  const token = req.params.token;
  const userId = await jwtDecode(token).id;
  const user = await User.findById(userId);

  const username = user.username;

  console.log(username);

  if (!amount || !selectedMethod || !token) {
    return res.status(400).json({ error: "All fields are required." });
  }

  let gameName = "";
  console.log(amount, selectedMethod, image, token);

  try {
    const decoded = jwtDecode(token);
    const senderId = decoded.id;
    console.log(senderId);

    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    gameName = user.username || "Null ";

    const addMoney = new moneyRequest({
      _id: new mongoose.Types.ObjectId(),
      senderId,
      gameName,
      amount,
      image,
      selectedMethod,
      esewaNumber,
      date,
      status: "pending",
    });

    await addMoney.save();
    res.status(200).json({
      message: "Request sent, your balance will be updated within an hour!",
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
