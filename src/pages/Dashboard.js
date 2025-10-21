import React, { useEffect, useState } from "react";
import API from "../services/api";
import { socket } from "../services/socket";
import ChatBox from "../components/ChatBox";
import UserList from "../components/UserList";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const formatUsername = (username) =>
  username
    ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
    : "";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // ✅ Fetch current user
    API.get("/me")
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error(err));

    // ✅ Fetch all users
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [navigate]);

  // ✅ Socket.io setup for online/offline tracking
  useEffect(() => {
    if (currentUser?._id) {
      // Inform backend that this user is online
      socket.emit("new-user-add", currentUser._id);
    }

    // Listen for active users update from server
    socket.on("get-users", (activeUsers) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => ({
          ...u,
          online: activeUsers.some((au) => au.userId === u._id),
        }))
      );
    });

    return () => {
      socket.off("get-users");
    };
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      {/* 🔹 Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            alt="User"
            className="profile-pic-small"
          />
          <span className="username">
            {currentUser
              ? formatUsername(currentUser.username)
              : "Samvaad | संवाद"}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* 🔹 Main Section */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="user-list-section">
            <h6>Chats</h6>
            <UserList
              users={users}
              onSelect={setSelectedUser}
              selectedUser={selectedUser}
            />
          </div>
        </aside>

        {/* Chat Section */}
        <main className="chat-section">
          {selectedUser ? (
            <ChatBox selectedUser={selectedUser} currentUser={currentUser} />
          ) : (
            <div className="no-chat-selected">
              <img
                src="https://cdn-icons-png.flaticon.com/512/134/134914.png"
                alt="chat"
                className="chat-illustration"
              />
              <h4>Select a user to start chatting 💬</h4>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
