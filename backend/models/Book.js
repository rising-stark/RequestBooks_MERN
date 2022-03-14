const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
  },
  bookstate_int: {
    type: Number,
    required: true,
    default: 0,
  },
  bookstate: {
    type: String,
    required: true,
  },
  requestedby: {
    type: String,
    required: true,
  },
  requestedat: {
    type : Date,
    default: Date.now
  },
  handledby: {
    type: String
  },
  isAuthorised: {
    type: Boolean,
    required: true,
    default: false
  },
});

module.exports = mongoose.model("Book", bookSchema);
