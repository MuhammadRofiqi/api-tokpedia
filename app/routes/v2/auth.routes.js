const routes = require("express").Router();

// controllers
const controller = require("../../controllers/auth.controller");

// Route POST
routes.post("/register", controller.register);
routes.post("/login", controller.login);
routes.post("/forgot-password", controller.forgotPassword);
routes.post("/otp/:otp/verify", controller.verifyOtp);
routes.post("/:otp/change-password", controller.changePassword);

module.exports = routes;