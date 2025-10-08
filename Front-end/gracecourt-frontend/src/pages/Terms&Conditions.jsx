import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImg from "../assets/background-img-transformed.png";

const TermsAndConditions = () => {
  const [activeId, setActiveId] = useState("about-1");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id], h2[id], h3[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section (boxed like design, shorter height) */}
      <section className="relative py-12 md:py-16 bg-gray-50">
        <div className="max-w-8xl mx-auto px-6">
          <div className="relative w-full h-[180px] md:h-[280px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={heroImg}
              alt="Terms & Conditions"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
                Terms & Conditions
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex flex-1 max-w-6xl mx-auto px-6 py-12 gap-10">
        {/* Sidebar with full-height divider */}
        <aside className="w-1/4 hidden md:block sticky top-24 self-start">
          <div className="border-r pr-6 h-full">
            <ul className="space-y-4 text-gray-700 text-sm font-medium">
              <li>
                <a
                  href="#about"
                  className={`block ${
                    activeId === "about"
                      ? "text-black font-bold"
                      : "hover:text-black"
                  }`}
                >
                  1. ABOUT THIS AGREEMENT
                </a>
                <ul className="ml-4 mt-2 space-y-1 text-gray-500 text-xs">
                  {["about-1", "about-2", "about-3"].map((id, i) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`block ${
                          activeId === id
                            ? "text-black font-semibold"
                            : "hover:text-gray-700"
                        }`}
                      >
                        1.{i + 1}{" "}
                        {i === 0
                          ? "About"
                          : i === 1
                          ? "Contracting Parties"
                          : "Relationship of the Parties"}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <a
                  href="#booking"
                  className={`block ${
                    activeId === "booking"
                      ? "text-black font-bold"
                      : "hover:text-black"
                  }`}
                >
                  2. BOOKING SERVICES
                </a>
              </li>
              <li>
                <a
                  href="#properties"
                  className={`block ${
                    activeId === "properties"
                      ? "text-black font-bold"
                      : "hover:text-black"
                  }`}
                >
                  3. PROPERTIES
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 text-gray-700 leading-relaxed space-y-6">
          <h2 id="about" className="text-lg font-semibold mb-4">
            About This Agreement
          </h2>

          <h3 id="about-1" className="font-semibold mt-6 mb-2">
            1.1 About
          </h3>
          <p className="text-sm">
            This agreement governs Customer (the "User") usage and subscription
            to services across the web-based platform, ensuring mutual
            compliance between GraceCourt ("Provider") and the User.
          </p>

          <h3 id="about-2" className="font-semibold mt-6 mb-2">
            1.2 Contracting Parties
          </h3>
          <p className="text-sm">
            This Agreement is entered into between the User and GraceCourt, a
            service provider duly registered in accordance with applicable laws.
          </p>

          <h3 id="about-3" className="font-semibold mt-6 mb-2">
            1.3 Relationship of the Parties
          </h3>
          <p className="text-sm">
            The parties are independent contractors. This Agreement does not
            create any agency, fiduciary or employment relationship.
          </p>

          <h3 className="font-semibold mt-6 mb-2">1.4 Acceptance</h3>
          <p className="text-sm">
            This Agreement and its terms and conditions shall be accepted by the
            Customer by signing this Agreement or otherwise using the provided
            platform and services.
          </p>

          <h3 className="font-semibold mt-6 mb-2">1.5 Version</h3>
          <p className="text-sm">
            This Agreement is effective from the date of the Customer's last
            acceptance in this actual version.
          </p>

          <h3 className="font-semibold mt-6 mb-2">1.6 Update</h3>
          <p className="text-sm">This was last updated on August 27th, 2025.</p>

          {/* Booking Services Section */}
          <h2 id="booking" className="text-lg font-semibold mt-10 mb-4">
            2. Booking Services
          </h2>
          <p className="text-sm">
            The User agrees to comply with all booking terms, including
            cancellations, payments, and use of services under GraceCourt’s
            guidelines.
          </p>

          {/* Properties Section */}
          <h2 id="properties" className="text-lg font-semibold mt-10 mb-4">
            3. Properties
          </h2>
          <p className="text-sm">
            All properties made available through the platform remain subject to
            the rules, regulations, and policies outlined by GraceCourt.
          </p>

          {/* Bottom CTA Button */}
          <div className="pt-10">
            {/* Navigate back to homepage booking section */}
            <Link
              to="/#booking"
              className="inline-flex items-center px-5 py-3 bg-black text-white rounded-full shadow-md hover:bg-gray-800 transition"
            >
              Booking Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
