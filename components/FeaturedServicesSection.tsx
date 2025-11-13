// src/components/FeaturedServicesSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';

interface Props {
  services: Service[];
}

const ServiceHoverCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  return (
    <div 
      className="relative group overflow-hidden h-[450px] rounded-none shadow-lg"
      data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-delay={index * 100}
    >
      {/* --- UPDATED: use an <img> tag and normalize backslashes in the path --- */}
      <img
        src={`backend/${service.imageUrl.replace(/\\/g, '/')}`}
        alt={service.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-black/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold font-montserrat mb-2">{service.name}</h3>
        <p className="font-open-sans text-gray-200 mb-6 line-clamp-3">{service.description}</p>
        <Link 
          to={`/services/${service._id}`}
          className="inline-block relative overflow-hidden group/button font-bold py-2 px-6 rounded-none border-2 border-white text-white transition-all duration-300"
        >
          <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover/button:w-full z-0"></span>
          <span className="relative z-10">Learn More</span>
        </Link>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:-translate-y-full transition-all duration-500 ease-in-out pointer-events-none group-hover:opacity-0">
         <h3 className="text-3xl font-bold font-montserrat">{service.name}</h3>
      </div>
    </div>
  );
};

const FeaturedServicesSection: React.FC<Props> = ({ services }) => {
  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className="flex md:flex-row flex-col items-center justify-between gap-4 mb-12"
          data-aos="fade-up"
          data-aos-duration="1000" 
        >
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-secondary font-montserrat">
              QUALITY & PRECISION
            </p>
            <h2 className="text-3xl md:text-4xl text-primary font-bold font-montserrat mt-1">
              Our Services
            </h2>
          </div>
          <div className="text-center md:text-right max-w-lg">
            {/* Optional paragraph can go here */}
          </div>
<div className="text-right mt-12 hidden lg:block">

  <Link 
      to="/services" 
      className="inline-block relative overflow-hidden group font-bold py-3 px-8 rounded-none border-2 border-primary text-primary transition-all duration-300"
  >
      <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">View All Services</span>
  </Link>
</div>

        </div>
        
        {/* Grid layout for services */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service, index) => (
              <ServiceHoverCard key={service._id} service={service} index={index} />
            ))}
          </div>
          {services.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {services.slice(3, 5).map((service, index) => (
                <ServiceHoverCard key={service._id} service={service} index={index + 3} />
              ))}
            </div>
          )}
        </div>
 
      </div>
    </section>
  );
};

export default FeaturedServicesSection;
