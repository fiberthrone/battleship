const { Server } = require("socket.io");

module.exports = new Server(require("./server"), {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
