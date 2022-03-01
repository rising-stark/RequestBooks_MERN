const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const router = require("./routes/book-routes")

dotenv.config()

app.use("/", router);
app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected To Database"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
