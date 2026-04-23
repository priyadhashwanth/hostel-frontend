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

  const handleRegister = async (e) => {
    // Validation
    e.preventDefault();

    // Empty checks
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !role.trim()
    ) {
      toast.error("Name, Email, Password and Role are required");
      return;
    }

    // Name length
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    // Password
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Phone optional but if entered validate
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }

    if (emergencyPhone && !phoneRegex.test(emergencyPhone)) {
      toast.error("Emergency phone must be 10 digits");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg border outline-none
              ${
                name.length === 0
                  ? "border-gray-300"
                  : name.trim().length >= 3
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />

            {name && name.trim().length < 3 && (
              <p className="text-red-500 text-sm mt-1">
                Minimum 3 characters
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg border outline-none
              ${
                email.length === 0
                  ? "border-gray-300"
                  : emailRegex.test(email)
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />

            {email &&
              !emailRegex.test(email) && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid email
                </p>
              )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400" />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className={`w-full p-3 pl-10 rounded-lg border outline-none
              ${
                password.length === 0
                  ? "border-gray-300"
                  : password.length >= 6
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />

            {password &&
              password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">
                  Minimum 6 characters
                </p>
              )}
          </div>

          {/* Role */}
          <div className="relative">
            <FaUsers className="absolute top-4 left-3 text-gray-400" />

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full border p-3 pl-10 rounded-lg outline-none"
            >
              <option value="resident">
                Resident
              </option>
              <option value="staff">
                Staff
              </option>
              <option value="admin">
                Admin
              </option>
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
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className={`w-full p-3 pl-10 rounded-lg border outline-none
                  ${
                    phone.length === 0
                      ? "border-gray-300"
                      : /^[0-9]{10}$/.test(phone)
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                />

                {phone &&
                  !/^[0-9]{10}$/.test(phone) && (
                    <p className="text-red-500 text-sm mt-1">
                      Enter valid 10 digit number
                    </p>
                  )}
              </div>

              {/* Address */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />

                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className="w-full border p-3 pl-10 rounded-lg outline-none"
                />
              </div>

              {/* Emergency Name */}
              <div className="relative">
                <FaUser className="absolute top-4 left-3 text-gray-400" />

                <input
                  type="text"
                  placeholder="Emergency Name"
                  value={emergencyName}
                  onChange={(e) =>
                    setEmergencyName(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 pl-10 rounded-lg outline-none"
                />
              </div>

              {/* Emergency Phone */}
              <div className="relative">
                <FaPhone className="absolute top-4 left-3 text-gray-400" />

                <input
                  type="text"
                  placeholder="Emergency Phone"
                  value={emergencyPhone}
                  onChange={(e) =>
                    setEmergencyPhone(
                      e.target.value
                    )
                  }
                  className={`w-full p-3 pl-10 rounded-lg border outline-none
                  ${
                    emergencyPhone.length === 0
                      ? "border-gray-300"
                      : /^[0-9]{10}$/.test(
                          emergencyPhone
                        )
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                />

                {emergencyPhone &&
                  !/^[0-9]{10}$/.test(
                    emergencyPhone
                  ) && (
                    <p className="text-red-500 text-sm mt-1">
                      Invalid emergency number
                    </p>
                  )}
              </div>

              {/* Relation */}
              <div className="relative md:col-span-2">
                <FaUsers className="absolute top-4 left-3 text-gray-400" />

                <input
                  type="text"
                  placeholder="Relation"
                  value={relation}
                  onChange={(e) =>
                    setRelation(
                      e.target.value
                    )
                  }
                  className="w-full border p-3 pl-10 rounded-lg outline-none"
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