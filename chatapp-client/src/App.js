import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "./pages/ChatPage/ChatPage";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import socket from "./server";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [rooms, setRooms] = useState([]);

  const askUserName = () => {
    const userName = prompt("Please enter your name");
    socket.emit("login", userName, (response) => {
      if (response.ok) {
        setUser(response.data);
      }
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();

    socket.emit("sendMessage", message, (response) => {
      console.log("response", response);
    });

    setMessage("");
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessageList((prev) => prev.concat(message));
    });
    socket.on("rooms", (res) => {
      setRooms(res);
    });
    askUserName();
  }, []);

  console.log("rooms", rooms);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<RoomListPage rooms={rooms} />} />
        <Route exact path="/room/:id" element={<ChatPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
