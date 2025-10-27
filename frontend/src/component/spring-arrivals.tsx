"use client"

import React from "react"
import Image from "next/image"
import { Diamond, ArrowRight } from "lucide-react"

const SpringArrivals = () => {
  const products = [
    {
      id: 1,
      name: "Diamond Solitaire Ring",
      price: "NPR 1,25,000",
      image: "/ring.png",
      discount: "30% off",
      hasDiscount: true
    },
    {
      id: 2,
      name: "Pearl Choker Necklace",
      price: "NPR 89,000",
      image: "/necklace.jpeg",
      discount: null,
      hasDiscount: false
    },
    {
      id: 3,
      name: "Gold Chain Bracelet",
      price: "NPR 1,65,000",
      image: "/bracelet.jpeg",
      discount: "30% off",
      hasDiscount: true
    },
    {
      id: 4,
      name: "Sapphire Stud Earrings",
      price: "NPR 1,33,000",
      image: "/earring.jpeg",
      discount: null,
      hasDiscount: false
    }
  ]

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 px-8 sm:px-12 md:px-20 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-6">
          {/* Left Side - Title */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl jimthompson font-bold text-gray-900 leading-tight">
              New Arrivals this<br />
              <span className="flex items-center gap-3">
                Spring Season
                <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </span>
            </h2>
          </div>

          {/* Right Side - Description and Button */}
          <div className="space-y-6">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
              Spring has arrived, we come with jewelry choices that are suitable to be combined with this season, lots of elegant and timeless pieces.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 jimthompson font-medium">
              Show all collection
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Product Image */}
              <div className="relative w-full h-80 sm:h-96 overflow-hidden mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
              
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 jimthompson">
                  {product.name}
                </h3>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpringArrivals

