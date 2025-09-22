/*import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PropertyCard = ({ images = [], title, subtitle }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="mb-3">
        {images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={title}
                  className="w-full h-48 object-cover rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default PropertyCard;
*/
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
