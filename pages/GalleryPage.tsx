// src/pages/GalleryPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // 1. IMPORT ReactDOM - THIS IS CRITICAL TO PREVENT CRASHES
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
// Image Comparison Slider Component (Unchanged)
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
      <img src={afterImage} alt="After" className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} draggable={false} />
      <img src={beforeImage} alt="Before" className="block w-full h-full object-cover pointer-events-none" draggable={false} />
      <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `calc(${sliderPos}% - 1px)` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-primary rounded-full p-2 shadow-lg"><ChevronsLeftRight size={24} /></div>
      </div>
    </div>
  );
};

// ============================================================================
// Timeline Entry Component (Unchanged)
// ============================================================================
interface TimelineEntryProps {
  work: GalleryWork;
  onClick: () => void;
  align: 'left' | 'right';
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ work, onClick, align }) => {
  const isLeft = align === 'left';
  const imageUrl = `backend/${work.afterPhotos[0].replace(/\\/g, '/')}`;

  const content = (
    <div
      className="cursor-pointer group relative overflow-hidden rounded-none shadow-lg"
      onClick={onClick}
      data-aos={isLeft ? 'fade-right' : 'fade-left'}
      data-aos-duration="1000"
    >
      <img
        src={imageUrl}
        alt={work.serviceType}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex flex-col justify-end">
        <div>
          <h3 className="text-xl font-bold text-white font-montserrat">{work.serviceType}</h3>
          <p className="mt-2 text-gray-200 font-open-sans line-clamp-2">{work.description}</p>
          <p className="mt-3 font-semibold text-[#6FAF4B] group-hover:underline">Click to Compare Before & After</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative grid grid-cols-2 gap-12 items-start my-8">
      {isLeft ? content : <div />}
      {isLeft ? <div /> : content}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#6FAF4B] border-4 border-white z-10" />
    </div>
  );
};


// ============================================================================
// Main Gallery Page Component
// ============================================================================
const GalleryPage: React.FC = () => {
  const [works, setWorks] = useState<GalleryWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<GalleryWork | null>(null);

  // 2. USE A MORE ROBUST BODY SCROLL LOCK EFFECT
  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'auto'; // Restore background scroll
    }
    // Cleanup function
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
        setError(err.message || 'Failed to load our work.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);
  
  // No changes to loading/error states...

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
            Our gallery is currently empty. Please check back soon for updates!
          </p>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-300" />
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

      {/* 3. USE A PORTAL TO RENDER THE MODAL OUTSIDE THE STACKING CONTEXT */}
      {selectedWork && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn p-4"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedWork(null)}
              className="absolute -top-2 -right-2 z-10 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-200"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-white font-montserrat">{selectedWork.serviceType}</h2>
              <p className="text-gray-300 font-open-sans">{selectedWork.description}</p>
            </div>
            <ImageCompareSlider
              beforeImage={
                selectedWork.beforePhotos.length
                  ? `backend/${selectedWork.beforePhotos[0].replace(/\\/g, '/')}`
                  : '/fallback-before.jpg'
              }
              afterImage={
                selectedWork.afterPhotos.length
                  ? `backend/${selectedWork.afterPhotos[0].replace(/\\/g, '/')}`
                  : '/fallback-after.jpg'
              }
            />
          </div>
        </div>,
        document.getElementById('modal-root')! // The '!' tells TypeScript we are sure this element exists
      )}
    </div>
  );
};

export default GalleryPage;