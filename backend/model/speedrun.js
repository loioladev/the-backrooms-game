const mongoose = require("mongoose");

const speedrunSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true,
  },

  time: {
    type: Number,
    required: true,
  },

  map: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Speedrun", speedrunSchema);
