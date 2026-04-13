import Sidebar from "./Sidebar";
import  {getUser,getRole} from "../utils/auth";

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