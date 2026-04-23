import { FaBed, FaUsers, FaTools, FaMoneyBillWave } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";

export default function Dashboard() {
  const cards = [
    {
      title: "Total Rooms",
      value: 25,
      icon: <FaBed size={28} />,
      color: "bg-blue-500"
    },
    {
      title: "Residents",
      value: 68,
      icon: <FaUsers size={28} />,
      color: "bg-green-500"
    },
    {
      title: "Maintenance",
      value: 7,
      icon: <FaTools size={28} />,
      color: "bg-yellow-500"
    },
    {
      title: "Revenue",
      value: "₹1,25,000",
      icon: <FaMoneyBillWave size={28} />,
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
        Welcome to Hostel Management System 👋
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500">{item.title}</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-700">
                  {item.value}
                </h2>
              </div>

              <div
                className={`${item.color} text-white p-4 rounded-xl`}
              >
                {item.icon}
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Recent Activities
          </h2>

          <ul className="space-y-3 text-gray-600">
            <li>✅ Room 101 assigned to Priya</li>
            <li>🔧 Fan repair completed</li>
            <li>💰 Bill paid by Santhosh</li>
            <li>🛏 Room 104 available now</li>
          </ul>
        </div>

        {/* Right */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Quick Summary
          </h2>

          <div className="space-y-4 text-gray-600">
            <p>🏠 Occupancy Rate: <b>82%</b></p>
            <p>💵 Pending Bills: <b>₹12,500</b></p>
            <p>🛠 Open Requests: <b>7</b></p>
            <p>👨‍🎓 New Residents This Month: <b>12</b></p>
          </div>
        </div>

      </div>
    </div>
    </Layout>
  );
}