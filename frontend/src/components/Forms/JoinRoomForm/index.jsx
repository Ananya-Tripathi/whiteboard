const JoinRoomForm = ({ uuid, socket, setUser, setMyPeer }) => {
    return(
        <form className="form col-md-12 mt-5">
        <div className="form-group">
          <input
            type="text"
            className="form-control my-2"
            placeholder="Enter your name"
            // value={name}
            // onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control my-2"
            placeholder="Enter room code"
            // value={roomId}
            // onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        <button
          type="submit"
        //   onClick={handleRoomJoin}
          className="mt-4 btn-primary btn-block form-control"
        >
          Join Room
        </button>
      </form>
    )
}
export default JoinRoomForm;