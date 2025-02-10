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
    teamHost:[{
gameName:String,
userid:String
}],
teamopponent:[{
gameName:String,
userid:String
}],
    teamHost: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    team2: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ClashSquad = mongoose.model("ClashSquad", schema);
module.exports = ClashSquad;
