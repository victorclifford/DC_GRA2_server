const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: 2 * (1024 * 1024),
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("unsupported file format/type!!"), false);
    }
  },
});

module.exports = upload;
