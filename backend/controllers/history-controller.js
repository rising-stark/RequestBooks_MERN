const BookHistory = require("../model/BookHistory");
const Book = require("../model/Book");

const getBookHistory = async (req, res, next) => {
  let history, id = req.params.id, grantAccess = true;
  try {
    if(req.cookies.usertype === "user"){
      let book = await Book.findById(id);
      if(req.cookies.username !== book.requestedby)
        grantAccess = false;
    }
    if(grantAccess)
      history = await BookHistory.find({bookid: id});
  } catch (err) {
    console.log(err);
    return res.status(400).send("No book history found");
  }
  console.log(history)
  return res.status(200).json({ history });
};

exports.getBookHistory = getBookHistory;
