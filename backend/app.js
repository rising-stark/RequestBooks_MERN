const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const router = require("./routes/routes")
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);

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
app.use("/", router);

dotenv.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected To Database"))
  .catch((err) => console.log(err));

server.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMsg", (data) => {
    const sendUserSocket = onlineUsers.get(data.receiver);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msgReceive", data.message);
    }
  });
});
