"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CelebrationHero = () => {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-amber-50/30 via-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold jimthompson text-gray-900">
            Celebration Diamonds
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-700 font-sans">
            The Gift of Love
          </h2>
          
          {/* Description */}
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 font-sans">
            Timeless. Feminine. Everlasting
          </p>
          
          {/* Ring Image */}
          <div className="flex justify-center my-12">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <Image
                src="/ring.png"
                alt="Celebration Diamond Ring"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="pt-8">
            <button className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-lg">
              Shop Timeless Designs
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebrationHero;