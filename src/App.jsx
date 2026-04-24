import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
 import Dashboard from "./pages/Dashboard";
 import Rooms from "./pages/Rooms";
import Maintenance from "./pages/Maintenance";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Residents from "./pages/Residents";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
          <Route path="/maintenance" element={<Maintenance/>} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} /> 
           <Route path="/notifications" element={<Notifications />} /> 
           <Route path="/residents" element={<Residents/>} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
