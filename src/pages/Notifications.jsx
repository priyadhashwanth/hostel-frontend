import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { FaBell, FaCheckCircle } from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Notifications
      </h1>

      <p className="text-gray-500 mb-6">
        Stay updated with latest hostel alerts 🔔
      </p>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <FaBell className="text-4xl mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No Notifications Found</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 rounded-2xl shadow flex justify-between items-center transition hover:shadow-lg ${
                n.isRead
                  ? "bg-gray-100"
                  : "bg-white border-l-4 border-blue-500"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {n.message}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {!n.isRead ? (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Mark Read
                </button>
              ) : (
                <FaCheckCircle className="text-green-500 text-xl" />
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}