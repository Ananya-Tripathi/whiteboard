import "./App.css";
import Forms from "./components/Forms/index.jsx";
import { Route,Routes } from "react-router-dom";
import RoomPage from "./pages/RoomPage/index.jsx";
const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms/>}/>
        <Route path="/:roomId" element={<RoomPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
