const routes = require("express").Router();

// middlewares
const authorize = require("../../middlewares/authorize");

// list all routes v2
routes.use("/auth", require("./auth.routes"));
routes.use("/users", authorize, require("./users.routes"));
routes.use("/stores", authorize, require("./store.routes"));
routes.use("/storefront", authorize, require("./storefront.routes"));
routes.use("/delivery-services", authorize, require("./delivery_service.routes"));
routes.use("/product", authorize, require("./product.routes"));

module.exports = routes;