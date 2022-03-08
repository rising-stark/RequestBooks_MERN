const BookHistory = require("../model/BookHistory");

const getBookHistory = async (req, res, next) => {
  let books;
  try {
    books = await BookHistory.find({bookid: req.params.id});
  } catch (err) {
    console.log(err);
    return res.status(400).send("No book history found");
  }
  console.log(books)
  return res.status(200).json({ "books": books });
};

exports.getBookHistory = getBookHistory;
