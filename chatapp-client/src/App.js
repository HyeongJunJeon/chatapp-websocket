import "./App.css";
import socket from "./server";
import { useEffect, useState } from "react";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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
    askUserName();
  }, []);

  return (
    <div>
      <div className="App">
        <MessageContainer messageList={messageList} user={user} />
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
