import ikoyi from "./images/ikoyi.webp";
import seamless from "./images/seamless.jpeg";
import support from "./images/support.png";
import cleaning_services from "./images/cleaning_services.jpeg";
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
    description: "Luxury Downtown Apartment, Luxury Downtown Apartment.",
    image: ikoyi,
    icon: <FaHome className="text-white text-2xl" />,
  },
  {
    id: 2,
    title: "Seamless Check-In",
    description: "Luxury Downtown Apartment, Luxury Downtown Apartment.",
    image: seamless,
    icon: <FaKey className="text-white text-2xl" />,
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Luxury Downtown Apartment, Luxury Downtown Apartment.",
    image: support,
    icon: <FaHeadset className="text-white text-2xl" />,
  },
  {
    id: 4,
    title: "Professional Cleaning",
    description: "Luxury Downtown Apartment, Luxury Downtown Apartment.",
    image: cleaning_services,
    icon: <FaBroom className="text-white text-2xl" />,
  },
  {
    id: 5,
    title: "Transparent Pricing",
    description: "Luxury Downtown Apartment, Luxury Downtown Apartment.",
    image: transparent_pricing,
    icon: <FaBalanceScale className="text-white text-2xl" />,
  },
  {
    id: 6,
    title: "Easy Booking",
    description: "Luxury Downtown Apartment, Luxury Downtown Apartment.",
    image: Easy_booking,
    icon: <FaHotel className="text-white text-2xl" />,
  },
];

export default servicesData;
