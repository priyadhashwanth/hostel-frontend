import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

  // Empty check
  if (!email.trim() || !password.trim()) {
    toast.error("Email and Password are required");
    return;
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    toast.error("Enter a valid email address");
    return;
  }

  // Password length
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

    try {
      

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-2">
            Login to Hostel Management System
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-left text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <div className="flex items-center border rounded-lg px-3">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-left text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div className="flex items-center border rounded-lg px-3">
            <FaLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 outline-none"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex justify-center items-center gap-2"
        >
          <FaSignInAlt />
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p
          className="text-center text-gray-500 mt-6 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don’t have an account?{" "}
          <span className="text-blue-600 font-semibold hover:underline">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}