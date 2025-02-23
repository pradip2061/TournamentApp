const express = require("express");
const { moneyRequest, User } = require("../modules/schema");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/money", (req, res) => {
  res.send("HThis is Money page ! ");
});

router.post("/Addmoney", async (req, res) => {
  const { amount, remark, image, senderId } = req.body;
  let gameName = "";
  console.log(amount, remark, image);
  res.send("Request sent ,your balance will be upated within a hour !");
  console.log(senderId);
  try {
    const response = await User.findById(senderId).select("gameName");
    console.log("gameName:", response.gameName);
    gameName = response.gameName;
  } catch (err) {
    console.log(err);
  }
  const addmoney = await moneyRequest({
    _id: new mongoose.Types.ObjectId(),
    senderId: senderId,
    gameName: gameName,
    amount: amount,
    remark: remark,
    image: image,
  });
  try {
    addmoney.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
