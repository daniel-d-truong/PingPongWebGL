const express = require("express");
const cors = require("cors");
const app = express();
const uuid = require("uuid");
const { Room, Player } = require("./room");

app.use(cors());
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

//  i want roomName and playerName


io.on("connection", async (socket) => {
  socket.on("join", (data) => {
    const {roomName, playerName} = data;
    console.log(`${playerName} is trying to join room ${roomName}`);
    if (rooms[roomName] && !rooms[roomName].filled) {
      console.log(`${playerName} has joined room ${roomName}`);
      // join room
      rooms[roomName].filled = true;
      rooms[roomName].join(new Player(data.playerName));
    } else {
      console.log(`${playerName} is creating room ${roomName}`);
      rooms[roomName] = new Room(roomName);
      rooms[roomName].join(new Player(playerName));
    }
  });

  socket.on("movement", (data) => {
    const {roomName, playerName} = data;
    if (!roomName) { return; }
    const room = rooms[roomName]
    if (!room) { return; }
    console.log(`in match ${roomName}, ${playerName} is at ${data.x}, ${data.y}`)
    const player = room.players[playerName];
    if (!player) { return; }
    player.x = data.x;
    player.y = data.y;
    socket.broadcast.emit("update", room);
  })
});

http.listen(4000, () => {
  console.log("we are live!")
})