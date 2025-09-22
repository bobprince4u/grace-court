import React from "react";

const PropertyCard = ({ images = [], title, subtitle }) => {
  const image = images.length > 0 ? images[0] : null;

  return (
    <div className="rounded-xl shadow bg-white overflow-hidden relative group">
      {/* Image */}
      {image ? (
        <img src={image} alt={title} className="w-full h-64 object-cover" />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Overlay text */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
