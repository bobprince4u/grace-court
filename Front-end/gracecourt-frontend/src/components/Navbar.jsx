import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "#home", type: "scroll" },
    { label: "Properties", href: "#destinations", type: "scroll" },
    { label: "Services", href: "#services", type: "scroll" },
    { label: "AboutUs", href: "#about", type: "scroll" },
    { label: "ContactUs", href: "#contact", type: "scroll" },
    { label: "T&C", href: "/terms", type: "route" }, // separate page
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    if (location.pathname === "/") {
      const sections = document.querySelectorAll("section[id]");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.6 }
      );
      sections.forEach((section) => observer.observe(section));
      return () => {
        window.removeEventListener("scroll", handleScroll);
        sections.forEach((section) => observer.unobserve(section));
      };
    } else {
      // On non-homepage, reset active highlight
      setActiveSection(null);
    }
  }, [location.pathname]);

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      if (location.pathname !== "/") {
        // Navigate home first, then scroll
        navigate("/");
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsOpen(false); // close mobile menu after click
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white shadow-md text-gray-800"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className=" cursor-pointer text-2xl font-bold bg-[url('/src/assets/logo.png')] bg-no-repeat bg-contain w-32 h-10"
        ></h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium relative mx-auto">
          {navLinks.map((link, idx) => (
            <li key={idx} className="relative group">
              {link.type === "scroll" ? (
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`transition relative pb-1 ${
                    activeSection === link.href.replace("#", "")
                      ? "text-red-500"
                      : "hover:text-red-500"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-red-500 transition-all duration-300 ${
                      activeSection === link.href.replace("#", "")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `transition relative pb-1 ${
                      isActive ? "text-red-500" : "hover:text-red-500"
                    }`
                  }
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] bg-red-500 transition-all duration-300 w-0 group-hover:w-full" />
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Book Now Button */}
        <a
          href="https://www.airbnb.com/rooms/1505635273816946738?guests=1&adults=1&s=67&unique_share_id=aaaf586f-9948-467e-9701-49f55584656d&source_impression_id=p3_1758546335_P3KIr6GNjBjtmBRf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Book Now
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-4 px-6 py-4 text-gray-800">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                {link.type === "scroll" ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block pb-1 transition ${
                      activeSection === link.href.replace("#", "")
                        ? "text-red-500 font-semibold"
                        : "hover:text-red-500"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `block pb-1 transition ${
                        isActive
                          ? "text-red-500 font-semibold"
                          : "hover:text-red-500"
                      }`
                    }
                    onClick={() => setIsOpen(false)} // ✅ close mobile menu
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={(e) => handleNavClick(e, "#booking")}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
              >
                Book Now
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
