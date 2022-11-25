const express = require("express");

const http = require("http");
const socketIo = require("socket.io");

const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors({ origin: true }));

const mongoose = require("mongoose");

require("dotenv").config();
const PORT = 4000;


app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const server = http.createServer(app);

let io = socketIo(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO4: true
});

// mongoose.connect(
//   "mongodb+srv://shahiddgk:2llbsPlUaTIsb48H@cluster0.rxm2atp.mongodb.net/?retryWrites=true&w=majority",
//   { useNewUrlParser: true }
// );

mongoose.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

let sock;
io.on("connection", (socket) => {
  console.log("New client connected");
  app.use("/",require("./middleware"));
  
  socket.io = io;
  sock = socket;

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use("/basic", require("./routes/basic")(sock));
app.use("/nurse", require("./routes/basic/nurse")(sock));
app.use("/patient", require("./routes/basic/patient")(sock));
app.use("/rota", require("./routes/rota")(sock));
app.use("/leave", require("./routes/leave")(sock));

server.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});