// src/components/ChatInput.js
import React, { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import "./ChatInput.css";

export default function ChatInput({ socket, currentUser, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [typingStatus, setTypingStatus] = useState("");
  const inputRef = useRef();

  // Emoji select
  const onEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  // File select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Send message
  const handleSend = () => {
    if (!message && !selectedFile) return;
    onSendMessage({ text: message, file: selectedFile });
    setMessage("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowEmoji(false);
    if (socket) socket.emit("stopTyping");
  };

  // Detect typing
  const handleInput = (e) => {
    setMessage(e.target.value);
    if (socket) socket.emit("typing", { user: currentUser });
  };

  // Stop typing after 2s idle
  useEffect(() => {
    if (!socket) return;
    const timeout = setTimeout(() => {
      socket.emit("stopTyping");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [message, socket]);

  // Listen typing from other users
  useEffect(() => {
    if (!socket) return;
    socket.on("displayTyping", (status) => setTypingStatus(status));
    return () => socket.off("displayTyping");
  }, [socket]);

  // Hide emoji picker when input is focused
  useEffect(() => {
    const inputEl = inputRef.current;
    const handleFocus = () => setShowEmoji(false);
    inputEl.addEventListener("focus", handleFocus);
    return () => inputEl.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="chat-input-container">
      {/* Image preview */}
      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="preview" className="preview-image" />
          <button onClick={() => setPreviewUrl(null)} className="remove-btn">✕</button>
        </div>
      )}

      <div className="input-row">
        <button
          className="emoji-btn"
          onClick={() => setShowEmoji(prev => !prev)}
        >😊</button>

        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInput}
          placeholder="Type a message..."
          className="chat-input"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <button onClick={handleSend} className="send-btn">Send</button>
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="emoji-picker-wrapper">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* Typing indicator */}
      {typingStatus && <div className="typing-indicator">{typingStatus}</div>}
    </div>
  );
}
