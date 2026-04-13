import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Maintenance from "./pages/Maintenance";
import Billing from "./pages/Billing";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";

import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([

  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // 🔐 Protected Routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    )
  },

  {
    path: "/rooms",
    element: (
      <PrivateRoute role="admin">
        <Rooms />
      </PrivateRoute>
    )
  },

  {
    path: "/maintenance",
    element: (
      <PrivateRoute >
        <Maintenance />
      </PrivateRoute>
    )
  },

  {
    path: "/billing",
    element: (
      <PrivateRoute>
        <Billing />
      </PrivateRoute>
    )
  },

  {
    path: "/notifications",
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    )
  },

  {
    path: "/users",
    element: (
      <PrivateRoute role="admin">
        <Users />
      </PrivateRoute>
    )
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
  <App />
  <ToastContainer />
</>
);