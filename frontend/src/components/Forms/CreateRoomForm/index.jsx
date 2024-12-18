import { useState } from "react";
import { useNavigate } from "react-router-dom";
const CreateRoomForm = ({ rId, socket, setUser, setMyPeer }) => {
  const [roomId, setRoomId] = useState(rId());
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      host: true,
      presenter: true,
    };
    if(roomData.name){
    setUser(roomData);
    navigate(`/${roomId}`)
    socket.emit("userJoined", roomData)
  }
  else{
    alert("Enter name")
  }
  }; 

  
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
      <div className="form-group border">
        <div className="input-group d-flex align-items-center jusitfy-content-center">
          <input
            type="text"
            value={roomId}
            className="form-control my-2 border-0"
            disabled
            placeholder="Generate room code"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary btn-sm me-1"
              onClick={() => setRoomId(rId())}
              type="button"
            >
              generate
            </button>
        
          </div>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleCreateRoom}
        className="mt-4 btn-primary btn-block form-control"
      >
        Generate Room
      </button>
    </form>
  );
};
export default CreateRoomForm;
