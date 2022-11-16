const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");

//*-------------  USER ONLY AUTHORIZATION  ---------------
exports.authorizeUser = async (req, res, next) => {
  let token;
  try {
    //checking headers for jwt token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // disallowing access if no token

    if (!token) {
      return next(new ErrorResponse("Unauthorized!!", 401));
    }
  } catch (error) {
    next(error);
  }

  //if token is present , verify token
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    //find user by the id gotten from the decoded token
    const user = await User.findById(decoded.id);
    //if no user is found by the id on the decoded token, then token is invalid
    if (!user) {
      return next(new ErrorResponse("invalid auth token!", 404));
    }
    //if user was found, then add new authorized user to the req.user
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized!!", 401));
  }
};
//*----------------------------------------------------------//

//?-------------  ADMIN ONLY AUTHORIZATION  ---------------//

exports.authorizeAdmin = async (req, res, next) => {
  let token;
  try {
    //checking headers for jwt token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // disallowing access if no token

    if (!token) {
      return next(new ErrorResponse("Unauthorized!!", 401));
    }
  } catch (error) {
    next(error);
  }

  //if token is present , verify token
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    //find user by the id gotten from the decoded token
    const user = await User.findById(decoded.id);
    //if no user is found by the id on the decoded token, then token is invalid
    if (!user) {
      return next(new ErrorResponse("invalid auth token!", 404));
    }
    //check if user is an Admin

    if (!user.isAdmin) {
      return next(
        new ErrorResponse("Only admins can perform this Operation!", 401)
      );
    }

    //if user was found, and is admin, then add new authorized user to the req.user
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized!!", 401));
  }
};
