const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const fireBase_key = require("./accountKey");
const { User } = require("../model/schema");
const router = express.Router();
const { getFormattedDate } = require("../utility/dateformat");

const { jwtDecode } = require("jwt-decode");
const Authverify = require("../middleware/AuthVerify");

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
router.post("/upload",Authverify,async (req, res) => {
  console.log("upload route ----------------->......");
  try {
const user_id = req.user
    if (!user_id) {
      return res.status(401).send({ message: "Invalid Token" });
    }
    const { image, folderName } = req.body;
    let { filename } = req.body;
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

    const mimeType = mime.lookup(ext) || "application/octet-stream";

    const buffer = base64ToBuffer(image);

    if (folderName === "Deposite") {
      const Number = req.body.esewaNumber?.Number || "unknown";
      filename =
        folderName +
        "_Number:" +
        Number +
        "_user:" +
        user_id +
        "_date:" +
        getFormattedDate() +
        "." +
        ext;
      console.log(filename);
    }
    console.log("here ------------->");

    // Construct the file path in the specified folder
    const fileName = `${folderName}/${uuidv4()}-${filename}`;
    const file = bucket.file(fileName);

    // Fix: Add error handling for file operations
    try {
      // Upload file to Firebase Storage
      await file.save(buffer, {
        metadata: {
          contentType: mimeType,
        },
      });

      // Make file publicly accessible
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return res.status(200).json({
        message: "File uploaded successfully",
        url: publicUrl,
      });
    } catch (fileError) {
      console.error("Firebase storage error:", fileError);
      return res
        .status(500)
        .json({ error: "Failed to upload to storage: " + fileError.message });
    }
  } catch (error) {
    console.error("General error:", error);
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
