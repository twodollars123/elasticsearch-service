const express = require("express");
const controller = require("../controllers");
const routes = express.Router();

routes.route("/").get(controller.getProductByName);
routes.route("/new").post(controller.addQuote);

module.exports = routes;
