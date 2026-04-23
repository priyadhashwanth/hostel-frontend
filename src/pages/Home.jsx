import { useNavigate } from "react-router-dom";
import { FaBed, FaMoneyBillWave, FaTools, FaUsers } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold tracking-wide">
          🏠 HostelMS
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center px-6 mt-16">
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          Hostel Management <br /> Made Easy
        </h1>

        <p className="text-xl text-gray-200 max-w-2xl mb-10">
          Smart solution to manage rooms, residents, billing,
          maintenance requests and notifications in one dashboard.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-white text-indigo-700 px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition"
        >
          Get Started 🚀
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 mt-20 pb-20">

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <FaBed className="text-4xl mb-4 text-yellow-300" />
          <h2 className="text-xl font-bold mb-2">Room Allocation</h2>
          <p className="text-gray-200">
            Manage rooms and assign residents easily.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <FaUsers className="text-4xl mb-4 text-green-300" />
          <h2 className="text-xl font-bold mb-2">Residents</h2>
          <p className="text-gray-200">
            Store resident details and room history.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <FaMoneyBillWave className="text-4xl mb-4 text-pink-300" />
          <h2 className="text-xl font-bold mb-2">Billing</h2>
          <p className="text-gray-200">
            Generate bills and track payments instantly.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <FaTools className="text-4xl mb-4 text-blue-300" />
          <h2 className="text-xl font-bold mb-2">Maintenance</h2>
          <p className="text-gray-200">
            Handle repair requests quickly and efficiently.
          </p>
        </div>

      </div>
    </div>
  );
}