"use client"

import React, { useState } from "react"
import { ChevronRight, Gem, Heart, Shield, Sparkles } from "lucide-react"
import Image from "next/image"

const HowItWorks = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Jewelry Selection",
      description: "Select the perfect jewelry for your special moment.",
      icon: <Gem className="w-5 h-5" />,
      image: "/jewelry_selection.jpg"
    },
    {
      title: "Book Appointment",
      description: "Choose a date and time for your appointment.",
      icon: <Sparkles className="w-5 h-5" />,
      image: "/booking_appointment.png"
    },
    {
      title: "Store Visit",
      description: "In specific date and time, visit the store to try on the jewelry.",
      icon: <Shield className="w-5 h-5" />,
      image: "/store.png"
    },
    {
      title: "Luxury Experience",
      description: "Enjoy the luxury jewelry shopping experience",
      icon: <Heart className="w-5 h-5" />,
      image: "/weeding.jpeg"
    }
  ]

  return (
    <section className="w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold jimthompson text-gray-900 mb-6">
            The Celebration Diamond Process
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Experience luxury jewelry shopping with our carefully crafted process designed for your special moments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Features List */}
          <div className="space-y-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group cursor-pointer transition-all duration-300 ease-in-out ${
                  activeFeature === index 
                    ? 'opacity-100' 
                    : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 relative">
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-amber-500 scale-110' 
                        : 'bg-amber-100 group-hover:scale-105'
                    }`}></div>
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      activeFeature === index 
                        ? 'bg-amber-500 text-white shadow-lg' 
                        : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                    }`}>
                      <div className="text-lg font-bold font-sans">{index + 1}</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <h3 className={`text-xl font-bold mb-3 transition-all duration-300 font-sans ${
                      activeFeature === index 
                        ? 'text-amber-700' 
                        : 'text-gray-900 group-hover:text-amber-700'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Image Display */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                fill
                className="object-cover transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-200/30 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-amber-300/20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
