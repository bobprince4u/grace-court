import React from "react";

const ServicesCard = ({ service }) => {
  return (
    <div
      className="relative flex flex-col justify-end p-6 rounded-xl shadow-lg h-64 bg-cover bg-center transition-transform duration-300 hover:scale-105"
      style={{ backgroundImage: `url(${service.image})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 rounded-xl"></div>

      {/* Icon (Top-Left) */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/40 p-2 rounded-lg">{service.icon}</div>
      </div>

      {/* Foreground Text */}
      <div className="relative z-10 mt-auto">
        <h3 className="text-lg font-bold text-white">{service.title}</h3>
        <p className="mt-2 text-sm text-gray-200">{service.description}</p>
      </div>
    </div>
  );
};

export default ServicesCard;
