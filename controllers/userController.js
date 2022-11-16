const User = require("../models/userModel");
// const ErrorResponse = require('../utils/errorResponse')

//--------   GET ALL USERS  ---------------------

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    if (!users) {
      res.status(200).json({
        success: true,
        message: "users record is empty!",
      });
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
