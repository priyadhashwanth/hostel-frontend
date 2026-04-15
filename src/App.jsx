import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
 import Dashboard from "./pages/Dashboard";
 import Rooms from "./pages/Rooms";
import Maintenance from "./pages/Maintenance";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
          <Route path="/maintenance" element={<Maintenance/>} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} /> 
           <Route path="/notifications" element={<Notifications />} /> 


      </Routes>
    </BrowserRouter>
  );
}

export default App;
