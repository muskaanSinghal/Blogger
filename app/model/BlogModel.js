const mongoose = require("mongoose");

const TagSchema = {
  type: mongoose.Schema.ObjectId,
  ref: "Tag",
  unique: true,
};

const tagValidator = [
  {
    validator: function (tags) {
      return tags.length <= 5;
    },
    message: "A blog can have atmax 5 tags.",
  },
  {
    validator: function (tags) {
      const idStrings = tags.map((tag) => tag.toString());
      const set = [...new Set(idStrings)];
      return tags.length === set.length;
    },
    message: "tags must be unique.",
  },
];

const Schema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
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
  tags: {
    type: [TagSchema],
    validate: tagValidator,
  },
  // likes
  likes: {
    type: Number,
    default: 0,
  },
  // comments
  // followers
  // shortlist
});

const Blog = mongoose.model("Blog", Schema);

module.exports = Blog;
