const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt : {
    type : String,
  },
  images : {
    type: [String], 
    required: true,
  },
createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

  module.exports = mongoose.model("History", historySchema);
