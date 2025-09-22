/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

const ITEMS_PER_PAGE = 3;

const FeaturedTestimonial = () => {
  const isMountedRef = useRef(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Fetch only approved testimonials, with localStorage cache
  useEffect(() => {
    const cached = localStorage.getItem("approvedTestimonials");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (isMountedRef.current) {
            setTestimonials(parsed);
            setLoading(false);
          }
        }
      } catch (_) {}
    }

    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/testimonials?approved=true"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let list = Array.isArray(data)
          ? data
          : Array.isArray(data.testimonials)
          ? data.testimonials
          : [];

        // Filter only approved
        list = list.filter(
          (t) => t && (t.approved === true || t.approved === "true")
        );

        if (isMountedRef.current) {
          setTestimonials(list);
          localStorage.setItem("approvedTestimonials", JSON.stringify(list));
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchTestimonials();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-800"></div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No testimonials available.
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(testimonials.length / ITEMS_PER_PAGE)
  );
  const index = ((page % totalPages) + totalPages) % totalPages;

  const visibleTestimonials = testimonials.slice(
    index * ITEMS_PER_PAGE,
    index * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const paginate = useCallback((newDirection) => {
    setPage((p) => p + newDirection);
  }, []);

  const goToSlide = (slideIndex) => setPage(slideIndex);

  // autoplay
  useEffect(() => {
    const id = setInterval(() => paginate(1), 5000);
    return () => clearInterval(id);
  }, [paginate]);

  return (
    <div className="relative w-full flex flex-col items-center bg-[#FAFAFA] mt-8 pb-6 pt-6">
      <div className="relative w-full max-w-5xl overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleTestimonials.map((t) => (
              <TestimonialCard
                key={t._id || t.id}
                text={t.message || t.text}
                image={t.image}
                name={t.name}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      {totalPages > 1 && (
        <div className="flex justify-between w-full max-w-xs mt-4">
          <button
            onClick={() => paginate(-1)}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
            aria-label="previous"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
            aria-label="next"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}

      {/* Dots */}
      <div className="flex mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index
                ? "bg-neutral-900 scale-110"
                : "bg-neutral-400 hover:bg-neutral-600"
            }`}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedTestimonial;
