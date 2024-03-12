const express = require("express");
const controller = require("../controllers");
const routes = express.Router();
//get doc theo theo name
routes.route("/").get(controller.getProductByName);
routes.route("/new").post(controller.addQuote);
routes.route("/search").post(controller.searchDocs);

module.exports = routes;
