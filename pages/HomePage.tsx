// src/pages/HomePage.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices, getManagedGalleryItems } from "../services/api";
import { Service } from "../types";
import ServiceCard from "../components/ServiceCard";
import Spinner from "../components/Spinner";
import AboutSection from "../components/AboutSection";
import FeaturedServicesSection from "../components/FeaturedServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";
// import GallerySliderSection from "../components/GallerySliderSection";
import banner1 from "../assets/banners.jpg";
import { Phone, Mail } from "lucide-react";
import "aos/dist/aos.css";
import AOS from "aos";

interface GalleryWork {
  _id: string;
  serviceType: string;
  afterPhotos: string[];
}

const API_BASE_URL = "https://trueline.onrender.com";

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [works, setWorks] = useState<GalleryWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, galleryData] = await Promise.all([
          getServices(),
          getManagedGalleryItems(),
        ]);
        setServices(servicesData);
        setWorks(galleryData);
      } catch (err: any) {
        setError("Failed to load page content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // ✅ Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 200,
      easing: "ease-in-out",
    });
  }, []);
  const heroHeading = "WA’s Trusted Name in Outdoor Services".split(" ");

  return (
    <div className="font-open-sans">
      <section className="relative h-screen bg-black overflow-hidden">
        {/* --- MODIFIED: Added responsive background position classes --- */}
        <div
          // bg-center is the default for mobile. On medium screens and up, it will also be centered.
          // You can change this, e.g., 'bg-top md:bg-center' to focus on the top for mobile.
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner1})`,
            animation: "zoomIn 8s ease-in-out forwards",
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative h-full flex flex-col justify-center container mx-auto px-4 text-left text-white z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight font-montserrat">
              {heroHeading.map((word, index) => (
                <span
                  key={index}
                  className="inline-block animate-fadeInUp"
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </h1>
            <p
              className="text-lg md:text-xl mb-8 animate-fadeInUp"
              style={{ animationDelay: "600ms" }}
            >
              We create beautiful outdoor spaces. From pristine lawns to custom
              fences, your vision is our priority.
            </p>
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 animate-fadeInUp"
              style={{ animationDelay: "700ms" }}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-[#6FAF4B]" strokeWidth={2.5} />
                <span className="text-lg text-white font-semibold">
                  +61 415 331 913
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#6FAF4B]" strokeWidth={2.5} />
                <span className="text-lg text-white font-semibold">
                  wangchukmax@gmail.com
                </span>
              </div>
            </div>

            {/* --- EXISTING BUTTON --- */}
            <Link
              to="/booking"
              className="inline-block relative overflow-hidden group font-bold py-4 px-10 rounded-none border-2 border-white transition-all duration-300 ease-in-out animate-fadeInUp"
              style={{ animationDelay: "900ms" }}
            >
              <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
              <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                Get a Quote
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div data-aos="fade-up" data-aos-offset="150">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : (
          <FeaturedServicesSection services={services} />
        )}
      </div>
      <div data-aos="fade-up" data-aos-offset="150">
        <AboutSection />
      </div>
      <div data-aos="fade-up" data-aos-offset="150">
        <TestimonialsSection />
      </div>
      {/* Recent Work Section */}
      {/* <div data-aos="fade-up" data-aos-offset="150">
        <GallerySliderSection works={works} />
      </div> */}
    </div>
  );
};

export default HomePage;
