"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  "SUMMER SALE IS LIVE: up to 10% off selected items",
  "CERTIFIED DIAMONDS: Quality you can trust",
  "CUSTOM JEWELLERY: Design your own piece",
  "FREE SHIPPING ON ALL ORDERS",
];

const TopBanner = () => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 2000); // Change every 2 seconds
    return () => clearInterval(timer);
  }, []);

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
          key={banners[index]}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="text-xs sm:text-sm md:text-md lg:text-xl font-semibold px-2 text-center"
        >
          {banners[index]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

export default TopBanner;