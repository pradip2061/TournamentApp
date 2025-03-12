const express = require("express");
const multer = require("multer");
const path = require("path");
const { Chat, User } = require("../../model/schema");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Save uploaded files in 'uploads' folder

router.get("/chat", (req, res) => {
  res.send("Welcome to Khelma User Chat");
});

// Get chat messages by room ID
router.get("/chat/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Fetching chat for room: ${id}`);
    const chat = await Chat.find({ roomId: id });
    res.send(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).send("Server error");
  }
});

// Handle WebSocket events
const setupChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("message", async ({ room, message }) => {
      console.log(room, message);
      try {
        const chat = new Chat({
          roomId: message.roomId,
          senderID: message.senderID,
          message: message.message,
          time: message.time,
          fileUrl: message.fileUrl || null, // Save file URL if available
        });
        await chat.save();
        console.log("Message saved to DB");
        socket.to(room).emit("message", message);
      } catch (err) {
        console.error("DB error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

// File upload route
router.post("/chat/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const fileUrl = `/uploads/${req.file.filename}`;
    res.send({ fileUrl });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = { router, setupChatSocket };
