const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDatabase = require("./database/db");
const AuthenticateRouter = require("./router/user/AuthenticateRouter");
const Admin = require("./router/admin/AdminRouter");
const CreateRouter = require("./router/user/CreateRouter");
const CheckResultRouter =require('./router/user/CheckResultRouter')
const PubgRouter =require('./router/user/PubgRouter')
require('./cronDelete')
const {
  router: ChatRouter,
  setupChatSocket,
} = require("./router/user/chatRoutes");
dotenv.config();
const app = express();
connectToDatabase();
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAY2F3bxTKz3plAR3cdQOtyOlQCNbxStVk",
  authDomain: "khelmela-98.firebaseapp.com",
  projectId: "khelmela-98",
  storageBucket: "khelmela-98.appspot.com",
  messagingSenderId: "43642509681",
  appId: "1:43642509681:web:c51d05df93e788e017fed0",
  measurementId: "G-4FFRNCV1W9",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const {selectedImage} = req.file;
    console.log(selectedImage)
    const storageRef = ref(storage, uploads/`${Date.now()}_${file.originalname}`);
    await uploadBytes(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(storageRef);
    res.json({ url: downloadURL });
    console.log(downloadURL)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.use(express.json());
app.use(cors());
app.use("/khelmela", AuthenticateRouter, CreateRouter, ChatRouter,CheckResultRouter,PubgRouter);
app.use("/khelmela/admin", Admin);

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
setupChatSocket(io);

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at ${PORT}`);
});

