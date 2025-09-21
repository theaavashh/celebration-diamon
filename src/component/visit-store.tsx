"use client"

import React from "react";
import Image from "next/image";

const VisitStore = () => {
  return (
    <section className="w-full flex justify-center py-4 sm:py-6 md:py-8 px-4">
      <div className="relative w-full max-w-7xl h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-lg">
        {/* Full Width Store Image */}
        <Image
          src="/store.png"
          alt="Celebration Diamond Store - New Baneshwor"
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        
        {/* Text Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Main heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold jimthompson text-white leading-tight">
              Visit Us
            </h2>
            
            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-4xl text-white">New Baneshwor, NB Center (1st Floor)</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitStore;
