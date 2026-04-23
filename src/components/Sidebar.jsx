import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import { toast } from "react-toastify";
import {
  FaHome,
  FaBed,
  FaTools,
  FaMoneyBillWave,
  FaChartBar,
  FaBell,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = (user?.role || "").toLowerCase();

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const menuClass = (path) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
      location.pathname === path
        ? "bg-blue-500 text-white shadow-lg"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col p-5 fixed left-0 top-0 shadow-2xl">

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-400">🏠 Hostel</h1>
        <p className="text-xs text-gray-400 mt-1">
          Management System
        </p>
      </div>

      {/* User Card */}
      <div className="bg-gray-800 rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-md">
        <FaUserCircle className="text-3xl text-blue-400" />
        <div>
          <p className="font-semibold capitalize">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-400 capitalize">
            {role}
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">

        <button
          onClick={() => navigate("/dashboard")}
          className={menuClass("/dashboard")}
        >
          <FaHome /> Dashboard
        </button>

        {["admin", "staff", "resident"].includes(role) && (
          <button
            onClick={() => navigate("/rooms")}
            className={menuClass("/rooms")}
          >
            <FaBed /> Rooms
          </button>
        )}

        {["admin", "staff", "resident"].includes(role) && (
          <button
            onClick={() => navigate("/maintenance")}
            className={menuClass("/maintenance")}
          >
            <FaTools /> Maintenance
          </button>
        )}

        {["admin", "resident"].includes(role) && (
          <button
            onClick={() => navigate("/billing")}
            className={menuClass("/billing")}
          >
            <FaMoneyBillWave /> Billing
          </button>
        )}

        {role === "admin" && (
          <button
            onClick={() => navigate("/reports")}
            className={menuClass("/reports")}
          >
            <FaChartBar /> Reports
          </button>
        )}

        <button
          onClick={() => navigate("/notifications")}
          className={menuClass("/notifications")}
        >
          <FaBell /> Notifications
        </button>

        <button
          onClick={() => navigate("/residents")}
          className={menuClass("/residents")}
        >
          <FaUsers /> Residents
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all py-3 rounded-xl font-semibold shadow-lg"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}