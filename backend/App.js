const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const os = require("os"); // Import the os module
require("./cronDelete");
const connectToDatabase = require("./database/db");
const AuthenticateRouter = require("./router/user/AuthenticateRouter");
const Admin = require("./router/admin/AdminRouter");
const CreateRouter = require("./router/user/CreateRouter");
const CheckResultRouter = require("./router/user/CheckResultRouter");
const PubgRouter = require("./router/user/PubgRouter");
const getter = require("./router/user/getter");
const matchValidation = require("./router/admin/geminiVal");
const DeleteCardRouter =require("./router/user/DeleteCardRouter")

const {
  router: ChatRouter,
  setupChatSocket,
} = require("./router/user/chatRoutes");
const addFriends = require("./router/user/addFreind");
const userMoney = require("./router/user/money");
const upload = require("./utility/imageUpload");
dotenv.config();

const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");

connectToDatabase();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cors());

app.get("/khelmela/", (req, res) => {
  res.send("Welcome to khelmela");
});

app.use(
  "/khelmela",
  AuthenticateRouter,
  CreateRouter,
  ChatRouter,
  CheckResultRouter,
  PubgRouter,
  getter,
  addFriends,
  userMoney,
  matchValidation,
  DeleteCardRouter
);

app.use("/khelmela/admin", Admin);
app.use("/khelmela/upload", upload);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

setupChatSocket(io);

function getPrivateIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // Return the private IP address
      }
    }
  }
  return "127.0.0.1"; // Fallback to localhost if no private IP is found
}

// Start the server
const PORT = process.env.SERVER_PORT || 9000;
server.listen(PORT, () => {
  const privateIP = getPrivateIP();
  console.log(`Server running at : http://${privateIP}:${PORT}`);
  console.log(`baseUrl from dotenv: ${process.env.baseUrl}`);
});
