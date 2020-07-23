const server = require("http").createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
});

const io = require("socket.io")(server, {
  path: "/messaging",
  pingInterval: 10000,
  pingTimeout: 5000,
});

io.of("/test").on("connect", (socket) => {
  socket.nsp.emit("Backend socket test");
});

const port = process.env.PORT || 8002;

server.listen(port, () => console.log("Socket server online at port ", port));
