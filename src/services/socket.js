import { io } from "socket.io-client";

export const socket = io("https://samvaadd.vercel.app/", {
  withCredentials: true,
  transports: ["websocket"],
});