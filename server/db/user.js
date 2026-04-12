const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  books: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "book",
    },
  ],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
