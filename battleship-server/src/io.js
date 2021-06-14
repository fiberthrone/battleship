const { Server } = require("socket.io");

const io = new Server(require("./server"), {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.setMaxListeners(20); // Default is 10, we have 11 or something

module.exports = io;
