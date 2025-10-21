// src/components/UserList.js
import React from "react";
import "./UserList.css";

export default function UserList({ users, onSelect, selectedUser }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div
          key={user._id}
          className={`user-item ${selectedUser?._id === user._id ? "user-selected" : ""}`}
          onClick={() => onSelect(user)}
        >
          <span className={`user-online ${user.online ? "online" : "offline"}`}></span>
          <span className="user-name">{user.username || user.name}</span>
        </div>
      ))}
    </div>
  );
}
