const express = require("express");
const { authorizeAdmin } = require("../middlewares/authorizations");
const { getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/", authorizeAdmin, getAllUsers);

module.exports = router;
