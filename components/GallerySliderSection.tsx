// src/components/GallerySliderSection.tsx
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const API_BASE_URL = "https://trueline.onrender.com";

interface GalleryWork {
  _id: string;
  serviceType: string;
  afterPhotos: string[];
}

interface Props {
  works: GalleryWork[];
}

const GallerySliderSection: React.FC<Props> = ({ works }) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { origin: "center", perView: 1.25, spacing: 15 },
      },
      "(min-width: 600px)": {
        slides: { origin: "center", perView: 1.5, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { origin: "center", perView: 2.25, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { origin: "center", perView: 2.5, spacing: 30 },
      },
      "(min-width: 1280px)": {
        slides: { origin: "center", perView: 3.5, spacing: 30 },
      },
    },
    loop: true,
    initial: 0,
  });

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <p className="text-lg font-semibold text-secondary font-montserrat">
            OUR GALLERY
          </p>
          <h2 className="text-3xl md:text-4xl text-primary font-bold font-montserrat mt-1">
            Our Recent Work
          </h2>
          <p className="text-gray-600 font-open-sans mt-4 max-w-2xl mx-auto">
            See the quality and transformations we deliver. Click on any project
            to see more in our full gallery.
          </p>
        </div>
      </div>

      {/* Full-width Slider Content */}
      <div className="mt-8">
        <div ref={sliderRef} className="keen-slider">
          {works.map((work) => {
            // ✅ Fix: normalize path and prepend API URL
            const normalizedPath = `${API_BASE_URL}/${work.afterPhotos[0].replace(/\\/g, "/")}`;

            return (
              <div key={work._id} className="keen-slider__slide">
                <Link
                  to="/gallery"
                  className="block group relative overflow-hidden h-[500px] rounded-none shadow-lg"
                >
                  {/* ✅ Image */}
                  <img
                    src={normalizedPath}
                    alt={work.serviceType}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />

                  {/* Overlay and text */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                  <div
                    className="absolute left-4 right-4 text-center text-white transition-all duration-500 ease-in-out
                              opacity-0 -bottom-1/4 group-hover:opacity-100 group-hover:bottom-1/2 group-hover:-translate-y-1/2"
                  >
                    <h3 className="text-3xl font-bold font-montserrat">
                      {work.serviceType}
                    </h3>
                    <p className="font-open-sans text-lg mt-2 underline">
                      View Gallery
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      {instanceRef.current && works.length > 1 && (
        <div className="flex items-center justify-end gap-4 mt-8 container mx-auto px-4">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Previous project"
          >
            <FaArrowLeft size={20} />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Next project"
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySliderSection;
