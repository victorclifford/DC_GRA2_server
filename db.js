// import mongoose from "mongoose";
const mongoose = require("mongoose");
// import config from "./utils/config";
const config = require("./utils/config");

const connectDB = async () => {
  try {
    const db = await mongoose.connect(config.MONGO_URI);
    console.log(`mongodb connected to ${db.connection.host}...`);
    return db;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
// module.exports = connectDB;
