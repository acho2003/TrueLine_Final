import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
    >
      {/* Background image (taller height) */}
      <img
        src={`https://trueline.onrender.com/${service.imageUrl.replace(/\\/g, '/')}`}
        alt={service.name}
        className="w-full h-80 object-cover" // increased height from h-64 → h-80
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

      {/* Text and button overlay */}
      <div className="absolute bottom-0 p-8 text-white z-10">
        <h3 className="text-3xl font-bold mb-3 drop-shadow-md">{service.name}</h3>
        <p className="text-base mb-4 line-clamp-3 opacity-90">{service.description}</p>
       
        <Link
          to="/booking"
          state={{ selectedService: service.id }}
          className="inline-block bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
         Get A Quote
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
