"use client";

import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSkeletonLoader } from "./skeleton-loader";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";

interface HeroSection {
  id: string;
  heading: string;
  subHeading: string | null;
  ctaTitle: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  imageAlignment: string | null;
  buttonBgColor: string | null;
  buttonTextColor: string | null;
  buttonRadius: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Animation variants for consistent motion effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, x: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

// Default fallback content for error states
const DEFAULT_HERO_CONTENT = {
  heading: "<span class=\"font-normal italic\">Introducing,</span> <span class=\"font-bold\">Nepal's 1st</span> and <span class=\"font-bold\">Finest Diamond Studio</span>",
  subHeading: "We crafted <span class=\"italic\">luxury</span> diamonds jewellery for worldwide",
  ctaTitle: "Discover Collection",
  ctaLink: "/products",
};

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroSection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`${getApiBaseUrl()}/hero?t=${new Date().getTime()}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const activeSlides: HeroSection[] = data.data.filter((h: HeroSection) => h.isActive);
        setSlides(activeSlides.length > 0 ? activeSlides : data.data);
        setCurrentIndex(0);
      } else {
        setError("No hero sections found");
      }
    } catch (err) {
      console.error("Error fetching hero section:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch hero section");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSection();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const id = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(id);
    }
  }, [slides.length]);

  if (isLoading || error) {
    return <HeroSkeletonLoader />;
  }

  const hasApiData = slides.length > 0;
  const currentSlide = hasApiData ? slides[currentIndex] : null;

  // If no data available, show skeleton loader
  if (!hasApiData) {
    return <HeroSkeletonLoader />;
  }

  // Sanitize HTML content to prevent XSS
  const sanitizeHtml = (html: string): string => {
    if (typeof window === 'undefined') return html;
    
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    
    // Remove any script tags
    const scripts = tmp.getElementsByTagName('script');
    while (scripts.length > 0) {
      scripts[0].parentNode?.removeChild(scripts[0]);
    }
    
    return tmp.innerHTML;
  };

  return (
    <section
      className="relative w-full h-auto lg:h-[80vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: currentSlide?.backgroundColor || '#ffffff' }}
    >
      {/* Background pattern for visual interest */}
      {!hasApiData && (
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      )}

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-32 pt-24 md:pt-0 md:py-10 lg:py-12">
        <motion.div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center max-w-9xl mx-auto`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content Column (60%) - Left Side */}
          <motion.div
            className={`text-center lg:text-left w-full lg:col-span-6 self-center relative z-20 ${currentSlide?.imageAlignment === 'left' ? 'lg:order-2 lg:pl-10 xl:pl-14' : 'lg:order-1 lg:pr-10 xl:pr-14'}`}
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl jimthompson font-normal leading-[1.1] tracking-tight"
              style={{ color: currentSlide?.textColor || '#000000' }}
              variants={itemVariants}
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(currentSlide?.heading || DEFAULT_HERO_CONTENT.heading)
              }}
            />

            {currentSlide?.subHeading && (
              <motion.h3
                className="text-base sm:text-lg md:text-xl lg:text-2xl jimthompson font-normal leading-relaxed mt-3"
                style={{ color: currentSlide?.textColor || '#333333' }}
                variants={itemVariants}
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(currentSlide?.subHeading || DEFAULT_HERO_CONTENT.subHeading)
                }}
              />
            )}

            

            {/* Call to Action Button */}
            <motion.div
              className="flex justify-center lg:justify-start mt-8"
              variants={itemVariants}
            >
              <Link href={currentSlide?.ctaLink || DEFAULT_HERO_CONTENT.ctaLink || "/products"}>
                <motion.button
                  className="group relative inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 text-xl font-semibold overflow-hidden font-sans"
                  style={{
                    background: currentSlide?.buttonBgColor || '#f59e0b',
                    color: currentSlide?.buttonTextColor || '#ffffff',
                    borderRadius: `${currentSlide?.buttonRadius ?? 9999}px`
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2 ">
                    {currentSlide?.ctaTitle || DEFAULT_HERO_CONTENT.ctaTitle}
                    <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  
                
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Column (40%) - Right Side */}
          <motion.div
            className={`relative w-full lg:col-span-6 flex items-center ${currentSlide?.imageAlignment === 'left' ? 'lg:order-1 justify-start' : 'lg:order-2 justify-end'} z-10`}
            variants={imageVariants}
          >

            <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] overflow-hidden  ">
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {hasApiData && currentSlide?.imageUrl && (
                  <Image
                    src={getImageUrl(currentSlide.imageUrl)}
                    alt={(currentSlide.heading || '').replace(/<[^>]*>/g, "") || "Hero image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                   
                  />
                ) }
              </motion.div>
              
              
            </div>
          </motion.div>
        </motion.div>

        {/* Carousel Controls */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full ${idx === currentIndex ? 'bg-amber-600' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
        {slides.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            <button
              onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}
              className="p-2 rounded-full bg-white/70 hover:bg-white shadow"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}
              className="p-2 rounded-full bg-white/70 hover:bg-white shadow"
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
