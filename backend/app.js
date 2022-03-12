const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const router = require("./routes/routes")

const whitelist = ['http://localhost:5000', 'http://localhost:3001'];
const corsOptions = {
  credentials: true,
  exposedHeaders: ["set-cookie"],
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));
app.use("/", router);

dotenv.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected To Database"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
