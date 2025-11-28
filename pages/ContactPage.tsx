// src/pages/ContactPage.tsx

import React, { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import emailjs from "emailjs-com";

const ContactInfoItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex items-center my-6 group">
    <div className="w-16 h-16 bg-gray-100 group-hover:bg-secondary flex items-center justify-center transition-all">
      {React.cloneElement(icon as React.ReactElement, {
        className: "text-secondary group-hover:text-white transition-colors",
        size: 30,
      })}
    </div>
    <div className="ml-5">
      <p className="text-base text-gray-500">{title}</p>
      <div className="text-lg font-semibold text-primary">{children}</div>
    </div>
  </div>
);

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    emailjs
      .sendForm(
        "service_ocma4xd", // Your EmailJS service ID
        "template_cktuw8a", // Your EmailJS template ID
        e.currentTarget,
        "SBTaePTVsPz4ft824" // Your EmailJS public key
      )
      .then(
        () => {
          setStatus("success");
          setLoading(false);
          e.currentTarget.reset();
        },
        () => {
          setStatus("error");
          setLoading(false);
        }
      );
  };

  return (
    <div className="font-open-sans">
      {/* Contact Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - CONTACT INFO */}
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-6">
              Have questions? You can call or email us directly. Or, if we've worked together, please use the form on the right to leave us a review!
            </p>

            <ContactInfoItem icon={<IoIosCall />} title="Call Us Now">
              <a href="tel:+61415331913" className="hover:text-secondary">
                (+61) 415 331 913
              </a>
            </ContactInfoItem>

            <ContactInfoItem icon={<MdEmail />} title="Send An Email">
              <a
                href="mailto:wangchukmax@gmail.com"
                className="hover:text-secondary"
              >
                wangchukmax@gmail.com
              </a>
            </ContactInfoItem>

            <ContactInfoItem
              icon={<MdOutlineShareLocation />}
              title="Our Location"
            >
              <p>50 Francisco Street, Rivervale WA 6103</p>
            </ContactInfoItem>
          </div>

          {/* RIGHT SIDE: TESTIMONIAL FORM */}
          <div className="bg-primary p-8 md:p-12" data-aos="fade-left">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Share Your Experience
            </h2>
            <p className="text-gray-400 text-center mb-8 text-sm">
              We value your feedback. Let us know how we did!
            </p>

            <form className="space-y-6" onSubmit={sendEmail}>
              {/* Name Field */}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full h-14 px-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-secondary transition-colors"
                required
              />

              {/* Location Field (Replaced Email) */}
              <input
                type="text"
                name="location"
                placeholder="Your Location (e.g. Rivervale, Perth)"
                className="w-full h-14 px-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-secondary transition-colors"
                required
              />

              {/* Star Rating Dropdown */}
              <div className="relative">
                <select
                  name="rating"
                  className="w-full h-14 px-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
                  required
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-500 bg-primary">
                    Select a Star Rating
                  </option>
                  <option value="5 Stars" className="text-black">
                    ⭐⭐⭐⭐⭐ (5 Stars) - Excellent
                  </option>
                  <option value="4 Stars" className="text-black">
                    ⭐⭐⭐⭐ (4 Stars) - Very Good
                  </option>
                  <option value="3 Stars" className="text-black">
                    ⭐⭐⭐ (3 Stars) - Good
                  </option>
                  <option value="2 Stars" className="text-black">
                    ⭐⭐ (2 Stars) - Fair
                  </option>
                  <option value="1 Star" className="text-black">
                    ⭐ (1 Star) - Poor
                  </option>
                </select>
                {/* Custom arrow for dropdown */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Message Field */}
              <textarea
                name="message"
                rows={5}
                placeholder="Write your testimonial here..."
                className="w-full p-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-secondary transition-colors"
                required
              ></textarea>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full font-bold py-4 px-8 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Testimonial"}
              </button>

              {/* Status Messages */}
              {status === "success" && (
                <div className="text-center mt-4 p-3 bg-green-500/20 border border-green-500 rounded">
                  <p className="text-green-400 font-bold">Thank you!</p>
                  <p className="text-green-200 text-sm">Your feedback has been sent successfully.</p>
                </div>
              )}

              {status === "error" && (
                <p className="text-red-400 text-center mt-2">
                  Failed to send. Please try again later.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section data-aos="fade-up" data-aos-duration="1000">
        <iframe
          // IMPORTANT: Replace with your Google Maps embed code
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.111811634685!2d115.9015978!3d-31.9575916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bb5e8e3c5d6f%3A0x7d2f9d518d661445!2s50%20Francisco%20St%2C%20Rivervale%20WA%206103%2C%20Australia!5e0!3m2!1sen!2sus!4v1672886400000!5m2!1sen!2sus"
          height={450}
          allowFullScreen={true}
          loading="lazy"
          className="w-full border-0 filter grayscale-[100%]"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;