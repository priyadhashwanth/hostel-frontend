import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import  {toast} from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password
      });

      toast.success("Registered successfully");

      // go to login
      serTimeout(()=>{
        navigate("/");
      },1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleRegister}>Register</button>

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/")}
      >
        Already have account? Login
      </p>
    </div>
  );
}
