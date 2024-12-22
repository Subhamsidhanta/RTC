const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Admin-managed chat IDs
const chatIDs = ["12369", "chat456"]; // Admin-created IDs
const users = {}; // { username: chatID }

// API for login
app.post("/login", (req, res) => {
  const { username, chatID } = req.body;
  if (!chatIDs.includes(chatID)) {
    return res.status(400).send({ message: "Invalid chat ID" });
  }
  users[username] = chatID;
  res.status(200).send({ message: "Login successful" });
});

// WebSocket communication
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", ({ username, chatID }) => {
    socket.join(chatID);
    io.to(chatID).emit("message", `${username} joined the chat!`);
  });

  socket.on("chatMessage", ({ chatID, username, message }) => {
    io.to(chatID).emit("message", `${username}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
