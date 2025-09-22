import React, { useEffect, useState } from "react";
import { Trash2, XCircle } from "lucide-react";

const MessagesTable = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search + Pagination states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  // Sorting states
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Delete confirmation modal states
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
      setConfirmDelete(null); // close modal
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) =>
    [msg.name, msg.email, msg.message]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sort messages
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "createdAt") {
      valA = new Date(a.createdAt);
      valB = new Date(b.createdAt);
    } else {
      valA = valA?.toString().toLowerCase();
      valB = valB?.toString().toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentMessages = sortedMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedMessages.length / perPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {sortedMessages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th
                  className="px-4 py-3 border-b cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortField === "name"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Phone</th>
                <th className="px-4 py-3 border-b">Message</th>
                <th
                  className="px-4 py-3 border-b cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("createdAt")}
                >
                  Date{" "}
                  {sortField === "createdAt"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((msg, i) => (
                <tr
                  key={msg._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 border-b">{msg.name}</td>
                  <td className="px-4 py-3 border-b">{msg.email}</td>
                  <td className="px-4 py-3 border-b">{msg.phone || "N/A"}</td>
                  <td className="px-4 py-3 border-b">{msg.message}</td>
                  <td className="px-4 py-3 border-b text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    <button
                      onClick={() => setConfirmDelete(msg._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirst + 1} -{" "}
              {Math.min(indexOfLast, sortedMessages.length)} of{" "}
              {sortedMessages.length}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changePage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
              <XCircle className="w-6 h-6" /> Confirm Delete
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesTable;
