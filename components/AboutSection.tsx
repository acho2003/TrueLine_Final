// src/components/AboutSection.tsx

import { Link } from "react-router-dom";

// --- Import the images for this section ---
import aboutImage1 from "../assets/banner2.jpg";
import aboutImage2 from "../assets/banner.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-x-hidden">
      {" "}
      {/* Added overflow-x-hidden to prevent horizontal scrollbars during animation */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* 1st Column (Text then Image) */}
        {/* MODIFIED: Animation now applies to the whole column from the right */}
        <div data-aos="fade-right" data-aos-duration="1200">
          <div>
            <p className="text-lg leading-7 text-secondary flex items-center font-semibold font-montserrat">
              <span className="w-16 h-px inline-block bg-secondary mr-4"></span>
              ABOUT TRUELINE
            </p>
            <h2 className="text-3xl lg:text-4xl leading-tight text-primary mt-3 mb-5 font-bold font-montserrat">
              Your Vision, Executed with Unmatched Quality
            </h2>
            <p className="text-base text-gray-600 font-open-sans leading-relaxed">
              At TrueLine, we believe an outdoor space is more than just
              land it's an extension of your home. It's where memories are made.
              Our team is dedicated to transforming your vision into a reality
              with precision, professionalism, and a deep respect for your
              property.
            </p>
          </div>
          <div className="mt-8 lg:mt-12">
            {/* MODIFIED: Changed rounded-lg to rounded-none for sharp corners */}
            <img
              src={aboutImage1}
              alt="A beautifully manicured lawn and garden bed"
              className="rounded-none shadow-md"
            />
          </div>
        </div>

        {/* 2nd Column (Image then Text) */}
        {/* MODIFIED: Animation now applies to the whole column from the left */}
        <div data-aos="fade-left" data-aos-duration="1200">
          <div>
            {/* MODIFIED: Changed rounded-lg to rounded-none for sharp corners */}
            <img
              src={aboutImage2}
              alt="A newly installed custom fence"
              className="rounded-none shadow-md"
            />
          </div>
          <div className="mt-8 lg:mt-12">
            <p className="text-base text-gray-600 font-open-sans leading-relaxed mb-6">
              From the initial consultation to the final walkthrough, we
              prioritize clear communication and meticulous craftsmanship. We
              use only high-quality materials and proven techniques to ensure
              your new lawn, garden, or fence is not only beautiful but also
              built to last.
            </p>
            <Link
              to="/about"
              // The Link tag itself becomes the button container
              className="inline-block relative overflow-hidden group font-bold py-3 px-8 rounded-none border-2 border-primary text-primary transition-all duration-300 transform hover:scale-105"
            >
              {/* The animated GREEN fill effect */}
              <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>

              {/* The text on top */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Learn More About Us
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
