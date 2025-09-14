"use client"

import React from "react"
import Image from "next/image"

const DiamondCertification = () => {
  return (
    <section className="w-full py-16 sm:py-16 md:py-16 px-4 sm:px-6 md:px-16 bg-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Section - Large Lifestyle Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[600px] sm:h-[700px] md:h-[700px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/real-diamond.jpeg"
                alt="Premium Diamond Ring Lifestyle"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right Section - Product Information */}
          <div className="space-y-8 order-1 lg:order-2">
            
           

            {/* Content Section */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl jimthompson font-bold text-gray-900 leading-tight">
                DIAMOND CERTIFICATION
              </h2>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Every diamond in our collection is certified by the International Gemological Institute (IGI), guaranteeing the quality, authenticity, and value of your fine jewelry. Our certification process ensures that each diamond meets the highest standards of excellence, providing you with complete peace of mind and detailed documentation of your investment.
              </p>

              {/* Call to Action */}
              <div className="pt-4">
                <a href="#" className="inline-block text-amber-700 font-medium underline hover:text-amber-800 transition-colors duration-200">
                  SHOP CERTIFIED COLLECTION
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiamondCertification 