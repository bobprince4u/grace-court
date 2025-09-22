import React, { useState } from "react";
import Properties from "/src/components/admin/Properties";
import Testimonials from "/src/components/admin/Testimonials";
import MessagesTable from "/src/components/admin/MessagesTable";
import UserManagement from "/src/components/admin/UserManagement";
import DashboardOverview from "/src/components/admin/DashboardOverview";
import {
  Home,
  BarChart2,
  Calendar,
  DollarSign,
  Users,
  Star,
  CreditCard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👈 needed for redirect

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const navItems = [
    {
      section: "dashboard",
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      section: "properties",
      icon: <Home className="w-5 h-5" />,
      label: "Properties",
    },
    {
      section: "bookings",
      icon: <Calendar className="w-5 h-5" />,
      label: "Bookings",
    },
    {
      section: "pricing",
      icon: <DollarSign className="w-5 h-5" />,
      label: "Pricing Rules",
    },
    {
      section: "messages",
      icon: <Users className="w-5 h-5" />,
      label: "Messages",
    },
    {
      section: "testimonials",
      icon: <Star className="w-5 h-5" />,
      label: "Testimonials",
    },
    {
      section: "payments",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payments",
    },
    {
      section: "users",
      icon: <Users className="w-5 h-5" />,
      label: "User Management",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear JWT
    navigate("/admin", { replace: true }); // redirect to login
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-br from-slate-800 to-slate-700 text-white transform transition-transform duration-300 z-50 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="p-8 border-b border-white/10 text-center">
            <h1 className="text-2xl font-bold">Graceourt</h1>
            <p className="text-sm text-slate-400">Admin Dashboard</p>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex w-full items-center gap-3 px-6 py-3 rounded-md border-l-4 transition ${
                  activeSection === item.section
                    ? "bg-white/10 text-white border-indigo-400"
                    : "text-slate-300 hover:bg-white/10 border-transparent"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout button pinned at bottom */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-6 py-3 rounded-md text-red-400 hover:bg-white/10 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md border text-slate-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <div>
              <h2 className="text-xl font-bold">Welcome, Admin</h2>
              <p className="text-sm text-slate-500">Gracecourt Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md px-3 py-2 text-sm w-64"
            />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded-md px-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 lg:p-10">
          {activeSection === "dashboard" && <DashboardOverview />}
          {activeSection === "properties" && <Properties />}
          {activeSection === "messages" && <MessagesTable />}
          {activeSection === "testimonials" && <Testimonials />}
          {activeSection === "users" && <UserManagement />}

          {activeSection !== "dashboard" &&
            activeSection !== "properties" &&
            activeSection !== "messages" &&
            activeSection !== "testimonials" &&
            activeSection !== "users" && (
              <div className="text-slate-500 mt-6">
                <h2 className="text-xl font-bold mb-2 capitalize">
                  {activeSection}
                </h2>
                <p>This section is under construction.</p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
