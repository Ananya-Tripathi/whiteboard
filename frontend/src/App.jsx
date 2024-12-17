import "./App.css";
import { useEffect, useState } from "react";
import Forms from "./components/Forms/index.jsx";
import { Route,Routes } from "react-router-dom";
import RoomPage from "./pages/RoomPage/index.jsx";

import io from "socket.io-client";

const App = () => {
  const [user, setUser] = useState(null);
  // const [users, setUsers] = useState([]); 
  const [peers, setPeers] = useState({});
  const [myPeer, setMyPeer] = useState(null);
  
  const server = "http://localhost:5000";
  const connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const socket = io(server, connectionOptions);
  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4()
    );
  };
  useEffect(()=>{
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        setUser(data.users);
      } else {
        console.log("userJoined error");
      }
    });
  })



  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms rId = {uuid} socket={socket} setUser={setUser}/>}/>
        <Route path="/:roomId" element={<RoomPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
