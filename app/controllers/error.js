const errorController = (err, req, res, next) => {
  console.log(err.message, err.stack, "from error controller");
  const { statusCode = 500, message, status = "error" } = err;
  res.status(statusCode).json({
    status,
    message,
  });
  //   res.send("Error from the server");
};

module.exports = errorController;
