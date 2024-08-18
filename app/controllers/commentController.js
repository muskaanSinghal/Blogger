const catchAsync = require("./catchAsync");
const ApiFeatures = require("./../utils/ApiFeatures");
const Comment = require("./../model/CommentModel");
const AppError = require("../utils/AppError");

exports.getComments = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { sort, page = 1, limit = 2, ...rest } = req.query;

  const commentsQuery = Comment.find({ blog: blogId });
  const features = new ApiFeatures(commentsQuery, { blog: blogId }).sort(sort);

  const count = await features.getCount(Comment);

  const query = features.paginate(page, limit, count);

  const comments = await query.query;

  res.status(200).json({
    status: "success",
    data: {
      comments,
      next: query.next,
      previous: query.previous,
      total: count,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { comment, parentComment } = req.body;
  const user = req.user._id;

  const commentDoc = await Comment.create({
    blog: blogId,
    comment,
    parentComment,
    user,
  });

  res.status(201).json({
    status: "success",
    data: { comment: commentDoc },
  });
});

exports.reply = catchAsync(async (req, res, next) => {
  const blog = req.params.id;
  const parentComment = req.params.commentId;
  const { comment } = req.body;
  const user = req.user._id;

  const reply = await Comment.create({
    user,
    blog,
    parentComment,
    comment,
  });

  res.status(201).json({
    status: "success",
    data: {
      comment: reply,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req.body;
  const commentId = req.params.commentId;

  const commentUpdated = await Comment.findByIdAndUpdate(
    commentId,
    {
      comment,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      comment: commentUpdated,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  await Comment.findByIdAndDelete(commentId);
  res.status(204).json({});
});

exports.checkAuthor = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    next(new AppError("Comment with this ID does not exist", 404));
    return;
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    next(new AppError("You are not authorized to perform this action", 403));
    return;
  }

  next();
});

exports.getReplies = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;

  const replies = await Comment.find({
    parentComment: commentId,
  });

  res.status(200).json({
    status: "success",
    data: { comments: replies },
  });
});
