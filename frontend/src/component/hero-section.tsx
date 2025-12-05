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
  description: string | null;
  ctaTitle: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
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
  description: "Discover, design, and celebrate with masterpieces that reflect your story.",
  ctaTitle: "Discover Collection",
  ctaLink: "/products",
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
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
        // Get the first active hero section or fallback to first available
        const activeHero = data.data.find((hero: HeroSection) => hero.isActive) || data.data[0];
        setHeroData(activeHero);
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

  // Render loading state or error state with skeleton
  if (isLoading || error) {
    return <HeroSkeletonLoader />;
  }

  // Determine content to display
  const content = heroData;
  const hasApiData = !!heroData;

  // If no data available, show skeleton loader
  if (!heroData) {
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
    <section className="relative w-full h-[80vh] flex items-start justify-center overflow-hidden bg-white">
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

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-32 py-8 md:py-10 lg:py-12">
        <motion.div
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-start max-w-9xl mx-auto h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content Column (60%) - Left Side */}
          <motion.div
            className="text-center lg:text-left w-full lg:w-6/10 py-3"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl jimthompson font-normal text-gray-900 leading-[1.1] tracking-tight "
              variants={itemVariants}
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(content?.heading || DEFAULT_HERO_CONTENT.heading)
              }}
            />

            {content?.subHeading && (
              <motion.h3
                className="text-base sm:text-lg md:text-xl lg:text-2xl jimthompson font-normal text-gray-800 leading-relaxed pt-3 pb-2"
                variants={itemVariants}
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(content?.subHeading || DEFAULT_HERO_CONTENT.subHeading)
                }}
              />
            )}

            {content?.description && (
              <motion.p
                className="text-xs sm:text-sm md:text-2xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 pt-3 pb-3  font-sans"
                variants={itemVariants}
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(content?.description || DEFAULT_HERO_CONTENT.description)
                }}
              />
            )}

            {/* Call to Action Button */}
            <motion.div
              className="flex justify-center lg:justify-start  "
              variants={itemVariants}
            >
              <Link href={content?.ctaLink || DEFAULT_HERO_CONTENT.ctaLink || "/products"}>
                <motion.button
                  className="group relative inline-flex items-center gap-2  px-6 md:px-8 py-3 md:py-4 rounded-full text-xl font-semibold text-white overflow-hidden font-sans"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500" />
                  
                  {/* Hover effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 ">
                    {content?.ctaTitle || DEFAULT_HERO_CONTENT.ctaTitle}
                    <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  
                
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Column (40%) - Right Side */}
          <motion.div
            className="relative w-full lg:w-4/10 flex items-center justify-end"
            variants={imageVariants}
          >

            <div className="relative aspect-[3/4] w-full max-h-[70vh] overflow-hidden ">
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {hasApiData && heroData?.imageUrl && (
                  <Image
                    src={getImageUrl(heroData.imageUrl)}
                    alt={heroData.heading.replace(/<[^>]*>/g, "") || "Hero image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    onError={(e) => {
                      console.warn("Hero image failed to load, using fallback");
                      e.currentTarget.src = "/model.png";
                    }}
                  />
                ) }
              </motion.div>
              
             
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}