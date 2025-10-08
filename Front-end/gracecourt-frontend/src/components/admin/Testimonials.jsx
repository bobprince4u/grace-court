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
  Save,
} from "lucide-react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    imageFile: null,
    preview: "",
    message: "",
  });

  const [actionLoading, setActionLoading] = useState({});
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    testimonial: null,
  });

  const [expandedMessages, setExpandedMessages] = useState({});

  const perPage = 3;

  const getId = (t) => t._id || t.id;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoadingFetch(true);
      const res = await axios.get(
        "${import.meta.env.VITE_API_URL}/api/testimonials"
      );
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
        `${import.meta.env.VITE_API_URL}/api/testimonials/${id}/approve`
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
      setLoadingFor(id, true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/testimonials/${id}`
      );

      setTestimonials((prev) => prev.filter((t) => getId(t) !== id));
      if (selectedTestimonial && getId(selectedTestimonial) === id) {
        setSelectedTestimonial(null);
      }
      setDeleteModal({ show: false, testimonial: null });
    } catch (err) {
      console.error("Delete testimonial error:", err);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "Failed to delete testimonial",
      });
      setDeleteModal({ show: false, testimonial: null });
    } finally {
      setLoadingFor(id, false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting testimonial:", newTestimonial);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", newTestimonial.name);
      formData.append("message", newTestimonial.message);
      if (newTestimonial.imageFile) {
        formData.append("image", newTestimonial.imageFile);
      }

      console.log("FormData created");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/testimonials`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Response:", res.data);

      const created = res.data?.testimonial || res.data;
      setTestimonials((prev) => [created, ...prev]);
      setIsAdding(false);
      setNewTestimonial({
        name: "",
        imageFile: null,
        preview: "",
        message: "",
      });
    } catch (err) {
      console.error("Add testimonial error:", err);
      console.error("Error response:", err.response);
      setErrorModal({
        show: true,
        message: err.response?.data?.message || "Failed to save testimonial",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Add Testimonial Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-white shadow rounded-lg p-4"
          >
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block font-semibold">Name</label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      name: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Message</label>
                <textarea
                  value={newTestimonial.message}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      message: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewTestimonial({
                        ...newTestimonial,
                        imageFile: file,
                        preview: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className="w-full"
                />
                {newTestimonial.preview && (
                  <img
                    src={newTestimonial.preview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2 hover:bg-green-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
                  const limit = 80;
                  const isLong = t.message.length > limit;
                  const expanded = expandedMessages[id] || false;
                  const preview = isLong
                    ? t.message.slice(0, limit) + "..."
                    : t.message;

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
                      <td className="px-4 py-2 max-w-xs">
                        <p>{expanded ? t.message : preview}</p>
                        {isLong && (
                          <button
                            onClick={() => toggleExpand(id)}
                            className="text-blue-600 text-sm focus:outline-none"
                          >
                            {expanded ? "Read less" : "Read more"}
                          </button>
                        )}
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
                          onClick={() =>
                            setDeleteModal({ show: true, testimonial: t })
                          }
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

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-bold mb-2">Error</h3>
            <p className="mb-4">{errorModal.message}</p>
            <button
              onClick={() => setErrorModal({ show: false, message: "" })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.testimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete the testimonial from{" "}
              <span className="font-semibold">
                {deleteModal.testimonial.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({ show: false, testimonial: null })
                }
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteTestimonial(getId(deleteModal.testimonial))
                }
                disabled={actionLoading[getId(deleteModal.testimonial)]}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading[getId(deleteModal.testimonial)] ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Testimonial Details</h3>
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedTestimonial.image || placeholder}
                alt={selectedTestimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">
                  {selectedTestimonial.name}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    getStatus(selectedTestimonial) === "Pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {getStatus(selectedTestimonial)}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="font-semibold mb-2">Message:</p>
              <p className="text-gray-700">{selectedTestimonial.message}</p>
            </div>
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
