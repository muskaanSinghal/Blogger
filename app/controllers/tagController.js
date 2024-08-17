const Tag = require("./../model/TagModel");
const catchAsync = require("./catchAsync");
const ApiFeatures = require("./../utils/ApiFeatures");

exports.createTag = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const tag = await Tag.create({ name });
  res.status(201).json({
    status: "success",
    data: { tag },
  });
});

exports.getAllTags = catchAsync(async (req, res, next) => {
  const { page, limit, sort, name_contains, ...params } = req.query;
  const query = Tag.find(params);
  const features = new ApiFeatures(query, params)
    .contains("name", name_contains)
    .sort(sort);

  const count = await features.getCount(Tag);

  const filterObj = features.paginate(page, limit, count);

  const tags = await filterObj.query;

  res.json({
    status: "success",
    data: {
      count,
      next: filterObj.next,
      previous: filterObj.previous,
      tags,
    },
  });
});

exports.getTag = catchAsync(async (req, res, next) => {
  const tagId = req.params.id;
  const tag = await Tag.findById(tagId);
  const blogCount = await tag.getTaggedBlogs();
  res.json({
    status: "success",
    data: {
      tag,
      tagged_blogs: blogCount,
    },
  });
});
