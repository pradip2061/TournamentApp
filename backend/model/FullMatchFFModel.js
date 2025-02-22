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
    gameName: [[String]],
    status: {
      type: String,
      enum: ["running", "pending", "completed"],
      default: "pending",
    },
    entryFee: {
      type: Number,
    },
    userid: [String],
  },
  {
    timestamps: true,
  }
);

const FFfreefire = mongoose.model("FFfreefire", schema);
module.exports = FFfreefire;
