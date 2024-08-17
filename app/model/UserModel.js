const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name."],
  },
  email: {
    type: String,
    required: [true, "A user must have an email."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    validate: {
      validator: function (value) {
        return value.length >= 7;
      },
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password is required."],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
    },
  },
  role: {
    type: String,
    enum: {
      values: ["author", "user", "admin"],
      message: "User role is not correct",
    },
    default: "user",
  },
  passwordChangedAt: Date,
});

Schema.pre("save", async function () {
  //encrypt password and save to database
  const password = await bcrypt.hash(this.password, 12);

  this.password = password;
  //make password confirm field undefined
  this.passwordConfirm = undefined;
});

Schema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", Schema);

module.exports = User;
