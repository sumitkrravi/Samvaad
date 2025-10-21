import axios from "axios";

const API = axios.create({
  baseURL: "https://samvaad-backend-925t.onrender.com/api",
});

export default API;
