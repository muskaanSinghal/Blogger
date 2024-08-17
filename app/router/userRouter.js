const express = require("express");
const UserRouter = express.Router();

const controller = require("./../controllers/authController");

UserRouter.post("/sign-up", controller.signUp);
UserRouter.post("/login", controller.login);

module.exports = UserRouter;
