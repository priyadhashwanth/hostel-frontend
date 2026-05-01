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

    // 🔴 Required fields
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("All required fields must be filled");
      return;
    }

    // 🔴 Name
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    // 🔴 Email
    if (!emailRegex.test(email.trim())) {
      toast.error("Enter valid email");
      return;
    }

    // 🔴 Password
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // 🔴 Confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // 🔴 Role validation
    const validRoles = ["resident", "staff"];
    if (!validRoles.includes(role)) {
      toast.error("Invalid role selected");
      return;
    }

    // 🔴 Phone
    if (phone && !phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }

    // 🔴 Address
   
    if (!address.trim()) {
  toast.error("Address is required");
  return;
}

// Address length
if (address.trim().length < 5) {
  toast.error("Address must be at least 5 characters");
  return;
}

    // 🔴 Emergency (ONLY for resident)
    if (role === "resident") {
      if (!emergencyName.trim() || !emergencyPhone.trim() || !relation.trim()) {
        toast.error("All emergency fields are required");
        return;
      }

      if (!phoneRegex.test(emergencyPhone)) {
        toast.error("Emergency phone must be 10 digits");
        return;
      }
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone || undefined,
        address: address || undefined,
        emergencyContact:
          role === "resident"
            ? {
                name: emergencyName.trim(),
                phone: emergencyPhone,
                relation: relation.trim()
              }
            : undefined
      });

      toast.success("Registered Successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
              required
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
              type="email"
              required
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
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 pl-10 pr-10 rounded-lg outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-3 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Emergency Fields */}
          {role === "resident" && (
            <>
              <input
                type="text"
                placeholder="Emergency Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Emergency Phone"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                placeholder="Relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full border p-3 rounded-lg md:col-span-2"
              />
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}