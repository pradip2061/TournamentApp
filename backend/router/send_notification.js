const express = require("express");

module.exports = (io) => {
  const router = express.Router();

  router.get("/SAP-1/send-notification", (req, res) => {
    res.send("send-Notification Route");
  });

  router.post("/SAP-1/send-notification", (req, res) => {
    console.log(" Notification sent to SAP-1,,,,,,,,,,,,,,,,,-k-------");
    const { reciver, message } = req.body;
    console.log("reciver:",reciver)
    if (!reciver || !message) {
      console.log("missing Fields while Sending Notification");
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
      console.log("Array of recivers");
      reciver.forEach((r) => io.to(r).emit("Notify", message));
      return res
        .status(200)
        .json({ message: `Notification sent to multiple Users  ` });
    }

    // Handle single reciver
    io.to(reciver).emit("Notify", message);
    console.log("Notifiaction sent to Users-:-  " + message);
    res
      .status(200)
      .json({ message: `Notification sent to reciver: [${reciver}] ` });
  });

  router.post("/SHA-256/update", (req, res) => {
    const { message, reciver } = req.body;

    if (!reciver || !message) {
      console.log("missing Fields while Sending Notification");

      return res
        .status(400)
        .json({ error: "reciver and message are required" });
    }
    if (Array.isArray(reciver) && reciver.length > 0) {
      console.log("Array of recivers");
      reciver.forEach((r) => io.to(r).emit("Notify", message));
      return res
        .status(200)
        .json({ message: `Notification sent to multiple Users  ` });
    }
  });

  return router;
};
