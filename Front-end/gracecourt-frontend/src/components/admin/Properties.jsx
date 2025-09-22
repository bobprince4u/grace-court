import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Home,
  MapPin,
  Bed,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    location: "",
    rooms: "",
    amenities: "",
    description: "",
    status: "active",
    propertyImage: [],
    oldImages: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const perPage = 6;

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/properties")
      .then((res) => {
        setProperties(res.data.properties || []);
      })
      .catch(() => setError("Failed to fetch properties"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = filterLocation
        ? p.location === filterLocation
        : true;
      return matchesSearch && matchesLocation;
    });
  }, [properties, searchQuery, filterLocation]);

  const totalPages = Math.ceil(filteredProperties.length / perPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const resetForm = () => {
    setFormState({
      name: "",
      location: "",
      rooms: "",
      amenities: "",
      description: "",
      status: "active",
      propertyImage: [],
      oldImages: [],
    });
    setEditingProperty(null);
  };

  const handleEdit = (property) => {
    setEditingProperty(property._id || property.id);
    setFormState({
      name: property.name || "",
      location: property.location || "",
      rooms: property.rooms || "",
      amenities: (property.amenities || []).join(", "),
      description: property.description || "",
      status: property.status || "active",
      propertyImage: [],
      oldImages: property.propertyImage || [],
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      setConfirmDelete(null);
    } catch {
      alert("Failed to delete property");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormState((prev) => ({
      ...prev,
      propertyImage: files,
    }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("location", formState.location);
    formData.append("rooms", formState.rooms);
    formData.append("description", formState.description);
    formData.append("status", formState.status);
    if (formState.amenities.trim()) {
      formData.append("amenities", formState.amenities);
    }
    formState.propertyImage.forEach((file) => {
      formData.append("propertyImage", file);
    });

    try {
      if (editingProperty && editingProperty !== "new") {
        const res = await axios.put(
          `http://localhost:5000/api/properties/${editingProperty}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProperties((prev) =>
          prev.map((p) => (p._id === editingProperty ? res.data.property : p))
        );
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/properties",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProperties((prev) => [res.data.property, ...prev]);
      }
      resetForm();
    } catch {
      alert("Failed to save property");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 flex justify-between items-center">
        Manage Properties
        <button
          onClick={() => setEditingProperty("new")}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition cursor-pointer shadow-md"
        >
          <Plus size={18} /> Add Property
        </button>
      </h2>

      {/* Search / Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center border rounded-lg shadow-sm p-2 flex-1 bg-white">
          <Home className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            className="outline-none flex-1"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center border rounded-lg shadow-sm p-2 bg-white">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <select
            className="outline-none bg-transparent"
            value={filterLocation}
            onChange={(e) => {
              setFilterLocation(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Locations</option>
            {[...new Set(properties.map((p) => p.location))].map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedProperties.map((property) => (
          <div
            key={property._id || property.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-5 flex flex-col"
          >
            <div className="flex gap-2 mb-4 flex-wrap">
              {(property.propertyImage || []).length > 0 ? (
                property.propertyImage.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                ))
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm shadow-sm">
                  <ImageIcon size={20} />
                </div>
              )}
            </div>

            <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2 text-sm">
              <span className="px-3 py-1 rounded-full shadow-sm bg-blue-100 text-blue-700 flex items-center gap-1">
                <MapPin size={14} /> {property.location}
              </span>
              <span className="px-3 py-1 rounded-full shadow-sm bg-green-100 text-green-700 flex items-center gap-1">
                <Bed size={14} /> {property.rooms} Rooms
              </span>
              <span
                className={`px-3 py-1 rounded-full shadow-sm flex items-center gap-1 ${
                  property.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {property.status === "active" ? (
                  <CheckCircle size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {property.status || "active"}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">
              {property.description || "No description available"}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(property)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-00 hover:bg-blue-500 text-white rounded-lg shadow-sm transition cursor-pointer"
              >
                <ClipboardList size={16} /> Edit
              </button>
              <button
                onClick={() => setConfirmDelete(property._id || property.id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow-sm transition cursor-pointer"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Property Modal */}
      {(editingProperty || editingProperty === "new") && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              {editingProperty === "new" ? "Add New Property" : "Edit Property"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center border rounded-lg shadow-sm p-2">
                <Home className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  className="outline-none flex-1"
                  placeholder="Property Name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex items-center border rounded-lg shadow-sm p-2">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  className="outline-none flex-1"
                  placeholder="Location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex items-center border rounded-lg shadow-sm p-2">
                <Bed className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="number"
                  className="outline-none flex-1"
                  placeholder="Rooms"
                  value={formState.rooms}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      rooms: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex items-center border rounded-lg shadow-sm p-2">
                <ClipboardList className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  className="outline-none flex-1"
                  placeholder="Amenities (comma separated)"
                  value={formState.amenities}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      amenities: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-start border rounded-lg shadow-sm p-2">
                <FileText className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                <textarea
                  className="outline-none flex-1 resize-none"
                  placeholder="Property Description"
                  rows={4}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <select
                className="border rounded-lg shadow-sm p-2 w-full"
                value={formState.status}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex items-center border rounded-lg shadow-sm p-2">
                <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="file"
                  multiple
                  className="flex-1"
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                {(formState.propertyImage.length > 0
                  ? Array.from(formState.propertyImage).map((f) =>
                      URL.createObjectURL(f)
                    )
                  : formState.oldImages
                ).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition cursor-pointer"
                onClick={resetForm}
              >
                <XCircle size={18} /> Cancel
              </button>
              <button
                className="flex items-center gap-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                onClick={handleSave}
              >
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition cursor-pointer"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="flex items-center gap-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
                onClick={() => handleDelete(confirmDelete)}
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
