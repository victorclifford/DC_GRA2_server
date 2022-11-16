const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const errorHandler = require("./middlewares/error");
const { authorizeAdmin } = require("./middlewares/authorizations");

const app = express();
const http = require("http");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ErrorResponse = require("./utils/errorResponse");
const PORT = process.env.PORT || 5000;

const origin = ["https://dcgra2.com", "http://localhost:3000"];

//middlewares
app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//custom routes
app.get("/api", authorizeAdmin, (req, res, next) => {
  try {
    // if (!req.user.isAdmin) {
    //   return next(
    //     new ErrorResponse("Only admins can perform this Operation!", 401)
    //   );
    // }
    res.status(200).send("protected route");
  } catch (error) {
    return next(new ErrorResponse("Unaothorized!!", 401));
  }
});
//----error handler middleware---------
app.use(errorHandler);

//db connection func...
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

//server functions
const server = http.createServer(app);
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`server started on port ${PORT}...`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
startServer();
