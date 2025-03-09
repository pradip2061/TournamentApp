const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const fireBase_key = require("./accountKey");

const router = express.Router();

const serviceAccount = fireBase_key;

console.log(process.env.fireBase_key);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://khelmela-98.firebasestorage.app",
});

const bucket = admin.storage().bucket();

function base64ToBuffer(base64String) {
  if (!base64String || typeof base64String !== "string") {
    throw new Error("Invalid base64 string received.");
  }

  try {
    return Buffer.from(base64String, "base64");
  } catch (error) {
    throw new Error("Failed to convert Base64 to Buffer: " + error.message);
  }
}

router.get("/", (req, res) => {
  console.log("Upload Route Active >>>>>>>>>>>>>>>>>>>>>>>");
  res.send("Hello World!");
});
router.post("/upload", async (req, res) => {
  try {
    const { image, filename, folderName } = req.body;
    if (!image || !filename || !folderName) {
      return res
        .status(400)
        .json({ error: "Image, filename, and folderName are required." });
    }

    // Get the file extension from filename
    const ext = filename.split(".").pop().toLowerCase();

    // Supported file types
    const allowedTypes = [
      "png",
      "jpg",
      "jpeg",
      "pdf",
      "gif",
      "webp",
      "docx",
      "xlsx",
    ];
    if (!allowedTypes.includes(ext)) {
      return res
        .status(400)
        .json({ error: `File type .${ext} is not allowed.` });
    }

    // Detect MIME type
    const mimeType = mime.lookup(ext) || "application/octet-stream";

    // Convert Base64 to Buffer
    const buffer = base64ToBuffer(image);

    // Construct the file path in the specified folder
    const fileName = `${folderName}/${uuidv4()}-${filename}`;
    const file = bucket.file(fileName);

    // Upload file to Firebase Storage
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Make file publicly accessible
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    res.status(200).json({
      message: "File uploaded successfully",
      url: publicUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
