const express = require("express");
const tagController = require("./../controllers/tagController");
const authController = require("./../controllers/authController");

const Router = express.Router();

Router.use(authController.protect);

Router.route("/").get(tagController.getAllTags).post(tagController.createTag);
Router.route("/:id").get(tagController.getTag);

module.exports = Router;
