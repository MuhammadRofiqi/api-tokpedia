const routes = require("express").Router();

// get version routes
routes.use("/v2", require("./v2/index.routes"));

module.exports = routes;