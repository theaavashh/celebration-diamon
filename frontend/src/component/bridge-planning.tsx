"use client"

import React from "react"
import Image from "next/image"

const BridgePlanning = () => {
  return (
    <section className="w-full pt-16 sm:pt-20 md:pt-16 pb-2 px-4 sm:px-6 md:px-16 bg-white">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Main Layout - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          
          {/* Left Section - Content */}
          <div className="flex flex-col justify-center space-y-6 px-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl jimthompson font-bold text-gray-900 leading-tight">
              YOURS WEDDING JEWELRY PLANNER
            </h2>
            
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
              Step into confidence with our comprehensive bride planning service. Inspired by the art of dental restoration, this process features detailed consultations and personalized designs that bring harmony to your smile. Each planning session is a gentle reminder to prioritize your oral health and find the perfect solution for your unique dental needs.
            </p>

            {/* Call to Action */}
            <div className="pt-4">
              <a href="#" className="inline-block text-slate-700 font-medium underline hover:text-slate-800 transition-colors duration-200">
                SCHEDULE CONSULTATION
              </a>
            </div>
          </div>

          {/* Right Section - Wedding Photo */}
          <div className="relative">
            <div className="relative h-[600px] sm:h-[700px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/weeding.jpeg"
                alt="Wedding Bridge Planning"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Floating badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">BRIDE PLANNING</p>
                    <p className="text-xs text-gray-600">Expert Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BridgePlanning 