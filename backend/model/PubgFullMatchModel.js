const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    playermode: {
      type: String,
    },
    TotalPlayer: {
      type: Number,
      default: 0,
    },
    gameName:[{
    userid:{
      type:String
    },
    player1:{
      type:String
    },
    player2:{
      type:String
    },
    player3:{
      type:String
    },
    player4:{
      type:String
    },
    slot:{
      type:String
    }
  }],
    status: {
      type: String,
      enum: ["running", "pending", "completed"],
      default: "pending",
    },
    entryFee: {
      type: Number,
    },
    userid: [String],
    time:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

const PubgFull = mongoose.model("PubgFull", schema);
module.exports = PubgFull;
