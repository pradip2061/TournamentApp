const express = require("express");
const { Chat, User } = require("../../model/schema");

const router = express.Router();

router.get("/chat", (req, res) => {
  res.send("Welcome to Khelma  USer Chat");
});

// API route to get chat messages by room ID
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

// Function to handle WebSocket events
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
        // Save the message to the database
        const chat = new Chat({
          roomId: message.roomId,
          senderID: message.senderID,
          message: message.message,
          time: message.time,
        });
        await chat.save();
        console.log("Message saved to DB");

        // Emit the message to users in the room
        socket.to(room).emit("message", message);
      } catch (err) {
        console.error("DB error:", err);
      }
    });

    socket.on("notification", async ({ notification }) => {
      try {
        // Send notification to the user's room
        socket
          .to(`notification:${notification.userId}`)
          .emit("new_notification", notification);

        // Update the user's notifications in the database
        await User.updateOne(
          { _id: notification.userId },
          { $push: { notification: notification } }
        );

        socket.disconnect(true);
        console.log("Socket disconnected after notification.");
      } catch (error) {
        console.error("Error handling notification:", error);
        socket.disconnect(true);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

router.get("/chat/find_people/:id", (req, res) => {
  const id = req.params.id;
  const user = User.findById(id);
});

module.exports = { router, setupChatSocket };
