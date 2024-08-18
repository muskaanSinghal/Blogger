const catchAsync = require("./catchAsync");
const Blog = require("./../model/BlogModel");
const BlogLike = require("./../model/BlogLikeModel");
const ApiFeatures = require("./../utils/ApiFeatures");
const AppError = require("./../utils/AppError");

exports.getBlogs = catchAsync(async (req, res, next) => {
  const {
    title_contains,
    page = 1,
    limit = 2,
    select,
    sort,
    ...query
  } = req.query;
  //   tags filter

  let queryObj = Blog.find(query);

  const features = new ApiFeatures(queryObj, query)
    .contains("title", title_contains)
    .sort(sort);

  const count = await features.getCount(Blog);

  const filterObj = features.paginate(page, limit, count);

  const blogs = await filterObj.query;

  res.json({
    status: "success",
    data: {
      count,
      next: filterObj.next,
      previous: filterObj.previous,
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  // check if user is logged in
  let like = 0;
  if (req?.user?._id) {
    const blogLike = await BlogLike.findOne({ user: req.user._id, blog });
    if (blogLike) {
      like = blogLike.like;
    }
  }

  res
    .status(200)
    .json({ status: "success", data: { blog, liked_by_me: like } });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  const author = req.user._id;
  const blog = await Blog.create({ ...req.body, author });
  res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  // need to create separate api for status and published on
  const { author, published_at, status, ...payload } = req.body;
  const blog = await Blog.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: false,
  });
  res.status(200).json({
    status: "success",
    data: { blog },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).json({});
});

exports.publishBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { status: "published", published_at: Date.now() },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

//current logged in user is the author of blog or not
exports.checkAuthor = catchAsync(async (req, res, next) => {
  const currentBlog = await Blog.findById(req.params.id);
  if (!currentBlog) {
    next(new AppError("Blog with this Id does not exist.", 404));
    return;
  }

  const blogUser = currentBlog.author;

  // check logged in user is same as blog author
  if (req.user._id.toString() !== blogUser.toString()) {
    next(
      new AppError("You are not authorized for executing this action.", 403)
    );
    return;
  }

  next();
});

exports.reviewBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { like } = req.body;

  const blog = await Blog.findById(blogId);
  //checking if blog exists or not
  if (!blog) {
    next(new AppError("Blog with this id does not exist", 404));
    return;
  } else {
    // checking if author is the logged in user
    if (blog.author.toString() === req.user._id.toString()) {
      next(new AppError("You are not authorized to perform this action", 403));
      return;
    }
  }

  const result = await BlogLike.findOneAndUpdate(
    {
      user: req.user._id,
      blog: blogId,
    },
    {
      like,
    },
    {
      upsert: true,
      runValidators: true,
    }
  );
  // updating blog likes after reviewing
  blog.likes += result.like;
  await blog.save();

  res.status(200).json({
    status: "success",
    message: "Blog like status updated successfully!",
  });
});
