import { useNavigate } from "react-router-dom";
import { getUser, logout as doLogout } from "../utils/auth";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = getUser();
  const role = (user?.role || "").toLowerCase();

  const logout = () => {
    doLogout();
    navigate("/login");
  };

  return (
    <div className="w-56 h-screen bg-neutral-900 text-white flex flex-col p-5 fixed">

      <h2 className="text-2xl font-bold mb-6">Hostel</h2>

      {/* Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Dashboard
      </button>

      {/* Rooms - admin */}
      {role === "admin" && (
        <button
          onClick={() => navigate("/rooms")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Rooms
        </button>
      )}

      {/* Maintenance - admin + staff */}
      {(role === "admin" || role === "staff") && (
        <button
          onClick={() => navigate("/maintenance")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Maintenance
        </button>
      )}

      {/* Billing - resident */}
      {role === "resident" && (
        <button
          onClick={() => navigate("/billing")}
          className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
        >
          Billing
        </button>
      )}

      {/* Notifications */}
      <button
        onClick={() => navigate("/notifications")}
        className="mb-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        Notifications
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
        onClick={logout}
        className="mt-auto p-2 rounded bg-red-500 hover:bg-red-600"
      >
        Logout
      </button>

    </div>
  );
}