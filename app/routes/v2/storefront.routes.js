const routes     = require("express").Router();

// controller
const controller = require("../../controllers/storefront.controller");

// Route GET
routes.get("/", controller.getAll);
routes.get("/:id", controller.getDetail);

// Route POST
routes.post("/:store_id", controller.create);

// Route PUT
routes.put("/:id", controller.update);

// Route DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;