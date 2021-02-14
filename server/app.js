const express = require("express");
const cors = require("cors");
const app = express();
const uuid = require("uuid");
const { Room, Player } = require("./room");
const path = require('path');


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
      socket.join(roomName);
    } else {
      console.log(`${playerName} is creating room ${roomName}`);

      rooms[roomName] = new Room(roomName);
      rooms[roomName].join(new Player(playerName));
      rooms[roomName].primary = playerName;
      socket.join(roomName);
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
    io.to(roomName).emit("update", room);
  });

  socket.on("updateballposition", (data) => {
    const {roomName, playerName} = data;
    if (!roomName) { return; }
    const room = rooms[roomName]
    if (!room) { return; }

    console.log(`in match ${roomName}, ${playerName} the ball is at ${JSON.stringify(data.position)}`);

    room.ballPosition = data.position;
    io.to(roomName).emit("recieveballupdate", room.ballPosition);
  })
});

app.use(express.static(__dirname + "/website"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/website/index.html"));
})

http.listen(4000, () => {
  console.log("we are live!")
})