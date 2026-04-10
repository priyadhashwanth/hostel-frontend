import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-56 w-full p-6 bg-gray-100 min-h-screen">
        {children}
      </div>

    </div>
  );
}