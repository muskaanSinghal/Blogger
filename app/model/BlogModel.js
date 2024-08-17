const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: { type: Date, default: Date.now() },
  published_at: Date,
  description: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["draft", "published"],
    },
    default: "draft",
  },
  // tags
  // likes
  // comments
  // followers
  // shortlist
});

const Blog = mongoose.model("Blog", Schema);

module.exports = Blog;
