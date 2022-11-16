const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDay: {
    type: Number,
    required: true,
  },
  eventMonthAndYear: {
    type: String,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  eventImg: {
    type: String,
    required: true,
  },
  imgId: {
    type: String,
  },
  eventInfo: {
    type: String,
    required: true,
  },
});
// EventSchema.pre("save", function (next) {
//   if (!this.eventDay) {
//     return next(new ErrorResponse("all feilds must be filled", 400));
//   }
// });
const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
