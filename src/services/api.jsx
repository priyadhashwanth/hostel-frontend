import axios from "axios";

const API = axios.create({
  baseURL: "https://https://hostel-backend-production-70c4.up.railway.app//api"
  
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