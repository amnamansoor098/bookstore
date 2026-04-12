var express = require("express");
var router = express.Router();
let bookModel = require("../db/book");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/add-book", async function (req, res, next) {
  try {
    const { title, category, description, price } = req.body;

    await bookModel.create({
      title,
      category,
      description,
      price,
    });

    res.status(200).json({ msg: "Book added successfully" });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ msg: "Error adding book", error: error.message });
  }
});

router.get("/get-books", async function (req, res, next) {
  try {
    const books = await bookModel.find();

    if (books.length < 1) {
      res.status(404).json({ msg: "No books found" });
    } else {
      res.status(200).json(books);
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ msg: "Error fetching books", error: error.message });
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    const book = await bookModel.findById(id);

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    await bookModel.findByIdAndDelete(id);
    const books = await bookModel.find();
    res.status(200).json({ books, msg: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ msg: "Error deleting book", error: error.message });
  }
});

module.exports = router;
