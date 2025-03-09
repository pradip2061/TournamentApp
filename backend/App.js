const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require('./cronDelete')
const connectToDatabase = require("./database/db");
const AuthenticateRouter = require("./router/user/AuthenticateRouter");
const Admin = require("./router/admin/AdminRouter");
const CreateRouter = require("./router/user/CreateRouter");
const CheckResultRouter = require("./router/user/CheckResultRouter");
const DeleteCardRouter = require("./router/user/DeleteCardRouter");
const PubgRouter = require("./router/user/PubgRouter");
const getter = require("./router/user/getter");
const { User, moneyRequest } = require("./model/schema");
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
const Authverify = require("./middleware/AuthVerify");

connectToDatabase();

app.use(express.json());
app.use(cors());

app.use(
  "/khelmela",
  AuthenticateRouter,
  CreateRouter,
  ChatRouter,
  CheckResultRouter,
  PubgRouter,
  getter,
  addFriends,
  userMoney
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

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`the project is running at ${PORT}`);
});