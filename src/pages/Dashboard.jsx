import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { getUser } from "../utils/auth";

import {
  FaBed,
  FaUsers,
  FaTools,
  FaMoneyBillWave
} from "react-icons/fa";

export default function Dashboard() {
  const user = getUser();
  const role = user?.role;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let res;

        if (role === "admin") {
          res = await API.get("/users/admin-dashboard");
        } else if (role === "resident") {
          res = await API.get("/users/resident-dashboard");
        }

        setData(res?.data || {});
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (role) fetchDashboard();
  }, [role]);

  // 🔄 Loading UI
  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-lg">Loading dashboard...</div>
      </Layout>
    );
  }

  // 🔥 ADMIN CARDS (clean version)
  const adminCards = [
    {
      title: "Total Rooms",
      value: data?.totalRooms || 0,
      icon: <FaBed size={26} />,
      color: "bg-blue-500"
    },
    {
      title: "Residents",
      value: data?.totalResidents || 0,
      icon: <FaUsers size={26} />,
      color: "bg-green-500"
    },
    {
      title: "Maintenance",
      value: data?.maintenanceCount || 0,
      icon: <FaTools size={26} />,
      color: "bg-yellow-500"
    },
    {
      title: "Revenue",
      value: `₹${data?.revenue || 0}`,
      icon: <FaMoneyBillWave size={26} />,
      color: "bg-purple-500"
    }
  ];

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-700 mb-2">
          Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          Welcome {user?.name} 👋
        </p>

        {/* ================= ADMIN DASHBOARD ================= */}
        {role === "admin" && (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminCards.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-500">{item.title}</p>
                    <h2 className="text-2xl font-bold text-gray-700">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`${item.color} text-white p-3 rounded-lg`}>
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Info */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-3">
                Admin Panel
              </h2>
              <p className="text-gray-600">
                You can manage rooms, users, reports, and finances here.
              </p>
            </div>
          </>
        )}

        {/* ================= RESIDENT DASHBOARD ================= */}
        {role === "resident" && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">

    {/* ===== Your Details ===== */}
    <div>
      <h2 className="text-xl font-bold mb-3">Your Details</h2>

      <p>
        <span className="font-semibold">Name:</span>{" "}
        {data?.user?.name || "N/A"}
      </p>

      <p>
        <span className="font-semibold">Room:</span>{" "}
        {data?.user?.room?.roomNumber || "Not Assigned"}
      </p>
    </div>

    {/* ===== Bills ===== */}
    <div>
      <h3 className="text-lg font-semibold">Bills</h3>

      {data?.bills?.length > 0 ? (
        <div className="space-y-3 mt-2">
          {data.bills.map((bill) => (
            <div
              key={bill._id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <span className="font-semibold text-gray-800">
                ₹ {new Intl.NumberFormat("en-IN").format(bill.totalAmount)}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bill.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {bill.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No bills found</p>
      )}
    </div>

    {/* ===== Maintenance ===== */}
    <div>
      <h3 className="text-lg font-semibold">Maintenance Requests</h3>

      <div className="space-y-2 mt-2">
        {data?.maintenance?.map((m) => (
          <div
            key={m._id}
            className="flex justify-between bg-gray-50 p-3 rounded-lg"
          >
            <span>{m.title}</span>

            <span
              className={`text-sm font-medium ${
                m.status === "completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {m.status}
            </span>
          </div>
        ))}
      </div>
    </div>

  </div>
)}

      </div>
    </Layout>
  );
}