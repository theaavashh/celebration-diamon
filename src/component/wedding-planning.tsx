"use client"

import React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const WeddingPlanning = () => {
  const features = [
    {
      title: "In-house gemological lab",
      description: "A store with its own lab to ensure the quality of the diamonds.",
      image: "/slide1-3691440902.jpg"
    },
    {
      title: "Custom design services",
      description: "From initial sketches to computer-aided design, we'll help you create the perfect diamond jewellery.",
      image: "/custom-designs-3381239909.jpg"
    },
    {
      title: "Cleaning and maintenance",
      description: "Provided complimentary cleaning and maintenance services to keep your jewellery looking its best.",
      image: "/diamond-cleaning-1801006520.jpg"
    },
    {
      title: "Weeding Jewelry Planner",
      description: "Ensure you have the perfect jewellery for your special day.",
      image: "/Necklace-Earring-Ring-Bracelet-Four-Piece-Bright-Full-Diamond-Zircon-Jewelry-Set-Bridal-Wedding-Jewelry-3442486632.jpg"
    },
    {
      title: "Expert consultation",
      description: "We'll help to decide through online consultation.",
      image: "/expert-consultant.jpeg"
    },
    {
      title: "Free Pick up service",
      description: "From the store to your home or venue, we'll handle the delivery for you.",
      image: "/budget.jpg"
    }
  ]

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 items-center">
          {/* Left Section - Header */}
          <div className="lg:col-span-1 lg:pr-8">
            <h2 className="text-2xl font-bold text-black leading-tight mb-4">
              Everything you need <br />
              all under celebration diamond
            </h2>
            <p className="text-lg sm:text-xl text-black mt-10">
              For all the days along the way
            </p>
          </div>

          {/* Right Section - Features Grid */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white p-2 shadow-3xl hover:shadow-md transition-all duration-300 p-4 border-2 border-black" style={{ borderColor: '#000000' }}>
                {/* Title */}
                <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.title}
                  <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Image Container */}
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WeddingPlanning
