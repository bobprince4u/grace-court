import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import PropertyList from "../components/PropertyList";
//import PropertiesData from "../assets/PropertiesData";
import FeaturedServices from "../components/FeaturedServices";
import Availability from "../components/Availability";
import FeaturedTestimonial from "../components/FeaturedTestimonial";
import AboutUs from "../components/AboutUs";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const Homepage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("properties");
    console.log("Raw admin_properties:", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("Parsed:", parsed);
        setProperties(parsed);
      } catch (err) {
        console.error("Error parsing localStorage data", err);
        setProperties([]);
      }
    } else {
      setProperties([]);
    }
  }, []);

  return (
    <>
      <Hero onSearch={setSearchResults} />

      <section id="destinations" className="bg-white mb-4 py-3 ">
        <PropertyList searchResults={searchResults} properties={properties} />
      </section>

      <section id="services" className="bg-gray-200">
        <FeaturedServices />
      </section>

      <section id="booking">
        <Availability />
      </section>

      <section id="testimonials" className="">
        <FeaturedTestimonial />
      </section>

      <section id="about">
        <AboutUs />
      </section>

      <section id="contact">
        <ContactForm />
      </section>

      <Footer />
    </>
  );
};

export default Homepage;
