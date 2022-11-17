const crypto = require("crypto");
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const config = require("../utils/config");
const { sendSingleEmail } = require("../utils/sendEmail");

//signup user controller func
const signupUser = async (req, res, next) => {
  const { fullName, phoneNumber, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new ErrorResponse("this email is already in use!", 400));
    }
    const user = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
    });
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//----------------LOGIN USER ----------------
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("please provide an EMAIL and PASSWORD!", 400)
    );
  }
  try {
    //getting user by email entered for login
    const user = await User.findOne({ email }).select("+password");
    //check if any user by such email exists
    if (!user) {
      return next(new ErrorResponse("this user does not exist!", 404));
    }
    //if user exist, then match encrypted password
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("invalid EMAIL or PASSWORD!", 401));
    }
    //if passwords where matched correctly then send token and login user
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const sendToken = async (user, statusCode, res) => {
  const token = await user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};

//--------FORGOT PASSWORD ---------------------
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    //checking if email actually exists
    if (!user) {
      return next(new ErrorResponse("Unable to send email!", 404));
    }
    const resetToken = await user.getResetToken();

    await user.save();

    //create reset link
    const resetURL = `${config.HOMEPAGE}/${resetToken}`;
    const message = `
    <h1>You have requested a password reset</h1>
    <p>Click on the link to reset your password</p>
    <a href=${resetURL} clicktracking=off>click here to reset your password</a> <p>${resetURL}</p>
  `;
    try {
      sendSingleEmail({
        to: user.email,
        // to: "victorgiadom29@gmail.com",
        subject: "password reset request",
        text: message,
      });

      res
        .status(200)
        .json({ success: true, data: "Email sent! Please check your inbox" });
    } catch (error) {
      user.resetPasswordExpiration = undefined;
      user.resetPasswordToken = undefined;
      // console.log("email sent is:", message);
      await user.save();

      // return next(new ErrorResponse("failed to send email!", 500));
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//--------------------reset password --------------
const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("invalid Reset Token!", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    await user.save();
    return res.status(201).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
