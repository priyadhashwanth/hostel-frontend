import axios from "axios";

const API = axios.create({
  baseURL: "https://hostel-backend-sxqd.onrender.com/api",
  timeout:30000
});

// ATTACH token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:",token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;