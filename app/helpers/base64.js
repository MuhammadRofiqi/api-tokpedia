const base64 = require("base64-img");
const path   = require("path");
const fs     = require("fs");

module.exports = (destination, file) => {
  if (destination == "product") {
    if (!fs.existsSync(path.join(__dirname, "../../public/product"))) {
      fs.mkdirSync(path.join(__dirname, "../../public/product"));
    }

    const filename = "product".concat(Date.now().toString());    
    const image    = base64.imgSync(file, path.join(__dirname, "../../public/product"), filename);

    return { filename, image }
  }
}