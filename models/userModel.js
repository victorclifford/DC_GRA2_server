const config = require("../utils/config");
const mongoose = require("mongoose");
const validator = require("validator");
const validatePhoneNumber = require("validate-phone-number-node-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "please provide a valid phone number!"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiration: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //name validation
  if (!this.fullName) {
    throw Error("please provide your full name!");
  }

  if (this.fullName.length <= 5) {
    throw Error("your fullname cannot be less than (6)characters!");
  }

  //email validation
  if (!validator.isEmail(this.email, { domain_specific_validation: true })) {
    throw Error("please provide a valid email!");
  }

  //phone number validation
  if (!validatePhoneNumber.validate(this.phoneNumber)) {
    throw Error("please provide a valid phone number!");
  }

  //password validation
  if (!this.password) {
    throw Error("password field cannot be empty!");
  }

  if (this.password.length <= 5) {
    throw Error("your password must be at least (6)characters long!");
  }
  //using regex to make sure password contains uppercase,lowercase and number
  const uppercase = (str) => {
    if (/\d/.test(str) && /[a-z]/.test(str) && /[A-Z]/.test(str)) {
      return true;
    } else {
      return false;
    }
  };
  if (!uppercase(this.password)) {
    throw Error(
      "password must contain one uppercase, lowercase and one number"
    );
  }

  // generate salt, and hash password with generated salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = async function () {
  return jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
};
//method to generate the reset password token
userSchema.methods.getResetPassword = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //now hashing the generated token and save to the user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //setting the token expiry
  this.resetPasswordExpiration = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
