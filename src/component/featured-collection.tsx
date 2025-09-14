"use client"

import React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const FeaturedCollection = () => {
  const products = [
    {
      id: 1,
      name: "Diamond Solitaire Ring",
      brand: "CELEBRATION DIAMOND",
      price: "From NPR 150,000",
      originalPrice: "NPR 180,000",
      isOnSale: true,
      colors: ["#D4AF37", "#C0C0C0", "#FFD700"],
      image: "/Untitled.jpeg",
      isMain: true
    },
    {
      id: 2,
      name: "Elegant Diamond Necklace",
      brand: "CELEBRATION DIAMOND",
      price: "NPR 95,000",
      originalPrice: "NPR 120,000",
      isOnSale: true,
      colors: ["#D4AF37", "#C0C0C0"],
      image: "/necklace.jpeg",
      isMain: false
    },
    {
      id: 3,
      name: "Pearl Drop Earrings",
      brand: "CELEBRATION DIAMOND",
      price: "NPR 45,000",
      originalPrice: "NPR 55,000",
      isOnSale: true,
      colors: ["#F5F5DC", "#C0C0C0"],
      image: "/earring.jpeg",
      isMain: false
    },
    {
      id: 4,
      name: "Diamond Tennis Bracelet",
      brand: "CELEBRATION DIAMOND",
      price: "NPR 75,000",
      originalPrice: "NPR 90,000",
      isOnSale: true,
      colors: ["#D4AF37", "#C0C0C0"],
      image: "/bracelet.jpeg",
      isMain: false
    },
    {
      id: 5,
      name: "Vintage Diamond Necklace",
      brand: "CELEBRATION DIAMOND",
      price: "NPR 65,000",
      originalPrice: "NPR 80,000",
      isOnSale: true,
      colors: ["#D4AF37", "#C0C0C0"],
      image: "/necklace.jpeg",
      isMain: false
    }
  ]

  const mainProduct = products.find(p => p.isMain)
  const gridProducts = products.filter(p => !p.isMain)

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-24 bg-gradient-to-br from-amber-50/30 via-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm jimthompson text-gray-500 uppercase tracking-wider mb-2">
            Check this out
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl jimthompson font-bold text-gray-900 leading-tight">
            Featured collection
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Main Product Display - Left Side */}
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] relative">
                <Image
                  src={mainProduct?.image || "/ring.jpeg"}
                  alt={mainProduct?.name || "Diamond Ring"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Product Details Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex gap-2 mb-3">
                  {mainProduct?.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <h3 className="text-white text-lg font-semibold mb-1">
                  {mainProduct?.name}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  {mainProduct?.brand}
                </p>
               
              </div>
            </div>
          </div>

          {/* Grid Products - Right Side */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 h-full">
              {gridProducts.slice(0, 4).map((product, index) => (
                <div key={product.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Details Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex gap-1 mb-2">
                      {product.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-3 h-3 rounded-full border border-white"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <h4 className="text-white text-sm font-semibold mb-1 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-gray-300 text-xs mb-1">
                      {product.brand}
                    </p>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop All Button */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold uppercase tracking-wider rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Shop All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection

