import React from "react";
import { Navigate } from "react-router-dom";
import AdminAuth from "/src/components/admin/AdminAuth";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in → show login/signup page
    return <AdminAuth />;
  }

  // Logged in → show dashboard
  return children;
}
