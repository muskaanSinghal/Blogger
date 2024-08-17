const User = require("./../model/UserModel");
const catchAsync = require("./catchAsync");
const AppError = require("./../utils/AppError");

const jwt = require("jsonwebtoken");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// SIGN UP
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const payload = { name, email, password, passwordConfirm };
  const user = await User.create(payload);
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    data: { token },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Error and password are required.", 401));
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next(new AppError("User with this emailid doest exist.", 400));
    return;
  }

  const isPasswordCorrect = await user.comparePasswords(password);
  //true generate token
  if (isPasswordCorrect) {
    const token = signToken(user.id);
    res.status(200).json({
      status: "success",
      data: { token },
    });
  } else {
    next(new AppError("Invalid email or password", 400));
    return;
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.replace("Bearer ", "");
  } else {
    next(new AppError("Provided credentials are not valid.", 400));
    return;
  }

  // token is from our server or not
  const response = verifyToken(token);

  const { id, iat } = response;

  // user exists or not
  const currentUser = await User.findById(id).select("+password");

  if (!currentUser) {
    next(new AppError("User does not exist", 404));
    return;
  }

  // password of user has not changed since token generation
  if (currentUser.passwordChangedAt && currentUser.passwordChangedAt < iat) {
    next(new AppError("Invalid credentials", 400));
    return;
  }

  req.user = currentUser;
  next();
});
