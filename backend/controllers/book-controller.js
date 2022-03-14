const Book = require("../models/Book");
const BookHistory = require("../models/BookHistory");
const nodemailer = require('nodemailer');

const insertBookHistory = async (username, book) =>{
  try {
    bookhistory = await BookHistory.create({
      bookid: book._id,
      username: username,
      bookstate: book.bookstate
    });
    return 1;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

const sendEmail = async (id, bookstate) => {
  try{
    /*
      To use this email service, go to this link and turn off the less secure app access for this gmail account
      https://support.google.com/accounts/answer/6010255?hl=en#zippy=%2Cif-less-secure-app-access-is-on-for-your-account
    */
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        secure: true,
    });
    console.log(process.env.EMAIL)
    console.log(process.env.PASSWORD)
    const mailData = {
        from: process.env.EMAIL,
        to: "codingfever44@gmail.com",
        subject: `Status of your book ${id} has been changed`,
        text: bookstate,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log({ message: "Mail send", message_id: info.messageId });
    });
  } catch (err) {
    console.log("Mail could not be sent because of this error");
    console.log(err);
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
    return res.status(200).json({ books });
  } catch (err) {
    console.log(err);
    return res.status(400).send("No book requests found");
  }
};

const getBookById = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findById(id);
    if(req.cookies.usertype === "user" && book.requestedby !== req.cookies.username)
      return res.status(400).json({});
    return res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    return res.status(400).json({});
  }
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
      bookstate: "Updated book info to " + JSON.stringify(req.body),
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
  let book, newbook;
  try {
    book = await Book.findById(id);
    if((req.cookies.usertype === "user" && book.requestedby !== req.cookies.username) || (req.cookies.usertype === "employee" && book.handledby !== req.cookies.username))
      return res.status(401).send("Not allowed");
    newbook = await Book.findByIdAndUpdate(id, {
      bookstate,
      bookstate_int,
      isAuthorised: book.isAuthorised || (bookstate_int === 6)
    }, {new: true});
    const bookhistory = await insertBookHistory(req.cookies.username, newbook)
    if(bookhistory == 0)
      return res.status(400).send("Unable to insert book history");

    // notify user using email if the book request is either aproved or denied
    if(bookstate_int === 5 || (req.cookies.usertype === "employee" && bookstate_int === 8))
      sendEmail(id, bookstate);
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
