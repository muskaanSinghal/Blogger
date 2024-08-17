const express = require("express");
const tagController = require("./../controllers/tagController");

const Router = express.Router();

Router.route("/").get(tagController.getAllTags).post(tagController.createTag);

module.exports = Router;
