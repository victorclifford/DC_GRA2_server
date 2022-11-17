const express = require("express");
const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
// const { authorizeUser } = require("../middlewares/authorizations");

const router = express.Router();

//SIGNUP

router.post("/signup", signupUser);

//LOGIN

router.post("/login", loginUser);

//forgot password

router.post("/forgotpassword", forgotPassword);

//reset password
router.put("/resetpassword/:resettoken", resetPassword);
module.exports = router;
