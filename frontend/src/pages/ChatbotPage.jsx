import React, { useState } from 'react';
import axios from 'axios';
import { FaBars, FaHome, FaUser, FaBell, FaCog, FaUsers, FaFacebookMessenger } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Add React Router for navigation
import "../styles/ChatbotPage.css";

function ChatBot() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Store the full chat history
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for page redirection

  const handleMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    // Update chat history with the user's message before sending
    const updatedHistory = [...chatHistory, { user: userMessage }];

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        user_message: userMessage,
        chat_history: chatHistory, 
      });

      if (response.data && response.data.response) {
        setChatHistory([...updatedHistory, { bot: response.data.response }]);
      } else {
        setChatHistory([...updatedHistory, { bot: "Sorry, I couldn't understand that!" }]);
      }

      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      const backendError = error.response?.data?.error || 'Sorry, something went wrong. Please try again.';
      setError(backendError);
      setChatHistory([...updatedHistory, { bot: backendError }]);
    }

    setIsLoading(false);
  };

  const formatText = (text) => {
    return text.split('*').map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="icon-item">
              <FaBars size={24} />
            </li>
            <li className="icon-item" onClick={() => navigate("/innovatorhome")}>
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
            <li className="icon-item" onClick={() => navigate("/messaging")}>
              <FaFacebookMessenger size={24} />
            </li>
          </ul>
        </nav>
      </aside>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="header">
          <h1>INNOMATE</h1>
        </div>

        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-message">
              {chat.user && (
                <div className="user-message">
                  <strong>User:</strong>
                  <p>{formatText(chat.user)}</p>
                </div>
              )}
              {chat.bot && (
                <div className="bot-message">
                  <strong>Bot:</strong>
                  <pre>{formatText(chat.bot)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={userMessage}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            className="message-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="send-button"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
