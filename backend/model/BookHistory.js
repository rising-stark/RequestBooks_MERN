const mongoose = require("mongoose");

const bookHistorySchema = new mongoose.Schema({
  bookid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bookstate: {
    type: String,
    required: true,
  },
  timestamp: {
    type : Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BookHistory", bookHistorySchema);
