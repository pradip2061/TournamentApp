const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
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
    gameName:[
      {
        freefire:{
          type:String
        },
        pubg:{
          type:String
        },
        cod:{
          type:String
        }
      }
    ],
    isplaying: {
      type: Boolean,
      default: false,
    },
    matchId:[String],
    victory: {
      pubg: [String],
      Freefire: [String],
      cod: [String],
    },
    Loss:
      {
        pubg: [String],
      Freefire: [String],
      cod: [String],
      },
    balance: {
      type: Number,
      default: 0,
    },
    role:{
      type:String,
      enum:['user','admin'],
      default:'user'
    }
  },
  { timestamps: true }
);

const signUp = mongoose.model("signUp", schema);
module.exports = signUp;
