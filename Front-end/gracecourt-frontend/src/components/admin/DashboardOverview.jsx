/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaMoneyBillWave,
  FaCalendarWeek,
  FaCalendarAlt,
  FaBed,
  FaUsers,
  FaExclamationTriangle,
  FaRegCreditCard,
  FaHotel,
  FaStar,
} from "react-icons/fa";

export default function DashboardOverview() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = [
    {
      id: 1,
      guest: "Ikenga Doe",
      room: "Deluxe Suite",
      date: "2025-09-01",
      status: "Checked In",
    },
    {
      id: 2,
      guest: "Adamu Smith",
      room: "Standard Room",
      date: "2025-09-01",
      status: "Pending",
    },
    {
      id: 3,
      guest: "Michael Darasimi",
      room: "Executive Room",
      date: "2025-08-31",
      status: "Checked Out",
    },
  ];

  const bookingTrends = [
    { name: "Mon", bookings: 5 },
    { name: "Tue", bookings: 8 },
    { name: "Wed", bookings: 6 },
    { name: "Thu", bookings: 10 },
    { name: "Fri", bookings: 7 },
    { name: "Sat", bookings: 12 },
    { name: "Sun", bookings: 9 },
  ];

  // Grouped KPI data
  const groups = [
    {
      title: "Operations",
      color: "blue",
      stats: [
        {
          label: "Occupancy Rate",
          value: "78%",
          icon: <FaBed className="text-blue-500 text-2xl" />,
        },
        {
          label: "Active Guests",
          value: "32",
          icon: <FaUsers className="text-blue-500 text-2xl" />,
        },
        {
          label: "Pending Payments",
          value: "5",
          icon: <FaRegCreditCard className="text-blue-500 text-2xl" />,
        },
      ],
    },
    {
      title: "Portfolio",
      color: "purple",
      stats: [
        {
          label: "Total Properties",
          value: "15",
          icon: <FaHotel className="text-purple-500 text-2xl" />,
        },
        {
          label: "Rooms Available",
          value: "120",
          icon: <FaBed className="text-purple-500 text-2xl" />,
        },
        {
          label: "Testimonials",
          value: "45",
          icon: <FaStar className="text-purple-500 text-2xl" />,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Groups */}
      {groups.map((group, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-4 mb-6 border-l-4 ${
            group.color === "green"
              ? "bg-green-50 border-green-400"
              : group.color === "blue"
              ? "bg-blue-50 border-blue-400"
              : "bg-purple-50 border-purple-400"
          }`}
        >
          <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
            {group.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {group.stats.map((card, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div>{card.icon}</div>
                <div>
                  <p className="text-slate-500 text-sm">{card.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Recent Bookings + Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Guest</th>
                <th className="py-2">Room</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-2">{b.guest}</td>
                  <td className="py-2">{b.room}</td>
                  <td className="py-2">{b.date}</td>
                  <td className="py-2">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingTrends}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-96"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <p>
                <strong>Guest:</strong> {selectedBooking.guest}
              </p>
              <p>
                <strong>Room:</strong> {selectedBooking.room}
              </p>
              <p>
                <strong>Date:</strong> {selectedBooking.date}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
