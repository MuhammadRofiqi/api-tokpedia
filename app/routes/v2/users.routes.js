const routes = require("express").Router();

// controller
const controller = require("../../controllers/users.controller");

// route GET
routes.get("/info", controller.getDetail);

// route PATCH
routes.patch("/avatar", controller.changeAvatar);

module.exports = routes;