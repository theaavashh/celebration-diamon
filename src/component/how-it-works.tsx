"use client"

import React, { useState } from "react"
import { ChevronRight, Gem, Heart, Shield, Sparkles, Calendar, Palette, Award, Truck } from "lucide-react"
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
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Features List */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl jimthompson font-bold text-gray-900 leading-tight">
                The Celebration Diamond process is in the details
              </h2>
            </div>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group cursor-pointer transition-all duration-200 ${
                    activeFeature === index ? 'bg-amber-50 border-l-4 border-amber-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4 p-4 rounded-lg">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      activeFeature === index 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                        activeFeature === index 
                          ? 'text-amber-700' 
                          : 'text-gray-900 group-hover:text-amber-700'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <ChevronRight className={`w-5 h-5 transition-all duration-200 ${
                        activeFeature === index 
                          ? 'text-amber-600 rotate-90' 
                          : 'text-gray-400 group-hover:text-amber-600'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image Display */}
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                fill
                className="object-cover transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
