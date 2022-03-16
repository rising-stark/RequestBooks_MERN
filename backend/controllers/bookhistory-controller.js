const BookHistory = require("../models/BookHistory");
const Book = require("../models/Book");

const getBookHistory = async (req, res, next) => {
  try {
    let history, id = req.params.id, grantAccess = true;
    if(req.cookies.usertype === "user"){
      let book = await Book.findById(id);
      if(req.cookies.username !== book.requestedby)
        grantAccess = false;
    }
    if(grantAccess){
      history = await BookHistory.find({bookid: id});
      return res.status(200).json({ history });
    }else{
      return res.status(400).json({ });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("No book history found");
  }
};

exports.getBookHistory = getBookHistory;
