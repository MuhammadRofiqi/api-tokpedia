const routes = require("express").Router();
const controller = require("../../controllers/product.controller");

routes.post("/:store_id", controller.create);

module.exports = routes;