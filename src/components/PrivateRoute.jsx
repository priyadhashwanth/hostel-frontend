import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function PrivateRoute({ children, role }) {
  const user = getUser();


  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // if no role required → allow
  if (!role) {
    return children;
  }

  // normalize role (avoid case issues)
  const userRole = (user.role || "").toLowerCase();
  const requiredRole = role.toLowerCase();

  // allow admin everywhere
  if (userRole === "admin") {
    return children;
  }

  // role match
  if (userRole === requiredRole) {
    return children;
  }

  return <h1>Access Denied</h1>;
}

