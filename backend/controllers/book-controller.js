const Book = require("../model/Book");
const BookHistory = require("../model/BookHistory");

const getAllBookRequests = async (req, res, next) => {
  let books;
  usertype = req.cookies.usertype;
  console.log("printing here\n\n");
  console.log(req.cookies);
  try {
    if(usertype == "user")
      books = await Book.find({requestedby: req.cookies.username});
    else
      books = await Book.find();
  } catch (err) {
    console.log(err);
    return res.status(404).send("No book requests found");
  }
  console.log(books)
  return res.status(200).json({ "books": books });
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(404).send("No book by this id found");
  }
  return res.status(200).json({ book });
};

const requestBook = async (req, res, next) => {
  const { name, author, description, price } = req.body;
  let book, bookhistory;
  try {
    book = new Book({
      name,
      author,
      description,
      price,
      bookstate: 0,
      requestedby: req.cookies.username,
      requestedat: new Date(),
      handledby: "",
    });
    await book.save();
  } catch (err) {
    console.log(err);
    return res.status(404).send("Unable to add a book request");
  }
  try {
    bookhistory = new BookHistory({
      bookid: book.id,
      username: req.cookies.username,
      action: "New book request created"
    });
    await bookhistory.save();
  } catch (err) {
    console.log(err);
    return res.status(404).send("Unable to insert book history");
  }
  return res.status(200).json({ book });
};

const updateBook = async (req, res, next) => {
  const id = req.params.id;
  const { name, author, description, price, available, image } = req.body;
  let book;
  try {
    book = await Book.findByIdAndUpdate(id, {
      name,
      author,
      description,
      price,
      available,
      image,
    });
    book = await book.save();
  } catch (err) {
    console.log(err);
  }
  if (!book) {
    res.status(404).send("Unable To Update By this ID");
  }
  return res.status(200).json({ book });
};

const deleteBook = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
  if (!book) {
    res.status(404).send("Unable To Delete By this ID");
  }
  res.status(200).send("Product Successfully Deleted");
};

exports.getAllBookRequests = getAllBookRequests;
exports.requestBook = requestBook;
exports.getById = getById;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
