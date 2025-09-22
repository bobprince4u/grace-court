/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import adminImg from "../../assets/adminImg.webp";
import logo from "../../assets/logo.png";

export default function AdminAuth() {
  const [isSignupAllowed, setIsSignupAllowed] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adminCreated = localStorage.getItem("adminCreated");
    if (adminCreated) {
      setIsSignupAllowed(false);
      setIsSignup(false);
    }

    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignup) {
        await axios.post("http://localhost:5000/api/auth/signup", {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccess("Admin account created. Please log in.");
        localStorage.setItem("adminCreated", "true");
        setIsSignupAllowed(false);
        setIsSignup(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/signin", {
          email: formData.email,
          password: formData.password,
        });

        const token = res.data.token;
        if (token) {
          localStorage.setItem("token", token);
          setSuccess("Logged in successfully");
          navigate("/admin");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left Side */}
        <div className="relative w-1/2 h-auto min-h-[500px] bg-cover bg-center hidden md:block">
          <img
            src={adminImg}
            alt="Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80 flex flex-col justify-end p-6 text-white">
            <h2 className="text-2xl font-semibold">
              Easy to Manage Properties
            </h2>
            <p className="text-sm">Secure access to your admin dashboard</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-8 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignup ? "Create Account" : "Admin Login"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isSignup ? "Start Here" : "Welcome back, please log in"}
          </p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Animate presence of signup fields */}
            <AnimatePresence>
              {isSignup && (
                <motion.div
                  key="name-input"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>
          </form>

          {isSignupAllowed && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className="text-green-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="text-green-600 hover:underline"
                  >
                    Create Admin
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
