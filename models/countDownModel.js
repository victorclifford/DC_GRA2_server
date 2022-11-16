const mongoose = require("mongoose");

const EventCountDownSchema = new mongoose.Schema({
  countDownDate: {
    type: String,
  },
  countDownTime: {
    type: String,
  },
  display: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("EventCountdown", EventCountDownSchema);
