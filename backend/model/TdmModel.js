const mongoose = require("mongoose");

 const schema = new mongoose.Schema({
  playermode: {
    type: String,
  },
  entryFee: {
    type: String,
  },
gameName:{
    type:String
   },
    teamHost: [
      {
        userid: { type: String },
        teamHostStatus: {
          type: Boolean,
          default: null,
        },
      },
    ],
    teamopponent: [
      {
       userid: { type: String },
      team2Status: {
         type: Boolean,
         default:null,
       }}
    ],
    customId:{
      type:Number || null
    },
    customPassword:{
      type:Number || null
    },
    status:{
      type: String ,
      enum: ["running", "pending","completed"],
      default: "pending",
    },
   createdAt: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 1000) },
   hostProof:{
    type:String
   },
userProof:{
    type:String
   },
   TotalPlayers:{
      type:Number,
      default:0
    }
});
const tdm =mongoose.model('tdm',schema)
module.exports = tdm







