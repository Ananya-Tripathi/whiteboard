// import CreateRoomForm from "./CreateRoomForm/index.jsx";
// import JoinRoomForm from "./JoinRoomForm/index.jsx";

import CreateRoomForm from "./CreateRoomForm";
import "./index.css";
import JoinRoomForm from "./JoinRoomForm";

const Forms = ({rId,socket,setUser}) => {
  return (
    <div className="row h-100 pt-5">
      <div className="col-md-4 mt-5 form-box p-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
        <h1 className="text-primary fw-bold">Create Room</h1>
        <CreateRoomForm rId={rId} socket={socket} setUser={setUser}/>
      </div>
      <div className="col-md-4 mt-5 form-box p-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
        <h1 className="text-primary fw-bold">Join Room</h1>
        <JoinRoomForm rId={rId} socket={socket} setUser={setUser}/>
      </div>
    </div>
)};

export default Forms;