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
          type: String || null,
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
          default: null,
        },
        reportImage:{
          type:String,
        },
        reportMessage:{
          type:String,
        }
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
    opponentName:{
      type:String
    },
    status:{
      type: String ,
      enum: ["running", "pending","completed","conflict"],
      default: "pending",
    },
    TotalPlayers:{
      type:Number,
      default:0
    },
   createdAt: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 1000) },
   createdAtid:{type:Date},
   resultAt:{type:Date},
   hostProof:{
    type:String
   },
userProof:{
    type:String
   }
  },
);

const ClashSquad = mongoose.model("ClashSquad", schema);
module.exports = ClashSquad;
