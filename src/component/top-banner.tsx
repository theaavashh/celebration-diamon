"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBannerSkeletonLoader } from './skeleton-loader';

interface Banner {
  id: string;
  title: string;
  text: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

const TopBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        console.log('Fetching banners from API...');
        const response = await fetch('http://localhost:5000/api/banners?active_only=true');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          if (data.success && data.data) {
            console.log('Setting banners:', data.data);
            setBanners(data.data);
          }
        } else {
          console.error('API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback to default banners if API fails
        setBanners([
          { id: '1', title: 'Default', text: 'SUMMER SALE IS LIVE: up to 10% off selected items', isActive: true, priority: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', title: 'Default', text: 'CERTIFIED DIAMONDS: Quality you can trust', isActive: true, priority: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', title: 'Default', text: 'CUSTOM JEWELLERY: Design your own piece', isActive: true, priority: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '4', title: 'Default', text: 'FREE SHIPPING ON ALL ORDERS', isActive: true, priority: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      console.log('Setting up banner rotation with', banners.length, 'banners');
      const timer = setInterval(() => {
        setIndex((prev) => {
          const nextIndex = (prev + 1) % banners.length;
          console.log('Rotating to banner index:', nextIndex, 'text:', banners[nextIndex]?.text);
          return nextIndex;
        });
      }, 3000); // Change every 3 seconds (increased from 2)
      return () => clearInterval(timer);
    }
  }, [banners]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide banner when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY <20) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Show skeleton loader while loading
  if (isLoading) {
    return <TopBannerSkeletonLoader />;
  }

  // Don't render if no banners
  if (banners.length === 0) {
    console.log('Not rendering banner - no banners available');
    return null;
  }

  console.log('Rendering banner - current index:', index, 'current text:', banners[index]?.text);

  return (
    <motion.div 
      className="w-screen bg-[#101923] text-[#F2F8FC] py-1 sm:py-2 flex justify-center items-center fixed top-0 left-0 z-[150] h-9 sm:h-11 overflow-hidden"
      animate={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={banners[index]?.id || index}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-xs sm:text-sm md:text-md lg:text-xl font-semibold px-2 text-center"
        >
          {banners[index]?.text || ''}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

export default TopBanner;
