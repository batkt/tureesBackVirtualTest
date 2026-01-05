const app = require("./index");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
  socket.on("error", () => socket.disconnect(true));
});

const PORT = process.env.SOCKET_PORT || 8089;
server.listen(PORT, () => {
  console.log("Socket running on port", PORT);
});
