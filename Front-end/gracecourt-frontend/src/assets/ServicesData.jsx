import ikoyi from "./images/ikoyi.webp";
import seamless from "./images/seamless.jpeg";
import support from "./images/support.png";
import clean1 from "./images/clean1.jpg";
import transparent_pricing from "./images/transparent_pricing.jpeg";
import Easy_booking from "./images/Easy_booking.jpeg";

import {
  FaHome,
  FaKey,
  FaHeadset,
  FaBroom,
  FaBalanceScale,
  FaHotel,
} from "react-icons/fa";

const servicesData = [
  {
    id: 1,
    title: "Premium Properties",
    description:
      "From Apartments to Penthouses and Maisonettes, Gracecurt offers a variety of premium spaces designed for modern living. Each home is crafted with breathtaking architecture, exceptional finishing, and amenities that elevate your lifestyle.",
    image: ikoyi,
    icon: <FaHome className="text-white text-2xl" />,
  },
  {
    id: 2,
    title: "Seamless Check-In",
    description:
      "Arrive and feel at home instantly. Our simple, tech-enabled check-in process ensures a smooth transition from the door to your living space.",
    image: seamless,
    icon: <FaKey className="text-white text-2xl" />,
  },
  {
    id: 3,
    title: "24/7 Support",
    description:
      "Day or night, our dedicated support team is always available to ensure your comfort and peace of mind.",
    image: support,
    icon: <FaHeadset className="text-white text-2xl" />,
  },
  {
    id: 4,
    title: "Professional Cleaning",
    description:
      "Impeccable hygiene is part of the Graceurt promise. Every apartment is cleaned and maintained to the highest standard for your comfort.",
    image: clean1,
    icon: <FaBroom className="text-white text-2xl" />,
  },
  {
    id: 5,
    title: "Transparent Pricing",
    description:
      "What you see is what you pay. No hidden charges, just clear, straightforward pricing for premium living",
    image: transparent_pricing,
    icon: <FaBalanceScale className="text-white text-2xl" />,
  },
  {
    id: 6,
    title: "Easy Booking",
    description:
      "Booking your stay is just a few clicks away—fast, simple, and stress-free.",
    image: Easy_booking,
    icon: <FaHotel className="text-white text-2xl" />,
  },
];

export default servicesData;
