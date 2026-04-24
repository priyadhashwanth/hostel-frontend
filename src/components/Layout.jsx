import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-6">

        <button
  onClick={() => navigate(-1)}
  className="mb-4 bg-gray-700 text-white px-4 py-2 rounded-lg"
>
  ← Back
</button>

        {children}
      </div>

    </div>
  );
}