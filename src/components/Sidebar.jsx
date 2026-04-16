import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import {toast} from "react-toastify";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"))
  const role = (user?.role || "").toLowerCase();

  const handleLogout = async () => {
  try {
     // 🔥 IMPORTANT

    logout(); // clear localStorage

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);

  } catch (error) {
    toast.error("Logout failed");
  }
};

  return (
    <div className="w-56 h-screen bg-neutral-900 text-white flex flex-col p-5 fixed">

      <h2 className="text-2xl font-bold mb-6">Hostel</h2>

      {/* ✅ ADD HERE 👇 */}
        <div className="bg-gray-800 p-3 rounded mb-6 text-white">
          <p className="font-semibold">
            {user?.name}
          </p>
          <p className="text-xs text-gray-400 capitalize">
            {role}
          </p>
        </div>

      {/* Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Dashboard
      </button>

      {/* Rooms - admin and resident and staff*/}
      { ["admin","staff","resident"].includes(role) && (
        <button
          onClick={() => navigate("/rooms")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Rooms
        </button>
      )}

      {/* Maintenance - admin + staff */}
      {(role === "admin" || role === "staff" || role === "resident") && (
        <button
          onClick={() => navigate("/maintenance")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Maintenance
        </button>
      )}

      {/* Billing - resident+ admin */}
      {["admin", "resident"].includes(role?.toLowerCase()) && (
        <button
          onClick={() => navigate("/billing")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Billing
        </button>
      )}

      {/*reports*/}

      <button 
      onClick={() => navigate("/reports")}
         className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
         >
  Reports
</button>

      {/* Notifications */}
      <button
        onClick={() => navigate("/notifications")}
        className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Notifications
      </button>

      {/*residents */}
      <button
        onClick={() => navigate("/residents")}
        className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Residents
      </button>

      

      {/* Manage Users - admin */}
      {role === "admin" && (
        <button
          onClick={() => navigate("/users")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Manage Users
        </button>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto p-2 rounded bg-red-500 hover:bg-red-600"
      >
        Logout
      </button>

    </div>
  );
}