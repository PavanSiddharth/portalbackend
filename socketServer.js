const server = require("http").createServer();

const io = require("socket.io")(server, {
  path: "/messaging",
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
});

io.of("/test").on("connect", (socket) => {
  socket.nsp.emit("Backend socket test");
});

const port = process.env.PORT || 8002;

server.listen(port, () => console.log("Socket server online at port ", port));
