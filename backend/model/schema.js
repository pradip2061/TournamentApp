const express = require("express");
const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  id: String,
  gameName: String,
  balance: Number,
  email: String,
  password: String,
  trpohy: Number,
  Victory: [],
  Loss: [],
  notification: [],
});

const ChatSchema = new mongoose.Schema({
  roomId: String,
  senderID: String,
  message: String,
  time: { type: Date, default: Date.now() },
});
const User = new mongoose.model("user", Userschema);
const Chat = new mongoose.model("chat", ChatSchema);

const gamerSchema = new mongoose.Schema({
  id: Number,
  username: String,
});

const tournamentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  users: [gamerSchema],
});

const money_requestSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: String,
  gameName: String,
  amount: Number,
  remark: String,
  status: String,
});

const moneyRequest = mongoose.model("money_request", money_requestSchema);

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = {
  User: User,
  Chat: Chat,
  Tournament: Tournament,
  moneyRequest: moneyRequest,
};
