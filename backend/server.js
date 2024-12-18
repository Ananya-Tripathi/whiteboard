const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.get("/", (req, res) => {
    res.send(
      "HEllo"
    );
  });
  let roomIdGlobal, imgURLGlobal
  io.on("connection", (socket) => {
    console.log("connected")
    socket.on("userJoined", (data) => {
      const { name, userId, roomId, host, presenter } = data;
      roomIdGlobal = roomId;
      socket.join(roomId);
      const users = {
        name:data.name,
        userId:data.userId,
        roomId:data.roomId,
        host:data.host,
        presenter:data.presenter,
      }
      socket.emit("userIsJoined", { success: true, users });
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
        imgURL: imgURLGlobal
      })
    })

    socket.on("drawing", (newElement) => {
      const roomId = newElement.roomId; 
      socket.to(roomId).emit("drawing", newElement); 
    });
    socket.on("whiteboardData", (data) => {
      imgURLGlobal = data;
      socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
        imgURL: data,
      });
    }); 
})
const port = process.env.PORT || 5000;

server.listen(port, () =>
console.log("server is running on http://localhost:5000")
);