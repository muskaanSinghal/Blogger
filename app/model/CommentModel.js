const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
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
    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
    replies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { virtuals: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

Schema.virtual("canModify").get(function () {});

const Comment = mongoose.model("Comment", Schema);

module.exports = Comment;
