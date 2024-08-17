const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  // name
  name: {
    type: String,
    unique: true,
    required: true,
  },
  // how many blogs have been tagged with this tag
  tagged_blogs: {
    type: Number,
    default:0
  },
  // followers
});

const Tag = mongoose.model("Tag", Schema);

module.exports = Tag;
