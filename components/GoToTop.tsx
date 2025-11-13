// src/components/GoToTop.tsx

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const goToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    setIsVisible(scrollTop > 100); // Show button after scrolling 100px
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {isVisible && (
        <div 
          onClick={goToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                     bg-white text-primary border-2 border-primary
                     hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Go to top"
        >
          <FaArrowUp className="text-xl animate-float" />
        </div>
      )}
    </>
  );
};

export default GoToTop;