import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-56 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to Hostel Management System</p>
      </div>
    </div>
  );
}
