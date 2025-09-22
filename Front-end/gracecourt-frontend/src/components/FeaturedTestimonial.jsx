/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

/* ============================
   Custom Hook: useTestimonials
   ============================ */
const useTestimonials = (apiEndpoint, onError, maxRetries = 3) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(null);

  const fetchTestimonials = useCallback(
    async (attempt = 0) => {
      try {
        setError(null);

        // Cancel ongoing request if any
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        }, 10000);

        const response = await fetch(apiEndpoint, {
          signal: abortControllerRef.current.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Normalize API shape
        let testimonialsList = [];
        if (Array.isArray(data)) {
          testimonialsList = data;
        } else if (data && typeof data === "object") {
          testimonialsList = data.testimonials || data.data || data.items || [];
        }

        // Only approved testimonials with required fields
        const validTestimonials = testimonialsList.filter((t) => {
          return (
            t &&
            typeof t === "object" &&
            typeof t.name === "string" &&
            t.name.trim().length > 0 &&
            (t.message || t.text) &&
            (t.approved === true || t.approved === "true")
          );
        });

        if (!isMountedRef.current) return;

        cacheRef.current = {
          data: validTestimonials,
          timestamp: Date.now(),
        };

        setTestimonials(validTestimonials);
        setRetryCount(0);
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err.name === "AbortError") return;

        console.error(
          `Fetch testimonials failed (attempt ${attempt + 1}):`,
          err
        );

        // Use cache if recent
        if (
          cacheRef.current &&
          Date.now() - cacheRef.current.timestamp < 300000
        ) {
          setTestimonials(cacheRef.current.data);
          setError(null);
          return;
        }

        // Retry with exponential backoff
        if (attempt < maxRetries) {
          setRetryCount(attempt + 1);
          setTimeout(() => {
            if (isMountedRef.current) {
              fetchTestimonials(attempt + 1);
            }
          }, 1000 * Math.pow(2, attempt));
          return;
        }

        setError(err.message || "Failed to load testimonials");
        if (onError) onError(err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiEndpoint, onError, maxRetries]
  );

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    fetchTestimonials();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTestimonials]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    fetchTestimonials();
  }, [fetchTestimonials]);

  return { testimonials, loading, error, retryCount, refetch, maxRetries };
};

/* ============================
   Main Component
   ============================ */
const FeaturedTestimonial = ({
  itemsPerPage = 3,
  autoplayInterval = 5000,
  apiEndpoint = "http://localhost:5000/api/testimonials",
  className = "",
  onError,
  maxRetries = 3,
}) => {
  const { testimonials, loading, error, retryCount, refetch } = useTestimonials(
    apiEndpoint,
    onError,
    maxRetries
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  const { totalPages, visibleTestimonials, safeCurrentPage } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(testimonials.length / itemsPerPage));
    const safePage = Math.max(0, Math.min(currentPage, pages - 1));
    const startIndex = safePage * itemsPerPage;
    const visible = testimonials.slice(startIndex, startIndex + itemsPerPage);

    return {
      totalPages: pages,
      visibleTestimonials: visible,
      safeCurrentPage: safePage,
    };
  }, [testimonials, itemsPerPage, currentPage]);

  // Keep currentPage valid
  useEffect(() => {
    setCurrentPage((prev) => Math.max(0, Math.min(prev, totalPages - 1)));
  }, [totalPages]);

  // Navigation
  const goToPage = useCallback(
    (pageIndex) => {
      setCurrentPage(Math.max(0, Math.min(pageIndex, totalPages - 1)));
    },
    [totalPages]
  );

  const nextPage = useCallback(
    () => setCurrentPage((prev) => (prev + 1) % totalPages),
    [totalPages]
  );
  const prevPage = useCallback(
    () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages),
    [totalPages]
  );

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (totalPages <= 1 || isPaused) return;
    autoplayRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, autoplayInterval);
  }, [totalPages, autoplayInterval, isPaused]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    stopAutoplay();
  }, [stopAutoplay]);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    startAutoplay();
  }, [startAutoplay]);

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prevPage();
          break;
        case "ArrowRight":
          event.preventDefault();
          nextPage();
          break;
        case " ":
          event.preventDefault();
          setIsPaused(!isPaused);
          break;
        default:
          break;
      }
    },
    [nextPage, prevPage, isPaused]
  );

  /* ============================
     States
     ============================ */

  if (loading && testimonials.length === 0) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-neutral-800" />
          <p className="text-neutral-600 text-sm">Loading testimonials...</p>
          {retryCount > 0 && (
            <p className="text-neutral-500 text-xs">
              Retrying... ({retryCount}/{maxRetries})
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Unable to load testimonials
          </h3>
          <p className="text-neutral-600 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-neutral-500">
          <p className="text-lg mb-2">No testimonials available</p>
          <p className="text-sm">Check back later for customer reviews.</p>
        </div>
      </div>
    );
  }

  /* ============================
     Main Carousel
     ============================ */
  return (
    <section
      className={`relative w-full flex flex-col items-center bg-gradient-to-b from-gray-50 to-white py-12 mt-16 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Customer testimonials carousel"
    >
      {/* Heading at top */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          What our guest says
        </h2>
        <p className="mt-2 text-neutral-600 text-lg">
          Real experiences shared by our valued customers
        </p>
      </div>

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={safeCurrentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id || testimonial.id || testimonial.name}
                  text={testimonial.message || testimonial.text || ""}
                  image={testimonial.image}
                  name={testimonial.name}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevPage}
              className="p-3 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 focus:bg-neutral-700 transition focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2 disabled:opacity-50"
              aria-label="Previous testimonials"
              disabled={loading}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              className="flex space-x-2"
              role="tablist"
              aria-label="Testimonial pages"
            >
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2 ${
                    index === safeCurrentPage
                      ? "bg-neutral-800 scale-125"
                      : "bg-neutral-300 hover:bg-neutral-500"
                  }`}
                  aria-label={`Go to testimonial page ${
                    index + 1
                  } of ${totalPages}`}
                  role="tab"
                  aria-selected={index === safeCurrentPage}
                  disabled={loading}
                />
              ))}
            </div>

            <button
              onClick={nextPage}
              className="p-3 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 focus:bg-neutral-700 transition focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2 disabled:opacity-50"
              aria-label="Next testimonials"
              disabled={loading}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Status */}
        <div className="flex justify-center items-center mt-4 space-x-4 text-sm text-neutral-500">
          {loading && testimonials.length > 0 && (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-neutral-300 border-t-neutral-600" />
              <span>Updating...</span>
            </span>
          )}

          {error && testimonials.length > 0 && (
            <button
              onClick={refetch}
              className="text-red-600 hover:text-red-700 underline focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded"
            >
              Update failed - retry
            </button>
          )}

          {totalPages > 1 && (
            <span>
              Page {safeCurrentPage + 1} of {totalPages}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTestimonial;
