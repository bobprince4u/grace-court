/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Trash2,
  X,
  Loader2,
  MessageSquare,
} from "lucide-react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    imageFile: null,
    preview: "",
    message: "",
  });

  const [actionLoading, setActionLoading] = useState({});
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });

  const perPage = 3;

  const getId = (t) => t._id || t.id;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoadingFetch(true);
      const res = await axios.get("http://localhost:5000/api/testimonials");
      const data = res.data;
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.testimonials)) list = data.testimonials;
      else if (Array.isArray(data.data)) list = data.data;
      setTestimonials(list);
    } catch (err) {
      console.error("Fetch testimonials error:", err);
      setErrorModal({
        show: true,
        message:
          err.response?.data?.message ||
          "Failed to load testimonials. Check server.",
      });
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    return () => {
      if (newTestimonial.preview) {
        URL.revokeObjectURL(newTestimonial.preview);
      }
    };
  }, [newTestimonial.preview]);

  const getStatus = (t) => (t?.approved ? "Approved" : "Pending");

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch = t.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const status = getStatus(t);
      const matchesStatus = filterStatus === "All" || status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchTerm, filterStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTestimonials.length / perPage)
  );
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentTestimonials = filteredTestimonials.slice(
    indexOfFirst,
    indexOfLast
  );

  const setLoadingFor = (id, val) =>
    setActionLoading((prev) => ({ ...prev, [id]: !!val }));

  const approveTestimonial = async (id) => {
    try {
      setLoadingFor(id, true);
      const res = await axios.patch(
        `http://localhost:5000/api/testimonials/${id}/approve`
      );

      const updated = res.data?.testimonial;
      if (updated) {
        setTestimonials((prev) =>
          prev.map((t) => (getId(t) === id ? updated : t))
        );
        if (selectedTestimonial && getId(selectedTestimonial) === id) {
          setSelectedTestimonial(updated);
        }
      }
    } catch (err) {
      console.error("Approve error:", err);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "Failed to approve testimonial",
      });
    } finally {
      setLoadingFor(id, false);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this testimonial?"))
        return;
      setLoadingFor(id, true);
      await axios.delete(`http://localhost:5000/api/testimonials/${id}`);

      setTestimonials((prev) => prev.filter((t) => getId(t) !== id));
      if (selectedTestimonial && getId(selectedTestimonial) === id) {
        setSelectedTestimonial(null);
      }
    } catch (err) {
      console.error("Delete testimonial error:", err);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "Failed to delete testimonial",
      });
    } finally {
      setLoadingFor(id, false);
    }
  };

  const handleAddNew = async () => {
    if (!newTestimonial.name || !newTestimonial.message) {
      setErrorModal({ show: true, message: "Name and message are required." });
      return;
    }
    if (newTestimonial.message.trim().length < 20) {
      setErrorModal({
        show: true,
        message: "Message must be at least 20 characters long.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newTestimonial.name.trim());
    formData.append("message", newTestimonial.message.trim());
    if (newTestimonial.imageFile)
      formData.append("image", newTestimonial.imageFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/testimonials",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const created = res.data?.testimonial || res.data;
      if (created) {
        setTestimonials((prev) => [created, ...prev]);
      } else {
        await fetchTestimonials();
      }

      if (newTestimonial.preview) {
        URL.revokeObjectURL(newTestimonial.preview);
      }

      setNewTestimonial({
        name: "",
        imageFile: null,
        preview: "",
        message: "",
      });
      setIsAdding(false);
    } catch (err) {
      console.error("Add testimonial error:", err);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "Failed to add testimonial",
      });
    }
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (newTestimonial.preview) URL.revokeObjectURL(newTestimonial.preview);
    const preview = URL.createObjectURL(file);
    setNewTestimonial((s) => ({ ...s, imageFile: file, preview }));
  };

  const closeAddModal = () => {
    if (newTestimonial.preview) URL.revokeObjectURL(newTestimonial.preview);
    setNewTestimonial({ name: "", imageFile: null, preview: "", message: "" });
    setIsAdding(false);
  };

  const placeholder = "https://via.placeholder.com/80?text=User";

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          Manage Testimonials
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name..."
            className="border pl-8 pr-3 py-2 rounded w-64"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <select
            className="border pl-8 pr-3 py-2 rounded"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loadingFetch ? (
        <div className="text-center py-10 text-gray-500 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading testimonials...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-4 py-2">Customer</th>
                  <th className="text-left px-4 py-2">Message</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTestimonials.map((t) => {
                  const status = getStatus(t);
                  const id = getId(t);
                  return (
                    <tr
                      key={id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={t.image || placeholder}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{t.name}</span>
                      </td>
                      <td className="px-4 py-2 truncate max-w-xs">
                        {t.message}
                      </td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          status === "Pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {status}
                      </td>
                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedTestimonial(t)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>

                        <button
                          onClick={() => approveTestimonial(id)}
                          disabled={actionLoading[id]}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading[id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </button>

                        <button
                          onClick={() => deleteTestimonial(id)}
                          disabled={actionLoading[id]}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading[id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {currentTestimonials.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-slate-500 py-4">
                      No testimonials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 py-1">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ➕ Add Testimonial Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                onClick={closeAddModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-4">Add New Testimonial</h3>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Customer name"
                  value={newTestimonial.name}
                  onChange={(e) =>
                    setNewTestimonial((s) => ({ ...s, name: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                />

                <textarea
                  placeholder="Message"
                  rows="4"
                  value={newTestimonial.message}
                  onChange={(e) =>
                    setNewTestimonial((s) => ({
                      ...s,
                      message: e.target.value,
                    }))
                  }
                  className="border px-3 py-2 rounded"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewImageChange}
                />
                {newTestimonial.preview && (
                  <img
                    src={newTestimonial.preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}

                <button
                  onClick={handleAddNew}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👁 View Testimonial Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <img
                  src={selectedTestimonial.image || placeholder}
                  alt={selectedTestimonial.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold mb-2">
                  {selectedTestimonial.name}
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedTestimonial.message}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      approveTestimonial(getId(selectedTestimonial))
                    }
                    disabled={actionLoading[getId(selectedTestimonial)]}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
                  >
                    {actionLoading[getId(selectedTestimonial)] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      deleteTestimonial(getId(selectedTestimonial))
                    }
                    disabled={actionLoading[getId(selectedTestimonial)]}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                  >
                    {actionLoading[getId(selectedTestimonial)] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ Error Modal */}
      <AnimatePresence>
        {errorModal.show && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setErrorModal({ show: false, message: "" })}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-2">Error</h3>
              <p className="text-gray-600">{errorModal.message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
