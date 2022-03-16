const Chat = require("../models/Chat");
const Book = require("../models/Book");

const getAllChats = async (req, res, next) => {
  try {
    if(!req.cookies || !req.cookies.username)return res.status(400).send("Login first");
    const username = req.cookies.username;
    const records = await Chat.aggregate(
            [
              {$match: {$or: [{sender: username }, {receiver: username}]} },
              {$group: {_id: { bookid: "$bookid", sender: "$sender", receiver: "$receiver" } } }
            ]
        );
    let chats = [];
    let uniqueBookids = new Set();
    for(let i = 0; i < records.length; i++){
      const {bookid, receiver, sender} = records[i]._id;
      if(!uniqueBookids.has(bookid)){
        uniqueBookids.add(bookid)
        chats.push({
          bookid,
          username: (receiver === username)? sender : receiver,
        })
      }
    }
    return res.status(200).json({chats});
  } catch (err) {
    console.log(err);
    return res.status(400).send("No chats found");
  }
};

const getMessages = async (req, res, next) => {
  try {
    if(!req.cookies || !req.cookies.username)return res.status(400).send("Login first");
    let id = req.params.id;
    let book = await Book.findById(id);

    if([0, 5, 8].includes(book.bookstate_int) || req.cookies.usertype === "admin" || (req.cookies.usertype === "user" && book.requestedby !== req.cookies.username) || (req.cookies.usertype === "employee" && book.handledby !== req.cookies.username))
      return res.status(400).send("Not allowed");

    const { sender, receiver } = req.body;
    const messages = await Chat.find({bookid: id}).sort({ timestamp: 1 });
    return res.status(200).json({messages});
  } catch (err) {
    console.log(err);
    return res.status(400).send("No messages found");
  }
};

const addMessage = async (req, res, next) => {
  try {
    if(!req.cookies || !req.cookies.username)return res.status(400).send("Login first");
    let id = req.params.id;
    let book = await Book.findById(id);
    /*
      chatting is not allowed if
      1. the book is not yet alloted to any employee or it is deleted/denied
      2. the employee doesn't handle it
      3. the book is not requested by this user
      4. usertype is admin
    */
    if([0, 5, 8].includes(book.bookstate_int) || req.cookies.usertype === "admin" || (req.cookies.usertype === "user" && book.requestedby !== req.cookies.username) || (req.cookies.usertype === "employee" && book.handledby !== req.cookies.username))
      return res.status(400).send("Not allowed");

    const { message } = req.body;
    let receiver = book.handledby;
    if(req.cookies.usertype === "employee")
      receiver = book.requestedby;
    const chat = await Chat.create({
      bookid: id,
      message,
      sender: req.cookies.username,
      receiver
    });
    return res.status(200).json({msg: chat});
  } catch (err) {
    console.log(err);
    return res.status(400).send("Message not sent");
  }
};

exports.getAllChats = getAllChats;
exports.getMessages = getMessages;
exports.addMessage = addMessage;
