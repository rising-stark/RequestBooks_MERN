const BookHistory = require("../model/BookHistory");

const getBookHistory = async (req, res, next) => {
  let history;
  try {
    history = await BookHistory.find({bookid: req.params.id});
  } catch (err) {
    console.log(err);
    return res.status(400).send("No book history found");
  }
  console.log(history)
  return res.status(200).json({ history });
};

exports.getBookHistory = getBookHistory;
