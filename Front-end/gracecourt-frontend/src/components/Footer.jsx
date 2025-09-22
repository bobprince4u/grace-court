/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({
  contact = { email: "support@graceourt.com", phone: "+234 800 123 4567" },
}) => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const supportLinks = [
    { label: "Help", href: "/help" },
    { label: "Booking Support", href: "/booking-support" },
  ];

  const socialIcons = [
    { id: 1, icon: <Facebook className="w-5 h-5" />, href: "#" },
    { id: 2, icon: <Twitter className="w-5 h-5" />, href: "#" },
    { id: 3, icon: <Instagram className="w-5 h-5" />, href: "#" },
    { id: 4, icon: <Linkedin className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="bg-neutral-900 text-gray-300 py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={link.href} className="hover:text-white transition">
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            {supportLinks.map((link, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={link.href} className="hover:text-white transition">
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <p className="text-sm mb-4">
            For more information about our company, you can reach us via:
          </p>

          {/* Email */}
          <div className="flex items-center bg-white text-gray-800 rounded-md overflow-hidden mb-3">
            <span className="px-3">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="text"
              disabled
              value={contact.email}
              className="flex-1 p-2 text-sm bg-white outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span>{contact.phone}</span>
          </div>
        </div>
      </motion.div>

      {/* Social Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-center gap-6 mt-10"
      >
        {socialIcons.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            {item.icon}
          </a>
        ))}
      </motion.div>
    </footer>
  );
};

export default Footer;
