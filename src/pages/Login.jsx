import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {toast} from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      // store token
      localStorage.setItem("token", res.data.token);

      // store user
localStorage.setItem("user", JSON.stringify(res.data.user));
   
    //toast instead of alert

      toast.success("Login successful");

      // redirect
      setTimeout(()=>{
    navigate("/dashboard");
      },1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/register")}
      >
        Don't have account? Register
      </p>
    </div>
  );
}
