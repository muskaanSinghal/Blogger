const express = require("express");
const commentController = require("./../controllers/commentController");
const authController = require("./../controllers/authController");

const Router = express.Router({ mergeParams: true });

Router.route("/").get(commentController.getComments);
Router.route("/:commentId").get(commentController.getReplies);

Router.use(authController.protect);

Router.route("/").post(commentController.createComment);
Router.route("/:commentId/reply").post(commentController.reply);

Router.use("/:commentId", commentController.checkAuthor);

Router.route("/:commentId")
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = Router;
