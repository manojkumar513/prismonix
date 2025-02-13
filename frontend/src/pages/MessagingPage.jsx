import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import "../styles/MessagingPage.css";
import { FaBars, FaHome, FaUser, FaBell, FaCog, FaUsers, FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const MessagingPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [userRole, setUserRole] = useState(""); // Store the role of the user
  const [error, setError] = useState("");
  const [messageTimestamps, setMessageTimestamps] = useState(new Set()); // Track sent message timestamps

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      fetchUserDetails(userId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserDetails = (userId) => {
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((response) => {
        setLoggedInUsername(response.data.username);
        setUserRole(response.data.role);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  };

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("receive_message", (message) => {
      // Prevent adding the same message twice
      if (message.receiver === loggedInUsername || message.sender === loggedInUsername) {
        setMessages((prevMessages) => {
          // Check if the message is already in the list based on timestamp
          if (!messageTimestamps.has(message.timestamp)) {
            setMessageTimestamps((prevTimestamps) => new Set(prevTimestamps).add(message.timestamp));
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      }
    });

    return () => newSocket.disconnect(); // Cleanup the socket connection
  }, [loggedInUsername, messageTimestamps]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        const filteredUsers = response.data.filter(user => user.username !== loggedInUsername);
        setUsers(filteredUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [loggedInUsername]);

  useEffect(() => {
    if (selectedUser && loggedInUsername) {
      axios
        .get(`http://localhost:5000/api/messages/messages/${loggedInUsername}/${selectedUser}`)
        .then((response) => {
          const newMessages = response.data.filter(msg => !messageTimestamps.has(msg.timestamp));
          setMessages((prevMessages) => [...newMessages, ...prevMessages]); // Prepend the new messages
          newMessages.forEach(msg => setMessageTimestamps((prev) => new Set(prev).add(msg.timestamp)));
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
          setError("Failed to fetch messages.");
        });
    }
  }, [selectedUser, loggedInUsername, messageTimestamps]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const messageData = {
        sender: loggedInUsername,
        receiver: selectedUser,
        text: messageInput,
        timestamp: new Date().toISOString(), // Use ISO string to uniquely identify the message
      };

      socket.emit("send_message", messageData);

      axios
        .post("http://localhost:5000/api/messages/messages", messageData)
        .then(() => {
          setMessages((prevMessages) => [messageData, ...prevMessages]); // Prepend the sent message
          setMessageTimestamps((prevTimestamps) => new Set(prevTimestamps).add(messageData.timestamp)); // Add message timestamp
          setMessageInput("");
        })
        .catch((error) => {
          console.error("Error saving message:", error);
          setError("Failed to send the message.");
        });
    }
  };

  useEffect(() => {
    const messageList = document.querySelector(".message-list");
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  const handleHomeClick = () => {
    if (userRole === "Developer") {
      navigate("/developerhome");
    } else if (userRole === "Innovator") {
      navigate("/innovatorhome");
    } else if (userRole === "Investor") {
      navigate("/investorhome");
    } else {
      navigate("/home");
    }
  };

  const handleMessagingClick = () => {
    navigate("/messaging");
  };

  return (
    <div className="messaging-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="icon-item">
              <FaBars size={24} />
            </li>
            <li className="icon-item" onClick={handleHomeClick}>
              <FaHome size={24} />
            </li>
            <li className="icon-item" onClick={() => navigate("/profile")}>
              <FaUser size={24} />
            </li>
            <li className="icon-item">
              <FaBell size={24} />
            </li>
            <li className="icon-item">
              <FaCog size={24} />
            </li>
            <li className="icon-item">
              <FaUsers size={24} />
            </li>
            <li className="icon-item" onClick={handleMessagingClick}>
              <FaFacebookMessenger size={24} />
            </li>
          </ul>
        </nav>
      </aside>

      <div className="user-list">
        <h3>Contacts</h3>
        <ul>
          {users.map((user) => (
            <li key={user.username} onClick={() => setSelectedUser(user.username)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-section">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser}</h3>
            <div className="message-list">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender === loggedInUsername ? "sent" : "received"}`}
                  >
                    <p>{msg.text}</p>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default MessagingPage;
