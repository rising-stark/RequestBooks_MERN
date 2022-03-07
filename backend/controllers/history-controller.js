const BookHistory = require("../model/BookHistory");

const getBookHistory = async (req, res, next) => {
  let books;
  console.log("printing here\n\n");
  console.log(req.cookies);
  try {
    books = await BookHistory.find({bookid: req.params.id});
  } catch (err) {
    console.log(err);
  }
  if (!books) {
    return res.status(404).send("No book history found");
  }
  console.log(books)
  return res.status(200).json({ "books": books });
};

exports.getBookHistory = getBookHistory;
