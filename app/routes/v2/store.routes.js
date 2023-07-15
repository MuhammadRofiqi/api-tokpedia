const routes = require("express").Router();
const controller = require("../../controllers/store.controller");

routes.get("/", controller.getAll);
routes.post("/", controller.create);
routes.patch("/avatar", controller.changeAvatar)
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);

module.exports = routes;