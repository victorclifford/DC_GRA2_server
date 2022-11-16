const express = require("express");
const upload = require("../utils/multer");
const {
  getEvents,
  addNewEvent,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  updateCountDownEvent,
  createCountdownEvent,
} = require("../controllers/eventController");

const router = express.Router();

//----------------CREATE NEW EVENT ROUTE -----------------
router.post("/", upload.single("eventImg"), addNewEvent);

//--------------- GET ALL EVENTS ROUTES -------------------
router.get("/", getEvents);

//--------------- GET SINGLE EVENT ROUTE ----------------
router.get("/:id", getSingleEvent);

//--------------- UPDATE EVENT ROUTE ----------------
router.patch("/:id", upload.single("eventImg"), updateEvent);

//--------------- DELETE EVENT ROUTE ----------------
router.delete("/:id", deleteEvent);

//????????????????????????? COUNT DOWN ?????????????????????
router.patch("/eventcountdown/:id", updateCountDownEvent);

//router.post("/eventcountdown", createCountdownEvent);

module.exports = router;
