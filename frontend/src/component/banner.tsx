"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Banner() {
  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 md:px-16 bg-[#f4f4f9]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mx-4">
          <motion.div 
            className="text-center lg:text-left lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 jimthompson">
              Exclusive Diamond Collection
            </h2>
            <p className="text-lg sm:text-xl text-gray-800 mb-4 font-sans">
              Discover our limited edition pieces crafted with precision and elegance
            </p>
            <Link href="/collections/exclusive">
              <motion.button
                className="inline-block bg-white text-amber-600 font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Now
              </motion.button>
            </Link>
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
              <div className="w-1/2 relative overflow-hidden group" style={{ height: '300px' }}>
                <img 
                  src="/ring.png" 
                  alt="Premium Diamond Ring" 
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0 bg-white/90 flex items-center justify-center group-hover:h-full transition-all duration-300 ease-in-out">
                  <div className="text-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Diamond Rings</h3>
                    <p className="text-gray-600 text-xs">Crafted to perfection</p>
                  </div>
                </div>
              </div>
              
              {/* Right Image - Taller height */}
              <div className="w-1/2 relative overflow-hidden group" style={{ height: '400px' }}>
                <img 
                  src="/ring.png" 
                  alt="Elegant Necklace" 
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0 bg-white/90 flex items-center justify-center group-hover:h-full transition-all duration-300 ease-in-out">
                  <div className="text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Necklaces</h3>
                    <p className="text-gray-600">Timeless elegance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
