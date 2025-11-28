// src/components/AboutSection.tsx

import { Link } from "react-router-dom";

// --- Import the images for this section ---
import aboutImage1 from "../assets/about2.jpg";
import aboutImage2 from "../assets/banners.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-x-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* 1st Column (Text then Image) - FOCUSED ON FENCING & SAFETY */}
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
              TrueLine is your go-to expert for durable, high-quality boundaries. 
              We specialize in the <strong>installation of new Colorbond fences and gates</strong>, 
              as well as extensions to increase height and privacy. 
              <br /><br />
              We don't just build; we clear the way safely. Our team is trained and licensed 
              to handle the removal of old gates and strictly adheres to safety regulations 
              for the <strong>removal of non-friable asbestos fencing</strong>, keeping your property safe.
            </p>
          </div>
          <div className="mt-8 lg:mt-12">
            <img
              src={aboutImage1}
              alt="Colorbond fence installation and removal works"
              className="rounded-none shadow-md w-full object-cover"
            />
          </div>
        </div>

        {/* 2nd Column (Image then Text) - FOCUSED ON MAINTENANCE & GARDENING */}
        <div data-aos="fade-left" data-aos-duration="1200">
          <div>
            <img
              src={aboutImage2}
              alt="Garden maintenance and lawn mowing"
              className="rounded-none shadow-md w-full object-cover"
            />
          </div>
          <div className="mt-8 lg:mt-12">
            <p className="text-base text-gray-600 font-open-sans leading-relaxed mb-6">
              Beyond fencing, we maintain the entire surroundings of your building or office. 
              Our <strong>property care services</strong> include professional lawn mowing, 
              trimming, and general gardening to keep your outdoor areas healthy and neat.
              <br /><br />
              We take the hassle out of property management by cutting down overgrown grass, 
              cleaning outdoor areas, and handling <strong>general waste and bin pickup</strong>. 
              Whether it’s a residential yard or commercial premises, we leave your space spotless.
            </p>
            <Link
              to="/about"
              className="inline-block relative overflow-hidden group font-bold py-3 px-8 rounded-none border-2 border-primary text-primary transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                About us
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
