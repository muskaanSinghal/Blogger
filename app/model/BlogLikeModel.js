const mongoose = require("mongoose");
const Blog = require("./../model/BlogModel");

const Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: true,
  },
  //1 for like,  0 for not reacted
  like: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
});

const BlogLike = mongoose.model("BlogLike", Schema);

module.exports = BlogLike;
