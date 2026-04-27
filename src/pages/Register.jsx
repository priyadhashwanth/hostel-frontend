import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaUsers,
  FaSignInAlt,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("resident");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [relation, setRelation] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    // Required fields
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Name, Email and Password are required");
      return;
    }

    // Name
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    // Email
    if (!emailRegex.test(email)) {
      toast.error("Enter valid email");
      return;
    }

    // Password
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Confirm Password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Phone
    if (phone && !phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }

    if (emergencyPhone && !phoneRegex.test(emergencyPhone)) {
      toast.error("Emergency phone must be 10 digits");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
        phone: phone || undefined,
        address: address || undefined,
        emergencyContact: emergencyName
          ? {
              name: emergencyName,
              phone: emergencyPhone,
              relation
            }
          : undefined
      });

      toast.success("Registered Successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-900 p-4">

      <form
        onSubmit={handleRegister}
        className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8 max-h-[95vh] overflow-y-auto"
      >
        <h1 className="text-4xl font-bold text-center text-gray-700">
          Create Account 🚀
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Register to Hostel Management System
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 pl-10 pr-10 rounded-lg outline-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            />
          </div>

          {/* Role */}
          <div className="relative">
            <FaUsers className="absolute top-4 left-3 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            >
              <option value="resident">Resident</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhone className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            />
          </div>

          {/* Address */}
          <div className="relative md:col-span-2">
            <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            />
          </div>

          {/* Resident Extra Fields */}
          {role === "resident" && (
            <>
              <div className="relative">
                <FaUser className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Emergency Name"
                  value={emergencyName}
                  onChange={(e) =>
                    setEmergencyName(e.target.value)
                  }
                  className="w-full border p-3 pl-10 rounded-lg outline-none"
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Emergency Phone"
                  value={emergencyPhone}
                  onChange={(e) =>
                    setEmergencyPhone(e.target.value)
                  }
                  className="w-full border p-3 pl-10 rounded-lg outline-none"
                />
              </div>

              <div className="relative md:col-span-2">
                <FaUsers className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Relation"
                  value={relation}
                  onChange={(e) =>
                    setRelation(e.target.value)
                  }
                  className="w-full border p-3 pl-10 rounded-lg outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <FaSignInAlt />
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login */}
        <p className="text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}