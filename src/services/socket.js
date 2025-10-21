import { io } from "socket.io-client";

export const socket = io("https://samvaad-backend-925t.onrender.com", {
  transports: ["websocket"],
});
