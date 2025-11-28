// src/pages/GalleryPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { getManagedGalleryItems } from '../services/api';
import Spinner from '../components/Spinner';
import { X, ChevronsLeftRight } from 'lucide-react';

interface GalleryWork { 
  _id: string;
  serviceType: string;
  description: string;
  beforePhotos: string[];
  afterPhotos: string[];
}

// ============================================================================
// Image Comparison Slider Component
// ============================================================================
interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ImageCompareSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const handleMouseMove = (event: MouseEvent) => handleMove(event.clientX);
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div
      ref={imageContainerRef}
      className="relative w-full aspect-[4/3] max-w-4xl mx-auto select-none overflow-hidden rounded-none shadow-2xl bg-gray-100"
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
    >
      <img
        src={afterImage}
        alt="After"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        draggable={false}
      />

      <img
        src={beforeImage}
        alt="Before"
        className="block w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `calc(${sliderPos}% - 1px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-primary rounded-full p-2 shadow-lg">
          <ChevronsLeftRight size={24} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Timeline Entry Component (Updated Image Size)
// ============================================================================
interface TimelineEntryProps {
  work: GalleryWork;
  onClick: () => void;
  align: 'left' | 'right';
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ work, onClick, align }) => {
  const isLeft = align === 'left';
  
  let imageUrl = work.afterPhotos[0];
  if (imageUrl) {
      imageUrl = imageUrl.replace(/['"]+/g, '');
  }

  const content = (
    <div
      className="cursor-pointer group relative overflow-hidden rounded-none shadow-lg bg-gray-100"
      onClick={onClick}
      data-aos={isLeft ? 'fade-right' : 'fade-left'}
      data-aos-duration="1000"
    >
      {/* 
         ✅ FIXED IMAGE SIZE: 
         Changed 'h-auto' to 'h-64 md:h-80'.
         - w-full: Width fills the card
         - h-64: Fixed height on mobile
         - md:h-80: Fixed height on desktop
         - object-cover: Ensures image fills the box without stretching/distortion
      */}
      <img
        src={imageUrl}
        alt={work.serviceType}
        className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white font-montserrat">{work.serviceType}</h3>
        <p className="mt-2 text-gray-200 font-open-sans line-clamp-2">{work.description}</p>
        <p className="mt-3 font-semibold text-[#6FAF4B] group-hover:underline">
          Click to Compare Before & After
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center my-8 md:my-12">
      {/* Used hidden md:block to handle timeline structure on mobile vs desktop */}
      {isLeft ? content : <div className="hidden md:block" />}
      {isLeft ? <div className="hidden md:block" /> : content}
      
      {/* Timeline Dot (Only visible on desktop usually, but kept here for your structure) */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#6FAF4B] border-4 border-white z-10 shadow-sm" />
    </div>
  );
};

// ============================================================================
// Main Gallery Page
// ============================================================================
const GalleryPage: React.FC = () => {
  const [works, setWorks] = useState<GalleryWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<GalleryWork | null>(null);

  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedWork]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const galleryData = await getManagedGalleryItems();
        setWorks(galleryData);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white font-open-sans text-gray-800 overflow-x-hidden -mt-10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight font-montserrat">
            Gallery
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We showcase stunning before-and-after transformations that highlight our dedication to quality outdoor craftsmanship.
          </p>
        </div>

        {works.length === 0 ? (
          <p className="text-center text-gray-500 text-xl py-10">
            Our gallery is currently empty. Please check back soon.
          </p>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Center Line (Hidden on mobile) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-300" />
            
            {works.map((work, index) => (
              <TimelineEntry
                key={work._id}
                work={work}
                onClick={() => setSelectedWork(work)}
                align={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        )}
      </div>

      {/* =======================================================================
          MODAL
      ======================================================================= */}
      {selectedWork &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center 
                       overflow-y-auto bg-black/80 animate-fadeIn 
                       p-4 pt-16 sm:p-8 lg:pt-24"
            onClick={() => setSelectedWork(null)}
          >
            <div
              className="relative w-full max-w-3xl max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-2 right-2 z-20 bg-white text-gray-700 
                           rounded-full p-2 shadow-lg hover:bg-gray-200"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-4 mt-10">
                <h2 className="text-3xl font-bold text-white font-montserrat">
                  {selectedWork.serviceType}
                </h2>
                <p className="text-gray-300 font-open-sans">{selectedWork.description}</p>
              </div>

              <ImageCompareSlider
                beforeImage={
                  selectedWork.beforePhotos.length
                    ? `${selectedWork.beforePhotos[0].replace(/\\/g, '/')}`
                    : '/fallback-before.jpg'
                }
                afterImage={
                  selectedWork.afterPhotos.length
                    ? `${selectedWork.afterPhotos[0].replace(/\\/g, '/')}`
                    : '/fallback-after.jpg'
                }
              />
            </div>
          </div>,
          document.getElementById('modal-root')!
        )}
    </div>
  );
};

export default GalleryPage;