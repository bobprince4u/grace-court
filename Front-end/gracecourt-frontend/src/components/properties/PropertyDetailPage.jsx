import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Footer from "../../components/Footer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Loading skeleton component
const PropertySkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
    <div className="h-4 w-32 bg-gray-300 rounded mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="w-full h-[450px] bg-gray-300 rounded-xl"></div>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
        <div className="flex gap-3 mb-6">
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded-lg w-full mt-6"></div>
      </div>
    </div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="max-w-7xl mx-auto px-4 py-12 text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
      <div className="text-red-600 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "active":
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
      case "unavailable":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 border rounded-full text-sm font-medium capitalize ${getStatusStyles(
        status
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API call functions

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Add debugging logs
      console.log("API Response:", data);
      console.log("Property object:", data.property || data);
      console.log("Description field:", (data.property || data)?.description);

      if (data && (data.property || data._id)) {
        const propertyData = data.property || data;
        setProperty(propertyData);

        // Additional debug log
        console.log("Property set in state:", propertyData);
      } else {
        throw new Error("Property not found");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message || "Failed to load property details");
      }
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRelatedProperties = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`http://localhost:5000/api/properties`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const allProps = data.properties || data;

        if (Array.isArray(allProps)) {
          setRelated(allProps.filter((p) => p._id !== id).slice(0, 6));
        }
      }
    } catch (err) {
      console.warn("Failed to load related properties:", err);
      // Don't show error to user for related properties failure
    }
  }, [id]);

  // Effects
  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id, fetchProperty]);

  useEffect(() => {
    if (id) {
      fetchRelatedProperties();
    }
  }, [id, fetchRelatedProperties]);

  // Event handlers
  const handleBackClick = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/properties");
    }
  }, [navigate]);

  const handlePropertyClick = useCallback(
    (propertyId) => {
      navigate(`/properties/${propertyId}`);
    },
    [navigate]
  );

  //const handleBookNow = useCallback(() => {
  // Implement booking logic here
  console.log("Booking property:", property?._id);
  // You could open a modal, navigate to booking page, etc.
  //}, [property]);

  const handleRetry = useCallback(() => {
    fetchProperty();
  }, [fetchProperty]);

  // Render loading state
  if (loading) {
    return <PropertySkeleton />;
  }

  // Render error state
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Render not found state
  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Property Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button
            onClick={handleBackClick}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={handleBackClick}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Properties
          </button>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">
            {property.name}
          </span>
        </nav>

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-8 group"
          aria-label="Go back to previous page"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Properties</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery and Description Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {property.propertyImage?.length > 0 ? (
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  pagination={{
                    clickable: true,
                    bulletClass: "swiper-pagination-bullet",
                    bulletActiveClass: "swiper-pagination-bullet-active",
                  }}
                  className="rounded-xl shadow-lg overflow-hidden"
                  lazy={true}
                >
                  {property.propertyImage.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[550px]">
                        <img
                          src={img}
                          alt={`${property.name} - Image ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-full h-[450px] bg-gray-200 flex flex-col items-center justify-center text-gray-500 rounded-xl shadow">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">No Images Available</p>
              </div>
            )}

            {/* Description Section - Below Image Gallery */}
            {property.description && (
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      About This Property
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg font-light tracking-wide">
                    {property.description}
                  </p>
                </div>

                {/* Decorative border */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-300 rounded-full opacity-60"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full opacity-80"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full opacity-80"></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-8">
            {/* Title and Location */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {property.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{property.location || "Location not specified"}</span>
              </div>
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {property.rooms && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
                  {property.rooms} Room{property.rooms !== 1 ? "s" : ""}
                </span>
              )}
              <StatusBadge status={property.status} />
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="pt-4 border-t border-gray-200">
              <a
                href="https://www.airbnb.com/rooms/1505635273816946738?guests=1&adults=1&s=67&unique_share_id=aaaf586f-9948-467e-9701-49f55584656d&source_impression_id=p3_1758546335_P3KIr6GNjBjtmBRf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium block text-center"
              >
                Book Now
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Secure booking • Instant confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              You might also like
            </h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={related.length >= 3}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: ".swiper-button-next-related",
                prevEl: ".swiper-button-prev-related",
              }}
              pagination={{
                clickable: true,
                el: ".swiper-pagination-related",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="relative"
            >
              {related.map((relatedProperty) => (
                <SwiperSlide key={relatedProperty._id}>
                  <div
                    onClick={() => handlePropertyClick(relatedProperty._id)}
                    className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePropertyClick(relatedProperty._id);
                      }
                    }}
                  >
                    <div className="relative h-48">
                      <img
                        src={
                          relatedProperty.propertyImage?.[0] ||
                          relatedProperty.image ||
                          relatedProperty.images?.[0] ||
                          ""
                        }
                        alt={relatedProperty.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                        {relatedProperty.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {relatedProperty.location || "Location not specified"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Related Properties Navigation */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button className="swiper-button-prev-related p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="swiper-pagination-related"></div>
              <button className="swiper-button-next-related p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* CSS for fadeInUp animation */}
      <style jsx>{`
        .fade-in-description {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;
