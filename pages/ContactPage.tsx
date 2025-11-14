

// src/pages/ContactPage.tsx

import React, { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import emailjs from "emailjs-com";

const ContactInfoItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
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
          {/* LEFT SIDE */}
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold text-primary mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-6">
              You can call, email, or message us anytime. We’ll get back to you as soon as possible.
            </p>

            <ContactInfoItem icon={<IoIosCall />} title="Call Us Now">
              <a href="tel:+61415331913" className="hover:text-secondary">(+61) 415 331 913</a>
            </ContactInfoItem>

            <ContactInfoItem icon={<MdEmail />} title="Send An Email">
              <a href="mailto:wangchukmax@gmail.com" className="hover:text-secondary">wangchukmax@gmail.com</a>
            </ContactInfoItem>

            <ContactInfoItem icon={<MdOutlineShareLocation />} title="Our Location">
              <p>50 Francisco Street, Rivervale WA 6103</p>
            </ContactInfoItem>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="bg-primary p-8 md:p-12" data-aos="fade-left">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Send Us A Message</h2>

            <form className="space-y-6" onSubmit={sendEmail}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full h-14 px-4 bg-transparent border border-gray-600 text-white placeholder-gray-400"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full h-14 px-4 bg-transparent border border-gray-600 text-white placeholder-gray-400"
                required
              />

              <textarea
                name="message"
                rows={5}
                placeholder="Write your message"
                className="w-full p-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 resize-none"
                required
              ></textarea>

              {/* Hidden time field */}
              <input type="hidden" name="time" value={new Date().toLocaleString()} />

              <button
                type="submit"
                className="w-full font-bold py-4 px-8 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-green-400 text-center mt-2">Message sent successfully! ✔</p>
              )}

              {status === "error" && (
                <p className="text-red-400 text-center mt-2">Failed to send message. Try again.</p>
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
