const express = require("express");
const app = express();
const { Client } = require("pg");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser } = require("./utils/user");
const io = new Server(server);


const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "whiteboard",
  password: "ananya",
  port: 5433,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Error connecting to PostgreSQL", err));

let roomIdGlobal, imgURLGlobal, elements;

app.get("/", (req, res) => {
  res.send("Hello");
});

io.on("connection", (socket) => {
  console.log("User connected");


  socket.on("userJoined", async (data) => {
    const { name, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId); 

    try {
      console.log()
      const createRoomQuery = `
        INSERT INTO rooms (roomId, imgURL, host)
        VALUES ($1, $2, $3);
      `;
      await client.query(createRoomQuery, [roomId, imgURLGlobal, name]);
      console.log("Room created in the database");

      const query = `
        INSERT INTO users (name,  roomId, host, presenter) 
        VALUES ($1, $2, $3, $4);
      `;
      const values = [name, roomId, host, presenter];
      await client.query(query, values);
      console.log("User added to the database");

      const users = addUser(data);
      socket.emit("userIsJoined", { success: true, users });

      socket.broadcast.to(roomId).emit("users", users);
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
        imgURL: imgURLGlobal,
      });
    } catch (err) {
      console.error("Error adding user to database:", err);
    }
  });

  socket.on("userJoinedRoom", async (data) => {
    const { name, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    console.log("User trying to join room");

    const checkRoomQuery = `
      SELECT * FROM rooms WHERE roomId = $1;
    `;

    try {
      const res = await client.query(checkRoomQuery, [roomId]);

      if (res.rows.length === 0) {
        console.log("Room does not exist");
        socket.emit("roomNotFound", { success: false, message: "Room does not exist." });
      } else {
        console.log("Room exists, user joining...");
        socket.join(roomId);
      
        const query = `
          INSERT INTO users (name, roomId, host, presenter) 
          VALUES ($1, $2, $3, $4);
        `;
        const values = [name, roomId, host, presenter];
        await client.query(query, values);
        console.log("User added to the database");

        const users = addUser(data);
      socket.emit("userIsJoined", { success: true, users });
      socket.broadcast.to(roomId).emit("users",users)
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
        imgURL: imgURLGlobal
      })
      }
    } catch (err) {
      console.error("Error checking room existence:", err);
      socket.emit("roomNotFound", { success: false, message: "Error checking room." });
    }
  });

  socket.on("drawing", (newElement) => {
    const roomId = newElement.roomId;
    socket.to(roomId).emit("drawing", newElement);
  });


  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data.canvasImage;
    elements = data.elements;
    const updateRoomQuery = `
      UPDATE rooms
      SET imgURL = $1
      WHERE roomId = $2;
    `;
    client.query(updateRoomQuery, [imgURLGlobal, roomIdGlobal])
      .then(() => {
        console.log("Room's imgURL updated in the database");
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
          imgURL: imgURLGlobal,
          elements: elements,
        });
      })
      .catch((err) => {
        console.error("Error updating imgURL in rooms table:", err);
      });
  });
});


const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
