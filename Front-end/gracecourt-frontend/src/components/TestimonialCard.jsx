/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const TestimonialCard = ({ text, image, name }) => {
  const safeText = text?.trim() || "No testimonial provided.";
  const safeName = name?.trim() || "Anonymous";
  const safeImage =
    image?.trim() || "https://via.placeholder.com/150?text=User";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow w-full h-full"
    >
      {/* Testimonial text */}
      <p className="text-neutral-700 italic leading-relaxed mb-6 line-clamp-5">
        “{safeText}”
      </p>

      {/* Author avatar */}
      <img
        src={safeImage}
        alt={safeName}
        className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 shadow-sm"
        loading="lazy"
      />

      {/* Author name */}
      <h3 className="mt-3 font-semibold text-neutral-900">{safeName}</h3>
    </motion.div>
  );
};

export default TestimonialCard;
