import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({ rId, socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  // Handle user room join
  const handleRoomJoin = (e) => {
    e.preventDefault();
    console.log("Clicked");

    const roomData = {
      name,
      roomId,
      host: false,
      presenter: false,
    };

    if (roomData.roomId && roomData.name) {
      // Emit room join request to the server
      socket.emit("userJoinedRoom", roomData);
    } else {
      alert("Enter data");
    }
  };

  // Listen for the room not found event
  useEffect(() => {
    socket.on("roomNotFound", (data) => {
      if (!data.success) {
        alert(data.message);  // Show alert if the room doesn't exist
      }
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("roomNotFound");
    };
  }, [socket]);

  // Navigate to the room once the user successfully joins
  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        setUser(data.users);
        navigate(`/${roomId}`);  // Redirect to the room page if successful
      }
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("userIsJoined");
    };
  }, [socket, roomId, setUser, navigate]);

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <button
        type="submit"
        onClick={handleRoomJoin}
        className="mt-4 btn-primary btn-block form-control"
      >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomForm;
