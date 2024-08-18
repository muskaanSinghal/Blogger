const mongoose = require("mongoose");
const Blog = require("./BlogModel");

const Schema = new mongoose.Schema({
  // name
  name: {
    type: String,
    unique: true,
    required: true,
  },
  // how many blogs have been tagged with this tag
  // tagged_blogs: {
  //   type: Number,
  //   default: 0,
  // },
  // followers
});

Schema.methods.getTaggedBlogs = async function () {
  const tagId = this._id;
  const taggedblogs = await Blog.countDocuments({
    // tags: { $elemMatch: { $eq: tagId } },
    tags: tagId,
  });
  return taggedblogs;
};

const Tag = mongoose.model("Tag", Schema);

module.exports = Tag;
