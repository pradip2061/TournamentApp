const express = require("express");
const multer = require("multer");
const path = require("path");
const { Chat, User } = require("../../model/schema");
const jwt = require("jsonwebtoken");
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

    socket.on("register", async (userId) => {
      try {
        socket.join(userId);
        console.log(`User registered to listen to thier  room: ${userId}`);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    });

    //  Global Socket

    socket.on("GlobalRegister", async (token) => {
      try {
        const decoded = jwt.decode(token);
        console.log("Connecting to Global Socket ................");

        if (!decoded || !decoded.id) {
          console.error("Invalid token");
          throw new Error("Invalid token");
        }
        const userId = decoded.id;
        console.log("User ID:", userId);
        const user = await User.findById(userId);

        if (!user) {
          console.error("User not found");
          return;
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
        socket.emit("registerError", {
          message: "Failed to decode token",
          error: error.message,
        });
      }
    });

    // Message Socket

    socket.on("message", async ({ room, message }) => {
      console.log(room, message);
      socket.to(room).emit("message", message);
      const data = {
        FriendId: message.FriendId,
        type: "newMessage",
        message: message.message,
      };
      socket.to(message.FriendId).emit("Notify", data);

      try {
        const main_chat = {
          roomId: message.roomId,
          senderID: message.senderID,
          message: message.message,
          time: message.time,
          isRead: message.isRead || false,
          fileUrl: message.fileUrl || null, // Save file URL if available
        };
        const chat = new Chat(main_chat);
        await chat.save();

        const friendId = message.FriendId;

        // Update sender's friends list
        const user = await User.findById(message.senderID);

        if (!user) {
          console.log("User Not Found-------------");
          return;
        }

        for (let i = 0; i < user.friends.length; i++) {
          if (user.friends[i].id == friendId) {
            console.log("Friend Id Matched " + friendId);
            user.friends[i].latestMessage = {
              message: main_chat.message,
              time: main_chat.time,
            };
            user.markModified(`friends.${i}.latestMessage`);

            await user.save(); // Ensure save is awaited
          }
        }

        // Update recipient's friends list
        const friend = await User.findById(message.FriendId);
        if (!friend) {
          console.log("Friend Not Found");
          return;
        }

        for (let i = 0; i < friend.friends.length; i++) {
          if (friend.friends[i].id == main_chat.senderID) {
            console.log("Time ------- " + main_chat.time);
            friend.friends[i].latestMessage = {
              message: main_chat.message,
              time: main_chat.time,
            };
            friend.markModified(`friends.${i}.latestMessage`);

            console.log(
              "Friend after Latest Message ------> ",
              friend.friends[i]
            );

            await friend.save(); // Ensure save is awaited
          }
        }

        console.log("Message saved to DB");
        console.log(chat.isRead);
      } catch (err) {
        console.error("DB error:", err);
      }
    });

    socket.on("notify", async ({ user, message }) => {
      try {
        await io.to(user).emit("notify", message);
      } catch (error) {
        console.error("Error sending notification:", error);
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
