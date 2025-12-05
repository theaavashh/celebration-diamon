"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/api";

interface MidBanner {
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
  // Mid banner specific fields
  leftImage: string | null;
  rightImage: string | null;
  leftImageHeight: number;
  rightImageHeight: number;
}

export default function MidBanner() {
  const [bannerData, setBannerData] = useState<MidBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMidBanner = async () => {
      try {
        setIsLoading(true);
        
        // Add cache-busting parameter to ensure fresh data
        const response = await fetch(`${getApiBaseUrl()}/mid-banners?t=${new Date().getTime()}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // Get the first active mid banner or fallback to first available
          const activeBanner = data.data.find((banner: MidBanner) => banner.isActive) || data.data[0];
          setBannerData(activeBanner);
        }
      } catch (err) {
        console.error("Error fetching mid banner:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMidBanner();
  }, []);

  // Render nothing while loading
  if (isLoading) {
    return null;
  }

  // Render nothing if no banner data
  if (!bannerData) {
    return null;
  }

  return (
    <section 
      className="w-full py-8 sm:py-12 px-4 sm:px-6 md:px-16"
      style={{ 
        backgroundColor: bannerData.backgroundColor || '#f4f4f9',
        color: bannerData.textColor || '#000000'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mx-4">
          <motion.div 
            className="text-center lg:text-left lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 jimthompson">
              {bannerData.text}
            </h2>
            {bannerData.description && !bannerData.description.includes('{"leftImage"') && (
              <p className="text-lg sm:text-xl mb-4 font-sans">
                {bannerData.description}
              </p>
            )}
            {bannerData.linkText && bannerData.linkUrl && (
              <Link href={bannerData.linkUrl}>
                <motion.button
                  className="inline-block bg-white text-amber-600 font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ color: bannerData.textColor || '#000000' }}
                >
                  {bannerData.linkText}
                </motion.button>
              </Link>
            )}
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Two Image Layout - Equal width, different heights */}
            <div className="flex gap-4 w-full max-w-2xl mx-auto">
              {/* Left Image - Shorter height */}
              {bannerData.leftImage && (
                <div className="w-1/2 relative overflow-hidden group" style={{ height: `${bannerData.leftImageHeight}px` }}>
                  <img 
                    src={bannerData.leftImage} 
                    alt="Left banner image" 
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              )}
              
              {/* Right Image - Taller height */}
              {bannerData.rightImage && (
                <div className="w-1/2 relative overflow-hidden group" style={{ height: `${bannerData.rightImageHeight}px` }}>
                  <img 
                    src={bannerData.rightImage} 
                    alt="Right banner image" 
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}