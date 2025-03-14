const express = require("express");
const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    trophy: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    uid: [
      {
        freefire: {
          type: String,
        },
        pubg: {
          type: String,
        },
        cod: {
          type: String,
        },
      },
    ],
    gameName: [
      {
        freefire: {
          type: String,
        },
        pubg: {
          type: String,
        },
        cod: {
          type: String,
        },
      },
    ],
    isplaying: {
      type: Boolean,
      default: false,
    },
    matchId: {
      pubgFullId: [String],
      pubgTdmId: [String],
      FreefireFullId: [String],
      FreefireClashId: [String],
      codId: [String],
    },
    victory: {
      pubg: [String],
      Freefire: [String],
      cod: [String],
    },
    Loss: {
      pubg: [String],
      Freefire: [String],
      cod: [String],
    },
    balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    friends: [],
    accountHistory:[{}],
    notification:[],
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema({
  roomId: String,
  senderID: String,
  message: String,
  type: String,
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
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  image: { type: String },
  selectedMethod: { type: String, required: true },
  Number: { type: String },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const withdraw_schema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  image: { type: String },
  selectedMethod: { type: String, required: true },
  Number: { type: String },
  date: { type: Date, default: Date.now },
  message: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const moneyRequest = mongoose.model("money_request", money_requestSchema);
const Tournament = mongoose.model("Tournament", tournamentSchema);
const withdraw = mongoose.model("withdraw", withdraw_schema);
module.exports = {
  User: User,
  Chat: Chat,
  Tournament: Tournament,
  moneyRequest: moneyRequest,
  withdraw: withdraw,
};