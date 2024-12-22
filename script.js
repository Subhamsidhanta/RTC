const loginForm = document.getElementById("loginForm");
const messageForm = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");
const chatPage = document.getElementById("chatPage");
const loginPage = document.getElementById("loginPage");
const chatHeader = document.getElementById("chatHeader");

const socket = io();

let username;
let chatID;

// Handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  username = document.getElementById("username ").value;
  chatID = document.getElementById("chatID").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, chatID }),
  });

  if (response.ok) {
    loginPage.style.display = "none";
    chatPage.style.display = "block";
    chatHeader.textContent = `Chat: ${chatID} | User: ${username}`;

    socket.emit("join", { username, chatID });
  } else {
    alert("Invalid username or chat ID!");
  }
});

// Handle sending messages
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("messageInput").value;
  socket.emit("chatMessage", { chatID, username, message });
  document.getElementById("messageInput").value = "";
});

// Receive messages
socket.on("message", (message) => {
  const msgElement = document.createElement("div");
  msgElement.textContent = message;
  messagesDiv.appendChild(msgElement);
});
