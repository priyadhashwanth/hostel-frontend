import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function PrivateRoute({ children, allowedRoles }) {
  const user = getUser();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const userRole = (user.role || "").toLowerCase();

  // If no role restriction
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Normalize roles
  const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

  // Check access
  if (!normalizedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  if(userRole==="admin"){
  return children;
  }
}