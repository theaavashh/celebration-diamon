"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

const MarqueeBanner = () => {
  const topRowWords = ["For the Few", "Curated Taste", "Elevated Living", "Lasting Impressions", "The Art of Detail"];
  const bottomRowWords = ["Handcrafted", "Bespoke", "Natural Materials", "Fine Detailing", "Limited Edition", "Made to Endure"];
  
  // Create multiple copies for seamless infinite loop
  const duplicatedTopWords = [...topRowWords, ...topRowWords, ...topRowWords, ...topRowWords];
  const duplicatedBottomWords = [...bottomRowWords, ...bottomRowWords, ...bottomRowWords, ...bottomRowWords];

  return (
    <section className="w-full py-8 bg-gradient-to-r from-amber-500 to-amber-600 relative overflow-hidden mt-10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
      
      {/* First row - Left to Right */}
      <div className="relative py-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -50 + "%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 15,
              ease: "linear",
            },
          }}
        >
          {duplicatedTopWords.map((word, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 px-8 sm:px-12 md:px-16 flex items-center gap-1"
            >
              <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider jimthompson">
                {word}
              </span>
              <Gem className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white ml-20" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row - Right to Left */}
      <div className="relative py-4">
        <motion.div
          className="flex whitespace-nowrap"
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
          {duplicatedBottomWords.map((word, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 px-8 sm:px-12 md:px-16 flex items-center gap-1"
            >
              <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider jimthompson">
                {word}
              </span>
              <Gem className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white ml-20" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
