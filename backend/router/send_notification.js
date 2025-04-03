const express = require("express");

module.exports = (io) => {
  const router = express.Router();

  router.get("/SAP-1/send-notification", (req, res) => {
    res.send("send-Notification Route");
  });

  router.post("/SAP-1/send-notification", (req, res) => {
    const { reciver, message } = req.body;

    if (!reciver || !message) {
      return res
        .status(400)
        .json({ error: "reciver and message are required" });
    }

    if (reciver === "all") {
      io.emit("Notify", message);
      return res.status(200).json({ message: "Notification sent to all" });
    }

    // Handle array of recivers
    if (Array.isArray(reciver) && reciver.length > 0) {
      reciver.forEach((r) => io.to(r).emit("Notify", message));
      return res
        .status(200)
        .json({ message: `Notification sent to recivers: ${reciver}` });
    }

    // Handle single reciver
    io.to(reciver).emit("Notify", message);
    res
      .status(200)
      .json({ message: `Notification sent to reciver: ${reciver}` });
  });

  return router;
};
