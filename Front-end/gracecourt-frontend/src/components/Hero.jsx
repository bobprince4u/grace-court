/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Loading skeleton component for Hero
const HeroSkeleton = () => (
  <section className="relative min-h-[100vh] sm:min-h-[92vh] w-full overflow-hidden bg-gray-300 animate-pulse">
    <div className="absolute inset-0 bg-gray-400" />

    {/* Skeleton for centered text */}
    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-36 text-center">
      <div className="bg-gray-400 h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-full max-w-2xl mx-auto rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-400 h-4 sm:h-5 w-full max-w-3xl mx-auto rounded"></div>
        <div className="bg-gray-400 h-4 sm:h-5 w-5/6 mx-auto rounded"></div>
        <div className="bg-gray-400 h-4 sm:h-5 w-4/6 mx-auto rounded"></div>
      </div>
    </div>

    {/* Skeleton for search form */}
    <div
      className="
      absolute left-1/2 -translate-x-1/2 
      bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-20
      w-[95%] sm:w-[92%] md:w-[90%] lg:w-[85%] xl:w-[80%]
      max-w-7xl
      bg-gray-200 
      rounded-xl sm:rounded-2xl shadow-2xl
      px-3 sm:px-4 md:px-6 lg:px-10 
      py-4 sm:py-6 md:py-8
    "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {/* Location skeleton */}
        <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
          <div className="bg-gray-300 h-4 sm:h-5 w-20 rounded mb-1 sm:mb-2"></div>
          <div className="bg-gray-100 rounded-lg py-2 sm:py-3 px-2 sm:px-3 h-10 sm:h-12"></div>
        </div>

        {/* Check-In skeleton */}
        <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
          <div className="bg-gray-300 h-4 sm:h-5 w-16 rounded mb-1 sm:mb-2"></div>
          <div className="bg-gray-100 rounded-lg py-2 sm:py-3 px-2 sm:px-3 h-10 sm:h-12"></div>
        </div>

        {/* Check-Out skeleton */}
        <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
          <div className="bg-gray-300 h-4 sm:h-5 w-18 rounded mb-1 sm:mb-2"></div>
          <div className="bg-gray-100 rounded-lg py-2 sm:py-3 px-2 sm:px-3 h-10 sm:h-12"></div>
        </div>

        {/* Guests skeleton */}
        <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
          <div className="bg-gray-300 h-4 sm:h-5 w-12 rounded mb-1 sm:mb-2"></div>
          <div className="bg-gray-100 rounded-lg py-2 sm:py-3 px-2 sm:px-3 h-10 sm:h-12"></div>
        </div>

        {/* Submit button skeleton */}
        <div className="flex flex-col justify-end col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="bg-gray-300 rounded-full h-11 sm:h-12 w-full"></div>
        </div>
      </div>
    </div>
  </section>
);

const Hero = ({
  backgroundImage = "/src/assets/background-img-transformed.png",
  title = "Premium Accommodation",
  subtitle = "Short, Mid & Longlets. At Gracecourt, we offer luxury short-let apartments designed for style, comfort, and convenience. Whether it's a weekend escape or an extended stay, enjoy upscale amenities, spacious interiors, and prime locations. Discover why smart travellers choose Gracecourt, your home away from home.",
  onSearch,
  isLoading = false, // Add loading prop
}) => {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [form, setForm] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const setField = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // Smooth scroll to properties section
  const scrollToProperties = useCallback(() => {
    const propertiesSection =
      document.getElementById("properties") ||
      document.querySelector('[data-section="properties"]') ||
      document.querySelector(".properties-section");

    if (propertiesSection) {
      propertiesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const validate = () => {
    if (!form.location || !form.checkIn || !form.checkOut || !form.guests) {
      setMsg({ type: "error", text: "Please complete all fields." });
      return false;
    }
    if (form.checkOut < form.checkIn) {
      setMsg({
        type: "error",
        text: "Check-out date cannot be earlier than check-in.",
      });
      return false;
    }
    if (Number(form.guests) <= 0) {
      setMsg({ type: "error", text: "Guests must be at least 1." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties/search?location=${
          form.location
        }&checkIn=${form.checkIn}&checkOut=${form.checkOut}&guests=${
          form.guests
        }`
      );
      const data = await res.json();

      if (res.ok) {
        setMsg({
          type: "success",
          text: `${data.count} properties found in ${form.location}!`,
        });
        if (onSearch) onSearch(data.properties || []); // Pass results to parent

        // Scroll to properties section after successful search
        setTimeout(() => {
          scrollToProperties();
        }, 500); // Small delay to show success message first
      } else {
        setMsg({
          type: "error",
          text: data.message || "No properties found.",
        });
      }
    } catch (err) {
      setMsg({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!msg.text) return;
    const t = setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    return () => clearTimeout(t);
  }, [msg]);

  // Show skeleton if loading
  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section
      id="home"
      className="relative min-h-[100vh] sm:min-h-[92vh] w-full overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 from-black/60 via-black/30 to-black/20" />

      {/* Centered text */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-36 text-center">
        <motion.h1
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight drop-shadow-sm px-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-white/90 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed px-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Search form */}
      <motion.form
        onSubmit={handleSubmit}
        className="
          absolute left-1/2 -translate-x-1/2 
          bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-20
          w-[95%] sm:w-[92%] md:w-[90%] lg:w-[85%] xl:w-[80%]
          max-w-7xl
          bg-white/70 backdrop-blur-md
          rounded-xl sm:rounded-2xl shadow-2xl
          px-3 sm:px-4 md:px-6 lg:px-10 
          py-4 sm:py-6 md:py-8
        "
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {/* Location (Dropdown) */}
          <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="location"
              className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
            >
              Location
            </label>
            <div className="flex items-center bg-white rounded-lg py-2 sm:py-3 px-2 sm:px-3 gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <select
                id="location"
                name="location"
                value={form.location}
                onChange={setField}
                className="w-full outline-none text-gray-800 bg-white text-sm sm:text-base"
                required
              >
                <option value="">Select location</option>
                <option value="lekki">Lekki</option>
                <option value="ikeja">Ikeja</option>
                <option value="ikoyi">Ikoyi</option>
                <option value="abuja">Abuja</option>
              </select>
            </div>
          </div>

          {/* Check-In */}
          <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="checkIn"
              className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
            >
              Check-In
            </label>
            <div className="flex items-center bg-white rounded-lg py-2 sm:py-3 px-2 sm:px-3 gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                min={today}
                value={form.checkIn}
                onChange={setField}
                className="w-full outline-none text-gray-800 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="checkOut"
              className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
            >
              Check-Out
            </label>
            <div className="flex items-center bg-white rounded-lg py-2 sm:py-3 px-2 sm:px-3 gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                min={form.checkIn || today}
                value={form.checkOut}
                onChange={setField}
                className="w-full outline-none text-gray-800 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col col-span-1 sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="guests"
              className="text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
            >
              Guests
            </label>
            <div className="flex items-center bg-white rounded-lg py-2 sm:py-3 px-2 sm:px-3 gap-2 sm:gap-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
              <input
                type="number"
                id="guests"
                name="guests"
                min={1}
                placeholder="1"
                value={form.guests}
                onChange={setField}
                className="w-full outline-none text-gray-800 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col justify-end col-span-1 sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2
                   bg-red-600 hover:bg-red-700 disabled:bg-red-400
                   text-white font-semibold rounded-full 
                   px-4 sm:px-5 py-2 sm:py-3 
                   transition text-sm sm:text-base
                   min-h-[44px] sm:min-h-[48px]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </motion.form>

      {msg.text && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                      px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-md 
                      text-xs sm:text-sm flex items-center gap-2
                      max-w-[90%] sm:max-w-md
                      ${
                        msg.type === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
        >
          {msg.type === "success" ? (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          )}
          <span className="break-words">{msg.text}</span>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
