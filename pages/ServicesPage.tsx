// src/pages/ServicesPage.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/api";
import { Service } from "../types";
import Spinner from "../components/Spinner";
import { HiArrowLongRight } from "react-icons/hi2";



// --------------------------------------
// ServiceRow Component
// --------------------------------------
const ServiceRow: React.FC<{
  service: Service;
  index: number;
  imagePosition: "left" | "right";
}> = ({ service, index, imagePosition }) => {
  const imageSrc = `backend/${service.imageUrl}`;

  const imageBlock = (
    <div className="relative w-full h-full flex items-center justify-center order-1 md:order-none">
      {/* Large Faint Background Number */}
      <div
        className={`hidden md:flex absolute text-[120px] lg:text-[150px] font-extrabold text-gray-200/40 font-montserrat pointer-events-none select-none
        ${imagePosition === "left" ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2"}`}
        style={{
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Image */}
      <img
        src={imageSrc}
        alt={service.name}
        className="w-full h-full object-cover min-h-[350px] rounded-lg shadow-md relative z-10"
        onError={(e) => {
          (e.target as HTMLImageElement).src = imageSrc;
        }}
      />
    </div>
  );

  const textBlock = (
    <div className="relative mt-5 md:mt-0 h-full flex flex-col justify-center z-20 order-2 md:order-none">
      <h4 className="text-base font-semibold text-secondary uppercase font-montserrat tracking-wider">
        OUTDOOR SERVICE
      </h4>
      <h3 className="text-2xl md:text-3xl text-primary font-semibold font-montserrat mt-2">
        <Link
          to={`/services/${service._id}`}
          className="hover:text-secondary transition-colors"
        >
          {service.name}
        </Link>
      </h3>
      <p className="text-base text-gray-600 font-open-sans leading-relaxed my-8 relative pt-8 border-t border-gray-200">
        {service.description.slice(0, 150)}...
      </p>

      {/* ✅ Learn More Link + Arrow */}
      <Link
        to={`/services/${service._id}`}
        aria-label={`Read more about ${service.name}`}
        className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors group"
      >
        <span className="text-lg group-hover:underline">Learn More</span>
        <HiArrowLongRight
          size={28}
          className="text-primary group-hover:text-secondary transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start`}
      data-aos="zoom-in-up"
      data-aos-duration="1000"
    >
      {/* On desktop, alternate image/text position */}
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
};

// --------------------------------------
// Main ServicesPage Component
// --------------------------------------
const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const servicesToShow = showAll ? services : services.slice(0, 3);

  return (
    <div className="bg-white py-20 lg:py-28 font-open-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className="max-w-2xl mb-16"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h4 className="text-lg font-semibold text-secondary uppercase font-montserrat">
            OUR SERVICES
          </h4>
          <h1 className="text-3xl md:text-5xl font-bold text-primary font-montserrat mt-2">
            Enjoy The Best Quality Outdoor Services
          </h1>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-16">
            {servicesToShow.map((service, index) => (
              <ServiceRow
                key={service._id}
                service={service}
                index={index}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            ))}

            {/* View More / Less Button */}
            {services.length > 3 && (
              <div className="flex justify-end mt-16">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="inline-block relative overflow-hidden group font-bold py-3 px-8 rounded-none border-2 border-primary text-primary transition-all duration-300"
                >
                  <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                    {showAll ? "View Less" : "View More"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
