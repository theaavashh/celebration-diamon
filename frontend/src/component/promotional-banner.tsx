"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface PromotionalBanner {
  id: string;
  title: string;
  description: string | null;
  text: string;
  linkText: string | null;
  linkUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const PromotionalBanner = () => {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        console.log('Fetching promotional banners from API...');
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/banners');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Promotional banners API response:', data);
        
        if (data.success && data.data) {
          // Filter active banners and sort by priority (highest first)
          const activeBanners = data.data
            .filter((banner: PromotionalBanner) => {
              if (!banner.isActive) return false;
              
              const now = new Date();
              const startDate = banner.startDate ? new Date(banner.startDate) : null;
              const endDate = banner.endDate ? new Date(banner.endDate) : null;
              
              if (startDate && now < startDate) return false;
              if (endDate && now > endDate) return false;
              
              return true;
            })
            .sort((a: PromotionalBanner, b: PromotionalBanner) => b.priority - a.priority);
          
          console.log('Active promotional banners:', activeBanners);
          setBanners(activeBanners);
        } else {
          console.log('No promotional banners found in API response');
        }
      } catch (error) {
        console.error('Error fetching promotional banners:', error);
        setError('Failed to fetch promotional banners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % banners.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Don't render if loading or no banners
  if (isLoading) {
    console.log('Promotional banner: Loading state');
    return (
      <section 
        className="w-full py-6 relative overflow-hidden mt-10"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
        
        <div className="relative py-2">
          <motion.div
            animate={{
              x: [0, -50 + "%"]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            <div className="flex whitespace-nowrap">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="flex-shrink-0 px-8 sm:px-12 md:px-16 flex items-center gap-1"
                >
                  <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-white/30 rounded w-64 animate-pulse"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-white/30 rounded-full ml-4"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    console.log('Promotional banner: Error state', error);
    return null;
  }

  if (banners.length === 0) {
    console.log('Promotional banner: No banners found');
    return null;
  }

  console.log('Promotional banner: Rendering with', banners.length, 'banners');

  const currentBanner = banners[currentBannerIndex];

  // Create infinite scrolling content for each banner
  const createInfiniteScrollingContent = (banner: PromotionalBanner) => {
    const textParts = banner.text.split('•').map(part => part.trim()).filter(part => part.length > 0);
    // Create enough duplicates for seamless infinite scroll
    const duplicatedTextParts = [...textParts, ...textParts, ...textParts, ...textParts, ...textParts, ...textParts];
    
    return (
      <div className="flex whitespace-nowrap">
        {duplicatedTextParts.map((part, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="flex-shrink-0 px-5 flex items-center gap-1"
          >
            <span className="text-black uppercase text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold tracking-wider jimthompson">
              {part}
            </span>
            <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-2 md:h-2 lg:w-2 lg:h-2 bg-black rounded-full ml-4"></div>
          </div>
        ))}
      </div>
    );
  };

  return (
      <section 
        className="w-full py-6 relative overflow-hidden mt-10"
        style={{
          background: `

           radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%),
            
           
           
          `,
        }}
      >
      {/* Decorative elements */}
     
      
      {/* First row - Infinite scroll from right to left */}
      <div className="relative py-2">
        <motion.div
          animate={{
            x: [0, -50 + "%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {createInfiniteScrollingContent(currentBanner)}
        </motion.div>
      </div>

      {/* Second row - Infinite scroll from left to right (if there are multiple banners) */}
      {banners.length > 1 && (
        <div className="relative py-4">
          <motion.div
            animate={{
              x: [0, 50 + "%"]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {createInfiniteScrollingContent(banners[(currentBannerIndex + 1) % banners.length])}
          </motion.div>
        </div>
      )}


      {/* Navigation dots (if multiple banners) - Fixed position */}
      {banners.length > 1 && (
        <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentBannerIndex 
                  ? 'bg-white opacity-100' 
                  : 'bg-white opacity-30 hover:opacity-60'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PromotionalBanner;
