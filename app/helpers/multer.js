const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

module.exports = destination => {
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      if (!fs.existsSync(path.join(__dirname, "../../public/avatar"))) {
        fs.mkdirSync(path.join(__dirname, "../../public/avatar"));
      }
      if (!fs.existsSync(path.join(__dirname, "../../public/store"))) {
        fs.mkdirSync(path.join(__dirname, "../../public/store"));
      }

      if (destination == "user") {
        cb(null, path.join(__dirname, "../../public/avatar"));
      } else if (destination == "store") {
        cb(null, path.join(__dirname, "../../public/store"));
      } 
    },
    filename: function(req, file, cb) {
      if (destination == "user") {
        cb(null, "user-".concat(Date.now().toString(), ".", file.mimetype.split("/")[1]));
      } else  if (destination == "store") {
        cb(null, "store-".concat(Date.now().toString(), ".", file.mimetype.split("/")[1]));
      } 
    }
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: "2MB"
    },
    fileFilter: function(req, file, cb) {
      const mimetype = file.mimetype.split("/")[1];
      if (mimetype == "png" || mimetype == "jpg" || mimetype == "jpeg") {
        cb(null, true);
      } else {
        cb("file is not supported", false);
      }
    }
  });

  return upload;
}