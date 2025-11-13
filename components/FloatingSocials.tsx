// src/components/FloatingSocials.tsx

import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";

const FloatingSocials = () => {
  return (
    <div className="fixed right-6 bottom-[7.5rem] z-40 flex flex-col gap-4">
      <a
       href="https://wa.me/61415331913"// Replace with your WhatsApp link
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full text-white bg-[#25D366] flex items-center justify-center 
                   text-2xl cursor-pointer transition-transform duration-300 hover:scale-110 shadow-lg"
      >
       

        <FaWhatsapp />
      </a>
     

    </div>
  );
};

export default FloatingSocials;