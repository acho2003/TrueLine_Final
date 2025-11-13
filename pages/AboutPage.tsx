// src/pages/AboutPage.tsx

import React, { useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import { FaRegStar, FaShieldAlt, FaHandsHelping, FaPlay } from "react-icons/fa"; // Import FaPlay
import FsLightbox from "fslightbox-react"; // Import the lightbox

// --- Import your images ---
import aboutBanner from "../assets/banner.jpg";
import aboutMainImage from "../assets/about2.jpg";
import videoBgImage from "../assets/vid.jpg"; // Add your new background image

// Reusable component for the "Our Values" section
const ValueCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="text-center p-6" data-aos="fade-up" data-aos-duration="1000">
    <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold font-montserrat text-primary mb-2">
      {title}
    </h3>
    <p className="text-gray-600 font-open-sans">{children}</p>
  </div>
);

const AboutPage: React.FC = () => {
  // --- NEW: State for the video lightbox ---
  const [toggler, setToggler] = useState(false);

  return (
    <div className="font-open-sans bg-white">
      {/* Section 1: Hero Banner */}
      <section
        className="relative bg-cover bg-center text-white py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${aboutBanner})`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat animate-fadeInUp">
            About TrueLine
          </h1>
          <p
            className="text-lg md:text-xl mt-4 max-w-3xl mx-auto animate-fadeInUp"
            style={{ animationDelay: "200ms" }}
          >
            WA’s Trusted Name in Outdoor Services.
          </p>
        </div>
      </section>

      {/* Section 2: Main About Content */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-aos="fade-right" data-aos-duration="1000">
            <img
              src={aboutMainImage}
              alt="A beautiful landscape project by TrueLine"
              className="w-full h-auto object-cover rounded-none shadow-lg"
            />
          </div>
          <div data-aos="fade-left" data-aos-duration="1000">
            <p className="text-lg font-semibold text-secondary font-montserrat">
              OUR STORY
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary font-montserrat mt-2 mb-6">
              More Than a Decade of Crafting WA's Finest Outdoor Spaces
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded with a passion for nature and a commitment to quality,
              TrueLine has been the trusted name in transforming properties into
              beautiful, functional, and sustainable outdoor living areas.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe a well-maintained yard is an extension of your home a
              place for relaxation, memories, and pride. Our mission is to bring
              your unique vision to life with reliability and unmatched
              craftsmanship.
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-block relative overflow-hidden group font-bold py-3 px-8 rounded-none border-2 border-primary text-primary transition-all duration-300"
              >
                <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Get In Touch
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Core Values */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl text-primary font-bold font-montserrat">
              Our Core Values
            </h2>
            <p className="text-gray-600 mt-4">
              The principles that guide every project we undertake.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<FaRegStar size={30} />}
              title="Uncompromising Quality"
            >
              We use only the best materials and proven techniques to ensure
              your project is not only beautiful but built to last.
            </ValueCard>
            <ValueCard
              icon={<FaShieldAlt size={30} />}
              title="Reliability & Trust"
            >
              We respect your time and property. Our team is punctual,
              professional, and committed to clear communication from start to
              finish.
            </ValueCard>
            <ValueCard
              icon={<FaHandsHelping size={30} />}
              title="Customer Satisfaction"
            >
              Your vision is our blueprint. We work closely with you to ensure
              the final result exceeds your expectations.
            </ValueCard>
          </div>
        </div>
      </section>

      {/* --- NEW: Section 4: Video Section --- */}
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${videoBgImage})`,
        }}
      >
        <div
          className="container mx-auto px-4 text-center text-white"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat">
            See Our Craftsmanship in Action
          </h2>
          <p className="mt-4 max-w-2xl mx-auto">
            A quick look into how we bring precision and passion to every
            project.
          </p>
          <div className="mt-8">
            <button
              onClick={() => setToggler(!toggler)}
              className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-secondary transition-all duration-300 flex items-center justify-center mx-auto"
              aria-label="Play Video"
            >
              <FaPlay size={30} className="ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* --- NEW: The Lightbox Component --- */}
      <FsLightbox
        toggler={toggler}
        sources={[
          "https://www.youtube.com/watch?v=XvRdRGWnJLs", // <-- REPLACE with your actual YouTube video link
        ]}
      />
    </div>
  );
};

export default AboutPage;
