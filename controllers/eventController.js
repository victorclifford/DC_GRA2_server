const mongoose = require("mongoose");
const Event = require("../models/eventsModel");
const EventCountDown = require("../models/countDownModel");
const { cloudinary } = require("../utils/cloudinary");
const ErrorResponse = require("../utils/errorResponse");

//--------------- GET ALL EVENTS -------------------
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({});
    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

//--------------- GET ONE EVENT -----------------------
exports.getSingleEvent = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("invalid event ID!", 400));
    }

    const singleEvent = await Event.findById({ _id: id });

    if (!singleEvent) {
      return next(new ErrorResponse("Unable to find event", 404));
    }

    res.status(200).json({ success: true, singleEvent });
  } catch (error) {
    next(error);
  }
};

//-------------- CREATE NEW EVENT ---------------------
exports.addNewEvent = async (req, res, next) => {
  const {
    eventName,
    eventDay,
    eventMonthAndYear,
    eventTime,
    eventLocation,
    eventInfo,
  } = req.body;

  try {
    if (
      !eventName ||
      !eventDay ||
      !eventMonthAndYear ||
      !eventTime ||
      !eventTime ||
      !eventLocation ||
      !eventInfo
    ) {
      return next(new ErrorResponse("all feilds must be filled", 400));
    }
    //uploading img to cloudinary
    const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
      folder: "DC-GRA",
    });
    const eventImg = uploadedImg.secure_url;
    const imgId = uploadedImg.public_id;
    //creating the new event with the extracted data

    await Event.create({
      eventName,
      eventDay,
      eventMonthAndYear,
      eventTime,
      eventLocation,
      eventInfo,
      eventImg,
      imgId,
    });

    res
      .status(201)
      .json({ success: true, message: "new event created successfully" });
  } catch (error) {
    next(error);
  }
};

//---------------------- DELETE EVENT -----------------
exports.deleteEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("invalid Event ID!", 400));
    }
    //finding event to delete..
    const eventToDel = await Event.findById({ _id: id });
    if (!eventToDel) {
      return next(new ErrorResponse("Event not found!", 404));
    }
    //deleteing event..
    await eventToDel.remove();
    //deleting img from cloudinary..
    await cloudinary.uploader.destroy(eventToDel.imgId);
    res.status(200).json({
      success: true,
      message: `${eventToDel.eventName}, deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

//---------------------- UPDATE EVENT -------------------
exports.updateEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("invalid event ID!", 400));
    }

    const eventToUpdate = await Event.findById({ _id: id });
    if (!eventToUpdate) {
      return next(new ErrorResponse("Event not Found!", 404));
    }

    //handeling update with and without file upload
    if (req.file) {
      //deleting already existing img from cloudinary
      await cloudinary.uploader.destroy(eventToUpdate.imgId);
      //uploading the new img..
      const imgUpload = await cloudinary.uploader.upload(req.file.path);
      //extracting url and public id of uploaded img..
      const eventImg = imgUpload.secure_url;
      const imgId = imgUpload.public_id;
      //updating event in db collection..
      await eventToUpdate.update({ ...req.body, eventImg, imgId });
      //success response..
      res
        .status(201)
        .json({ success: true, message: "event updated successfully" });
    } else {
      //if no file uploaded, updating any feild passed..
      await eventToUpdate.update({ ...req.body });
      //success response..
      res
        .status(201)
        .json({ success: true, message: "event updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

//?-------------------- UPCOMING EVENT TIMER ---------------------
exports.updateCountDownEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("invalid ID!", 400));
    }

    const countDownUpdt = await EventCountDown.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );

    if (!countDownUpdt) {
      return next(new ErrorResponse("error: event not found!", 404));
    }

    res.status(200).json({
      success: true,
      message: "event countdown update successfull",
      countDownUpdt,
    });
  } catch (error) {
    next(error);
  }
};
// exports.createCountdownEvent = async (req, res, next) => {
//   const { countDownDate, countDownTime, display } = req.body;

//   try {
//     const newEventCountDown = await EventCountDown.create({
//       countDownDate,
//       countDownTime,
//       display,
//     });

//     res
//       .status(201)
//       .json({
//         success: true,
//         message: "new Event countdown created",
//         newEventCountDown,
//       });
//   } catch (error) {
//     next(error);
//   }
// };
