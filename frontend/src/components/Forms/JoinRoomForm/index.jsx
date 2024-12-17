import { useState } from "react";
import { useNavigate } from "react-router-dom";
const JoinRoomForm = ({ rId, socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const handleRoomJoin =(e)=>{
    e.preventDefault();
    console.log("Clicked")
    
    const roomData = {
      name,
      roomId,
      userId: rId,
      host: true,
      presenter: true,
      };
    if(roomId && name){
      setUser(roomData);
      navigate('/${roomId}')
      socket.emit("userJoined", roomData)
    }
    else{
      alert("Enter data")
    }
  }
    return(
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
    )
}
export default JoinRoomForm;