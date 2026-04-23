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
  FaSignInAlt
} from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [relation, setRelation] = useState("");

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) return toast.error("Name required");

    if (!email.includes("@"))
      return toast.error("Enter valid email");

    if (password.length < 6)
      return toast.error("Password must be minimum 6 characters");

    if (role === "resident" && phone.length !== 10)
      return toast.error("Phone must be 10 digits");

    try {
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

      toast.success("Registered successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-900 p-6">

      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-8 max-h-[95vh] overflow-y-auto">

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
              className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="relative">
            <FaUsers className="absolute top-4 left-3 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="resident">Resident</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Resident Fields */}
          {role === "resident" && (
            <>
              {/* Phone */}
              <div className="relative">
                <FaPhone className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Emergency Name */}
              <div className="relative">
                <FaUser className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Emergency Name"
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setEmergencyName(e.target.value)}
                />
              </div>

              {/* Emergency Phone */}
              <div className="relative">
                <FaPhone className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Emergency Phone"
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>

              {/* Relation */}
              <div className="relative md:col-span-2">
                <FaUsers className="absolute top-4 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Relation"
                  className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setRelation(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 transition text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <FaSignInAlt />
          Register
        </button>

        {/* Login Link */}
        <p className="text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}