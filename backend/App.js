const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDatabase = require("./database/db");
const AuthenticateRouter = require("./router/user/AuthenticateRouter");
const Admin = require("./router/admin/AdminRouter");
const CreateRouter = require("./router/user/CreateRouter");
const CheckResultRouter =require('./router/user/CheckResultRouter')
const DeleteCardRouter =require('./router/user/DeleteCardRouter')
const PubgRouter =require('./router/user/PubgRouter')
const {
  router: ChatRouter,
  setupChatSocket,
} = require("./router/user/chatRoutes");
dotenv.config();
const app = express();
connectToDatabase();

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

