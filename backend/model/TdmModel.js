const mongoose = require("mongoose");

 const schema = new mongoose.Schema({
  playermode: {
    type: String,
  },
  TotalPlayer: {
    type: Number,
  },
  Time: {
    type: String,
  },
  entryFee: {
    type: String,
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
    userid: [String],
createdAt: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 1000) }
});
const tdm =mongoose.model('tdm',schema)
module.exports = tdm
