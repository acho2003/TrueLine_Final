import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoSrc from "../assets/logo.png";

// --- ICONS ---
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollPosition;
};

// --- HEADER COMPONENT ---
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 20;

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/services", name: "Services" },
    { path: "/gallery", name: "Gallery" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/blog", name: "Blog" },
  ];

  const navLinkClasses =
    "relative text-[#313647] hover:text-[#6FAF4B] transition-colors duration-300 font-medium after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:w-full after:h-[2px] after:bg-[#6FAF4B] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const activeNavLinkClasses = "text-[#6FAF4B] after:scale-x-100";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 font-montserrat ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white/80"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 
            ${isScrolled ? "h-16 sm:h-20" : "h-20 sm:h-24"}`}
        >
          {/* --- LOGO --- */}
          <Link
            to="/"
            className="flex items-center gap-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src={logoSrc}
              alt="TrueLine Pro Services Logo"
              className={`transition-all duration-300 
                ${isScrolled ? "h-14 w-14 sm:h-20 sm:w-20 mr-1" : "h-20 w-20 sm:h-32 sm:w-32"}`}
            />

            {/* --- Hide text on mobile --- */}
            <div className="hidden sm:flex flex-col">
              <span className="text-3xl font-bold text-[#313647] leading-none -ml-12">
                TrueLine
              </span>
              <span className="text-md font-normal text-[#4A5C6A] -mt-1 tracking-wide -ml-11">
                Pro Services
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* --- RIGHT SIDE --- */}
          <div className="flex items-center gap-4">
            <Link
              to="/booking"
              className="hidden sm:inline-block relative overflow-hidden group font-bold py-3 px-7 rounded-none border-2 border-[#6FAF4B] transition-all duration-300 ease-in-out"
            >
              <span className="absolute top-0 left-0 w-0 h-full bg-[#6FAF4B] transition-all duration-300 ease-in-out group-hover:w-full z-0"></span>
              <span className="relative z-10 text-[#6FAF4B] group-hover:text-white transition-colors duration-300">
                Get A Quote
              </span>
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <CloseIcon
                  className={`w-7 h-7 ${
                    isScrolled ? "text-[#313647]" : "text-black"
                  }`}
                />
              ) : (
                <MenuIcon
                  className={`w-7 h-7 ${
                    isScrolled ? "text-[#313647]" : "text-black"
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
      >
        <div className="flex flex-col items-start space-y-5 px-8 py-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg ${navLinkClasses} ${
                  isActive ? activeNavLinkClasses : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/booking"
            onClick={() => setIsMenuOpen(false)}
            className="mt-6 font-bold py-3 px-6 border-2 border-[#6FAF4B] text-[#6FAF4B] hover:bg-[#6FAF4B] hover:text-white transition-all duration-300"
          >
            Get A Quote
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
