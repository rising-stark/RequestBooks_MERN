const Book = require("../models/Book");
const BookHistory = require("../models/BookHistory");

const insertBookHistory = async (username, book) =>{
  try {
    bookhistory = new BookHistory({
      bookid: book._id,
      username: username,
      bookstate: book.bookstate
    });
    await bookhistory.save();
    return 1;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

const getAllBookRequests = async (req, res, next) => {
  let books;
  if(!req.cookies)return res.status(400).send("No book requests found");
  usertype = req.cookies.usertype;
  try {
    if(usertype == "user")
      books = await Book.find({requestedby: req.cookies.username});
    else
      books = await Book.find();
  } catch (err) {
    console.log(err);
    return res.status(400).send("No book requests found");
  }
  // console.log(books)
  return res.status(200).json({ books });
};

const getBookById = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findById(id);
    if(req.cookies.usertype === "user" && book.requestedby !== req.cookies.username)
      return res.status(400).json({});
  } catch (err) {
    console.log(err);
    return res.status(400).json({});
  }
  return res.status(200).json({ book });
};

const requestBook = async (req, res, next) => {
  const { name, author, description, price } = req.body;
  let book;
  try {
    book = await Book.create({
      name,
      author,
      description,
      price,
      bookstate: "New book requested",
      requestedby: req.cookies.username,
      handledby: "",
    });
    const bookhistory = await insertBookHistory(req.cookies.username, book)
    if(bookhistory == 0)
      return res.status(400).send("Unable to insert book history");
    return res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unable to add a book request");
  }
};

const updateBook = async (req, res, next) => {
  const id = req.params.id;
  const { name, author, description, price } = req.body;
  let book;
  try {
    book = await Book.findByIdAndUpdate(id, {
      name,
      author,
      description,
      price,
      bookstate_int: 3,
      bookstate: "Updated book info from "+JSON.stringify(book) + " to " + JSON.stringify(req.body),
    }, {new: true});
    const bookhistory = await insertBookHistory(req.cookies.username, book)
    if(bookhistory == 0)
      return res.status(400).send("Unable to insert book history");
    return res.status(200).json({ book, message: "Book successfully updated" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Unable to find the book by this id" });
  }
};

const updateBookStatus = async (req, res, next) => {
  const id = req.params.id;
  const { bookstate, bookstate_int } = req.body;
  let book;
  try {
    book = await Book.findByIdAndUpdate(id, {
      bookstate,
      bookstate_int
    }, {new: true});
    book = await book.save();
    const bookhistory = await insertBookHistory(req.cookies.username, book)
    if(bookhistory == 0)
      return res.status(400).send("Unable to insert book history");
    return res.status(200).send("Book status updated");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unable To Update book status by this ID");
  }
};

const updateBookHandledBy = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findByIdAndUpdate(id, {
      bookstate_int: 1,
      bookstate: "Book assigned to "+req.cookies.username,
      handledby: req.cookies.username
    }, {new: true});
    const bookhistory = await insertBookHistory(req.cookies.username, book)
    if(bookhistory == 0)
      return res.status(400).send("Unable to insert book history");
    return res.status(200).send("Book assigned to "+req.cookies.username+" successfully.");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Server error. Unable To update book");
  }
};

exports.getAllBookRequests = getAllBookRequests;
exports.requestBook = requestBook;
exports.getBookById = getBookById;
exports.updateBook = updateBook;
exports.updateBookHandledBy = updateBookHandledBy
exports.updateBookStatus = updateBookStatus
