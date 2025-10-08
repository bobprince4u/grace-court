import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Loading skeleton component
const PropertySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="w-full h-72 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Error component with retry functionality
const PropertyError = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
      <svg
        className="w-12 h-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Unable to Load Properties
    </h3>
    <p className="text-gray-600 mb-6 max-w-md">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
      >
        Try Again
      </button>
    )}
  </div>
);

// Empty state component
const EmptyProperties = ({ isSearchResult = false }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {isSearchResult ? "No Properties Found" : "No Properties Available"}
    </h3>
    <p className="text-gray-600 max-w-md">
      {isSearchResult
        ? "Try adjusting your search criteria or browse all available properties."
        : "We're currently updating our property listings. Please check back soon."}
    </p>
  </div>
);

// Individual property card component
const PropertyCard = ({ property, index }) => {
  const image =
    property.propertyImage?.[0] ||
    property.image ||
    property.images?.[0] ||
    null;

  return (
    <div
      className="transform transition-all duration-300 hover:scale-105"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
        opacity: 0,
      }}
    >
      <Link
        to={`/properties/${property._id}`}
        className="block group h-full"
        aria-label={`View details for ${property.name || "Untitled Property"}`}
      >
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative h-72 overflow-hidden">
            {image ? (
              <>
                <img
                  src={image}
                  alt={`${property.name || "Property"} - Main view`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-full h-full bg-gray-200 hidden items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-gray-400"
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
                    <p className="text-sm">Image unavailable</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
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
                  <p className="text-sm font-medium">No Image Available</p>
                </div>
              </div>
            )}

            {/* Status badge */}
            {property.status && (
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status.toLowerCase() === "active" ||
                    property.status.toLowerCase() === "available"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {property.status}
                </span>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Enhanced Glass Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/20 transition-all duration-300 group-hover:bg-white/95">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Graceurt Properties
                </p>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                {property.name || "Untitled Property"}
              </h3>

              {property.location && (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-400"
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
                  <span className="line-clamp-1">{property.location}</span>
                </div>
              )}

              {/* Additional property info */}
              <div className="flex items-center justify-center space-x-4 mt-2">
                {property.rooms && (
                  <div className="flex items-center text-xs text-gray-600">
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 21l8-8-8-8"
                      />
                    </svg>
                    <span>
                      {property.rooms} {property.rooms !== 1 ? "" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const PropertyList = ({
  searchResults,
  Properties,
  title = "Exclusive Listings",
  subtitle = "Discover Short-let accomodation tailored to your needs.",
  showViewAll = true,
  className = "",
  maxProperties = null,
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Memoize the API call
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties`,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data && (data.properties || Array.isArray(data))) {
        setProperties(data.properties || data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message || "Failed to load properties");
      }
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle data priority and fetching
  useEffect(() => {
    if (searchResults && searchResults.length) {
      setProperties(searchResults);
      setLoading(false);
      return;
    }

    if (Properties && Properties.length) {
      setProperties(Properties);
      setLoading(false);
      return;
    }

    fetchProperties();
  }, [searchResults, Properties, fetchProperties]);

  // Memoize processed properties
  const processedProperties = useMemo(() => {
    const validProperties = properties.filter(
      (p) => p && (p._id || p.id) && (p.name || p.title)
    );

    return maxProperties
      ? validProperties.slice(0, maxProperties)
      : validProperties;
  }, [properties, maxProperties]);

  // Determine if this is a search result
  const isSearchResult = Boolean(searchResults && searchResults.length);

  // Handle retry
  const handleRetry = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Loading state
  if (loading) {
    return (
      <section
        className={`bg-gradient-to-b from-gray-50 to-white ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <PropertySkeleton />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className={`bg-gradient-to-b from-gray-50 to-white ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <PropertyError message={error} onRetry={handleRetry} />
        </div>
      </section>
    );
  }

  // Empty state
  if (!processedProperties.length) {
    return (
      <section
        className={`bg-gradient-to-b from-gray-50 to-white ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyProperties isSearchResult={isSearchResult} />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative bg-gradient-to-b from-gray-50 to-white ${className}`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-50 opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-50 opacity-30"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Header */}
        <header className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            {title}
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>

          {/* Property count indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>
              {processedProperties.length}{" "}
              {processedProperties.length === 1 ? "Property" : "Properties"}{" "}
              Available
            </span>
          </div>
        </header>

        {/* Properties Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={processedProperties.length >= 3}
            speed={800}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".property-swiper-next",
              prevEl: ".property-swiper-prev",
            }}
            pagination={{
              clickable: true,
              el: ".property-swiper-pagination",
              bulletClass: "swiper-pagination-bullet opacity-50",
              bulletActiveClass: "swiper-pagination-bullet-active opacity-100",
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="pb-16"
          >
            {processedProperties.map((property, index) => (
              <SwiperSlide key={property._id || property.id || index}>
                <PropertyCard property={property} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button className="property-swiper-prev p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 group border border-gray-100">
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
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

            <div className="property-swiper-pagination flex space-x-2"></div>

            <button className="property-swiper-next p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 group border border-gray-100">
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
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

        {/* View All CTA */}
        {showViewAll && !isSearchResult && (
          <div className="text-center mt-12">
            <Link
              to="/properties"
              //className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {/*  <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>*/}
            </Link>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default PropertyList;
