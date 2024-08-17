const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const app = require("./app");

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  "<PASSWORD>",
  process.env.PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to the database...");
  })
  .catch((err) => {
    console.error(err, err.stack);
  });

app.listen(process.env.PORT, "127.0.0.1");
