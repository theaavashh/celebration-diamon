"use client"

import React from "react"
import Image from "next/image"

const CustomRing = () => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-4 px-4 sm:px-6 md:px-16 bg-[#f8f6f3]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          
          {/* Left Section - Main Ring Image with Process Flow */}
          <div className="relative">
            <div className="relative h-[500px] sm:h-[600px] md:h-[700px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-black">
              {/* Background with brand logo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Brand Logo */}
                {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">Celebration</h3>
                  <p className="text-white/80 text-sm md:text-base">jewellery redefined</p>
                </div> */}

                {/* Main Headline */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
                  <h2 className="text-white text-xl md:text-2xl mb-1">Design Your Own</h2>
                  <h1 className="text-white text-3xl md:text-4xl font-serif italic">Dream Ring!</h1>
                </div>

                {/* Central Ring Image */}
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src="/ring.png"
                    alt="Diamond Ring"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Process Flow Diagram */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80 md:w-96 md:h-96">
                    {/* Step 1: CONSULTATION & VISION (Top Right) */}
                    <div className="absolute top-0 right-0 text-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm mb-2">1</div>
                      <div className="text-white text-xs md:text-sm font-medium max-w-24">
                        CONSULTATION & VISION
                      </div>
                    </div>

                    {/* Step 2: DESIGN & QUOTE (Bottom Right) */}
                    <div className="absolute bottom-0 right-0 text-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm mb-2">2</div>
                      <div className="text-white text-xs md:text-sm font-medium max-w-24">
                        DESIGN & QUOTE
                      </div>
                    </div>

                    {/* Step 3: APPROVAL & CREATION (Bottom Left) */}
                    <div className="absolute bottom-0 left-0 text-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm mb-2">3</div>
                      <div className="text-white text-xs md:text-sm font-medium max-w-24">
                        APPROVAL & CREATION
                      </div>
                    </div>

                    {/* Step 4: DELIVERY & CARE (Top Left) */}
                    <div className="absolute top-0 left-0 text-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm mb-2">4</div>
                      <div className="text-white text-xs md:text-sm font-medium max-w-24">
                        DELIVERY & CARE
                      </div>
                    </div>

                    {/* Curved Arrows connecting the steps */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                      {/* Arrow from Step 1 to Step 2 */}
                      <path
                        d="M 320 80 Q 360 200 320 320"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Arrow from Step 2 to Step 3 */}
                      <path
                        d="M 320 320 Q 200 360 80 320"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Arrow from Step 3 to Step 4 */}
                      <path
                        d="M 80 320 Q 40 200 80 80"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Arrow from Step 4 to Step 1 */}
                      <path
                        d="M 80 80 Q 200 40 320 80"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      
                      {/* Arrow marker definition */}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Content and Product Previews */}
          <div className="space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl jimthomson font-bold text-gray-800 leading-tight">
                CREATE YOUR
                <br />
                RING ONLINE
              </h2>
              
              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-lg  ">
              If you have your heart set on a certain gemstone or cut, eden garden jewelry possesses the power to help customize your own unique, bespoke ring designs. the magic at your very fingertips.
              </p>
            </div>

            {/* Product Previews */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8">
              {/* Left Product - Ornate Ring Band */}
              <div className="space-y-2 sm:space-y-3">
                <div className="relative h-32 sm:h-40 md:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-white">
                  <Image
                    src="/ring.jpeg"
                    alt="Ornate Rose Gold Ring Band"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-800">Ornate Band Design</h4>
                  <p className="text-xs text-gray-600">V-shaped with leaf carvings</p>
                </div>
              </div>

              {/* Right Product - Salt and Pepper Diamond */}
              <div className="space-y-2 sm:space-y-3">
                <div className="relative h-32 sm:h-40 md:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-white">
                  <Image
                    src="/ring.png"
                    alt="Salt and Pepper Diamond"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-800">Salt & Pepper Diamond</h4>
                  <p className="text-xs text-gray-600">Unique speckled gemstone</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomRing 