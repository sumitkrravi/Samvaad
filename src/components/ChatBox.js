// src/components/ChatBox.js
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../services/socket";
import API from "../services/api";
import "./ChatBox.css";
import { FaPaperPlane, FaSmile, FaPaperclip, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

export default function ChatBox({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    // Fetch previous chat messages
    API.get(`/messages/${selectedUser._id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    // Listen to incoming messages
    socket.on("receiveMessage", (msg) => {
      if (msg.from === selectedUser._id || msg.to === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() && !selectedImage) return;
    if (!currentUser) return;

    const msg = {
      from: currentUser._id,
      to: selectedUser._id,
      text,
      image: selectedImage,
      time: new Date(),
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
    setSelectedImage(null);
    setShowEmoji(false);
  };

  const handleEmojiClick = (emojiData) => setText(prev => prev + emojiData.emoji);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="chat-user">
          <img
            src={selectedUser.avatar || "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"}
            alt="user"
          />
          <div>
            <h6>{selectedUser.username || selectedUser.name}</h6>
            <small>{selectedUser.online ? "Online" : "Offline"}</small>
          </div>
        </div>
      </div>

      <div className="chatbox-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from === currentUser._id ? "sent" : "received"}`}>
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <img src={msg.image} alt="sent" className="chat-image" />}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {selectedImage && (
        <div className="image-preview">
          <img src={selectedImage} alt="preview" />
          <button className="remove-img-btn" onClick={() => setSelectedImage(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="chatbox-footer">
        <button className="icon-btn" onClick={() => setShowEmoji(!showEmoji)}>
          <FaSmile />
        </button>
        {showEmoji && <div className="emoji-picker"><EmojiPicker onEmojiClick={handleEmojiClick} /></div>}

        <button className="icon-btn" onClick={() => fileInputRef.current.click()}>
          <FaPaperclip />
        </button>
        <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="send-btn" onClick={sendMessage}><FaPaperPlane /></button>
      </div>
    </div>
  );
}
