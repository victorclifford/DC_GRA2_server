const express = require("express");
const {
  signupUser,
  loginUser,
  forgotPassword,
} = require("../controllers/authController");
// const { authorizeUser } = require("../middlewares/authorizations");

const router = express.Router();

//-----------SIGNUP------------------

router.post("/signup", signupUser);

//---------LOGIN------------

router.post("/login", loginUser);

//forgot password

router.post("/forgotpassword", forgotPassword);

module.exports = router;
