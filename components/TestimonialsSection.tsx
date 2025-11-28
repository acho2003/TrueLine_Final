// src/components/TestimonialsSection.tsx
import React, { useState, useEffect } from "react";
import { FaStar, FaArrowLeft, FaArrowRight, FaUser } from "react-icons/fa";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { getTestimonials, Testimonial } from "../services/api"; // Ensure these imports match your api.ts

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          <FaStar
            className={index < rating ? 'text-yellow-400' : 'text-gray-500'}
            size={18}
          />
        </span>
      ))}
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2, spacing: 30 } },
      "(min-width: 1200px)": { slides: { perView: 3, spacing: 30 } },
    },
    loop: true,
    initial: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Force slider update when testimonials data arrives
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [testimonials, instanceRef]);

  if (loading) return <div className="py-20 text-center text-gray-500">Loading Reviews...</div>;
  
  // Don't hide the section if empty, maybe show a placeholder or return null
  if (testimonials.length === 0) return null; 

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
          <p className="text-lg font-semibold text-secondary font-montserrat">TESTIMONIALS</p>
          <h2 className="text-3xl md:text-4xl text-primary font-bold font-montserrat mt-1">What Our Customers Say</h2>
        </div>

        {/* Slider container */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial._id} className="keen-slider__slide p-2">
                <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay={index * 100}>
                  <div className="bg-primary p-8 relative rounded-none 
                                before:absolute before:w-6 before:h-6 before:bg-primary 
                                before:rotate-45 before:left-12 before:-bottom-3">
                    <StarRating rating={testimonial.rating} />
                    <p className="font-open-sans text-base text-gray-300 leading-relaxed mt-6 italic">
                      "{testimonial.reviewText}"
                    </p>
                  </div>
                  <div className="flex items-center mt-10">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-gray-400 text-3xl" />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-xl text-primary font-bold font-montserrat">
                        {testimonial.name}
                      </h4>
                      <p className="text-base text-gray-500 font-open-sans">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        {instanceRef.current && testimonials.length > 1 && (
          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              onClick={() => instanceRef.current?.prev()}
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={20} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Next testimonial"
            >
              <FaArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// 👇 THIS EXPORT WAS LIKELY MISSING
export default TestimonialsSection;