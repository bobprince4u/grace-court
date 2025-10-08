import React, { useMemo } from "react";
import servicesData from "../assets/ServicesData";
import ServicesCard from "./ServicesCard";

// Loading skeleton component for better UX
const ServicesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2 w-full">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyServices = () => (
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
      No Services Available
    </h3>
    <p className="text-gray-600 max-w-md">
      We're currently updating our services. Please check back soon for exciting
      new offerings.
    </p>
  </div>
);

// Error boundary fallback component
const ServicesError = ({ onRetry }) => (
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
      Unable to Load Services
    </h3>
    <p className="text-gray-600 mb-6 max-w-md">
      We encountered an issue loading our services. Please try again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    )}
  </div>
);

const FeaturedServices = ({
  loading = false,
  error = null,
  onRetry = null,
  maxServices = null,
  className = "",
  showBackground = true,
}) => {
  // Memoize processed services data for performance
  const processedServices = useMemo(() => {
    if (!servicesData || !Array.isArray(servicesData)) {
      return [];
    }

    // Filter out invalid services and apply limit if specified
    const validServices = servicesData.filter(
      (service) =>
        service && service.id && service.title && typeof service === "object"
    );

    return maxServices ? validServices.slice(0, maxServices) : validServices;
  }, [maxServices]);

  // Handle loading state
  if (loading) {
    return (
      <section
        className={`relative ${
          showBackground ? "bg-gradient-to-b from-gray-50 to-white" : ""
        } ${className}`}
        aria-label="Featured Services Loading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12 lg:mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <ServicesSkeleton />
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section
        className={`relative ${
          showBackground ? "bg-gradient-to-b from-gray-50 to-white" : ""
        } ${className}`}
        aria-label="Featured Services Error"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <ServicesError onRetry={onRetry} />
        </div>
      </section>
    );
  }

  // Handle empty state
  if (processedServices.length === 0) {
    return (
      <section
        className={`relative ${
          showBackground ? "bg-gradient-to-b from-gray-50 to-white" : ""
        } ${className}`}
        aria-label="Featured Services"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <EmptyServices />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative ${
        showBackground ? "bg-gradient-to-b from-gray-100 to-white" : ""
      } ${className}`}
      aria-label="Exclusive Listings"
    >
      {/* Optional background decoration */}
      {showBackground && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-50 opacity-50"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-50 opacity-50"></div>
          </div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </>
      )}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Enhanced Header Section */}
        <header className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Graceurt?
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            At Graceurt, we don’t just provide apartments; we create a complete
            living experience. From the serenity of our environment to our
            thoughtfully designed facilities, every detail is tailored to make
            your stay stress-free and memorable.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              24/7 Power & Security – uninterrupted comfort and peace of mind
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Elevator, Fire Escape & Service Entry/Exit – safety and
              convenience built-in.
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Rooftop Relaxation & Swimming Pool – unwind in style.
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              CCTV Surveillance & Secured Parking – your safety, our priority.
            </div>
          </div>
        </header>

        {/* Services Grid with improved responsive design */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full"
          role="list"
          aria-label="Featured services list"
        >
          {processedServices.map((service, index) => (
            <div
              key={service.id}
              role="listitem"
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
              }}
            >
              <ServicesCard
                service={service}
                className="h-full shadow-sm hover:shadow-lg transition-shadow duration-300"
              />
            </div>
          ))}
        </div>

        {/* Optional CTA Section 
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            Ready to experience exceptional service?
          </p>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Get started with our services"
          >
            Get Started Today
            <svg
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
            </svg>
          </a>
        </div>*/}
      </div>

      {/* CSS-in-JS for animations */}
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
      `}</style>
    </section>
  );
};

export default FeaturedServices;
