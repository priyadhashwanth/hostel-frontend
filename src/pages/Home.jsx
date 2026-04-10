import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center text-white">

      {/* Title */}
      <h1 className="text-5xl font-bold mb-4">
        Hostel Management System
      </h1>

      <p className="text-lg mb-8 text-center max-w-xl">
        Manage rooms, residents, billing, and maintenance easily in one place.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Register
        </button>
      </div>

    </div>
  );
}