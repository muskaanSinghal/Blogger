const express = require("express");
const blogController = require("./../controllers/blogController");
const authController = require("./../controllers/authController");
const commentRouter = require("./commentRouter");

const Router = express.Router();

Router.use("/:id/comments", commentRouter);

Router.get("/", blogController.getBlogs);
Router.get("/:id", blogController.getBlog);

//open for all logged in users

Router.route("/").post(authController.protect, blogController.createBlog);
Router.post("/:id/like", authController.protect, blogController.reviewBlog);

//   valid for only logged in user and author
Router.use("/:id", authController.protect, blogController.checkAuthor);

Router.route("/:id")
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

Router.post("/:id/publish-blog", blogController.publishBlog);

module.exports = Router;
