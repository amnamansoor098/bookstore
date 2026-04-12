const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: String,
  description: String,
  price: String,
  category: String,
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
