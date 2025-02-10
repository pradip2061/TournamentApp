const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    matchDetails: [
      {
        player: {
          type: String,
          required: true,
        },
        ammo: {
          type: String,
          required: true,
        },
        headshot: {
          type: String,
          required: true,
        },
        skill: {
          type: String,
          required: true,
        },
        round: {
          type: String,
          required: true,
        },
        match:{
         type:String,
         required:true
        },
        coin: {
          type: String,
          required: true,
        },
        gameName: {
          type: String,
          required: true,
        },
        betAmount: {
          type: String,
          required: true,
        },
      },
    ],
    teamHost: [
      {
        userid: { type: String },
        teamHostStatus: {
          type: Boolean,
          enum: [true, false],
          default: false,
        },
      },
    ],
    teamopponent: [
      {
       userid: { type: String },
      team2Status: {
         type: Boolean,
         enum: [true, false],
         default: false,
       }}
    ],
    status: {
      type: String,
      enum: ["running", "pending","completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ClashSquad = mongoose.model("ClashSquad", schema);
module.exports = ClashSquad;
