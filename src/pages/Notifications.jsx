import { useEffect, useState } from "react";
import API from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  //  Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  //  Mark as read
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 ml-64 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Notifications </h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded shadow flex justify-between items-center 
              ${n.isRead ? "bg-gray-200" : "bg-white border-l-4 border-blue-500"}`}
            >
              <div>
                <p className="font-medium">{n.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}