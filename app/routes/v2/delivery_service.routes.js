const routes     = require("express").Router();

// controller
const controller = require("../../controllers/delivery_service.controller");

// Route GET
routes.get("/:store_id", controller.getAll);
routes.get("/detail/:id", controller.getDetail);

// Route POST
routes.post("/:store_id", controller.create);

// Route PUT
routes.put("/:id", controller.update);

// Route DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;