import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import TermsAndConditions from "./pages/Terms&Conditions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PropertyDetailPage from "./components/properties/PropertyDetailPage";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin");

  return (
    <div>
      {/* Hide Navbar on admin routes */}
      {!isAdminPath && <Navbar />}

      <div className="min-h-[70vh]">
        <Routes>
          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
