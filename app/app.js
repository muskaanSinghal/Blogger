const express = require("express");
const app = express();
const UserRouter = require("./router/userRouter");
const BlogRouter = require("./router/blogRouter");
const TagRouter = require("./router/tagRouter");
const errorController = require("./controllers/error");

app.use(express.json());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/blogs", BlogRouter);
app.use("/api/v1/tags", TagRouter);

app.use(errorController);
///////////////////////mws

module.exports = app;
