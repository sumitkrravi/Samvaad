import React, { useEffect, useState } from "react";
import API from "../services/api";
import { socket } from "../services/socket";
import ChatBox from "../components/ChatBox";
import UserList from "../components/UserList";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const formatUsername = (username) => username ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase() : "";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login", { replace: true }); return; }

    API.get("/me")
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error(err));

    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    socket.emit("join", { token });

    socket.on("updateUsers", onlineUsers => {
      setUsers(prev => prev.map(u => ({ ...u, online: onlineUsers.includes(u._id) })));
    });

    return () => { socket.off("updateUsers"); };
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" alt="User" className="profile-pic-small" />
          <span className="username">{currentUser ? formatUsername(currentUser.username) : "Samvaad | संवाद"}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-main">
        <aside className="sidebar">
          <div className="user-list-section">
            <h6>Chats</h6>
            <UserList users={users} onSelect={setSelectedUser} selectedUser={selectedUser} />
          </div>
        </aside>

        <main className="chat-section">
          {selectedUser ? (
            <ChatBox selectedUser={selectedUser} currentUser={currentUser} />
          ) : (
            <div className="no-chat-selected">
              <img src="https://cdn-icons-png.flaticon.com/512/134/134914.png" alt="chat" className="chat-illustration" />
              <h4>Select a user to start chatting 💬</h4>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
