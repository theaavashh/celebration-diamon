"use client"

import React, { useState } from "react";
import Image from "next/image";

const newArrivals = [
  {
    icon: "/ring.png",
    label: "Diamond Solitaire Ring",
    price: "€1,250",
    colors: "2 colours",
    sizes: null,
    isNew: false,
    category: "Ring",
  },
  {
    icon: "/necklace.jpeg",
    label: "Pearl Choker Necklace",
    price: "€890",
    colors: "1 colour",
    sizes: null,
    isNew: false,
    category: "Necklace",
  },
  {
    icon: "/bracelet.jpeg",
    label: "Gold Chain Bracelet",
    price: "€650",
    colors: "3 colours",
    sizes: "XS S M L XL",
    isNew: true,
    category: "Bracelet",
  },
  {
    icon: "/earring.jpeg",
    label: "Sapphire Stud Earrings",
    price: "€450",
    colors: "1 colour",
    sizes: null,
    isNew: false,
    category: "Earrings",
  },
  {
    icon: "/ring.png",
    label: "Wedding Band Ring",
    price: "€850",
    colors: "1 colour",
    sizes: null,
    isNew: false,
    category: "Ring",
  },
  {
    icon: "/necklace.jpeg",
    label: "Diamond Pendant Necklace",
    price: "€1,100",
    colors: "2 colours",
    sizes: null,
    isNew: false,
    category: "Necklace",
  },
  {
    icon: "/bracelet.jpeg",
    label: "Silver Bangle Bracelet",
    price: "€380",
    colors: "1 colour",
    sizes: "S M L",
    isNew: false,
    category: "Bracelet",
  },
  {
    icon: "/earring.jpeg",
    label: "Gold Hoop Earrings",
    price: "€320",
    colors: "1 colour",
    sizes: null,
    isNew: false,
    category: "Earrings",
  },
];

const NewCollection = () => {
  const [activeCategory, setActiveCategory] = useState("Ring");

  const categories = ["Ring", "Necklace", "Bracelet", "Earrings"];
  
  const filteredProducts = newArrivals.filter(item => item.category === activeCategory);

  return (
    <section className="w-full pt-2 sm:pt-3 md:pt-4 pb-8 px-4 sm:px-6 md:px-16 ">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-4xl font-bold jimthompson text-gray-800">NEW ARRIVALS</h2>
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <nav className="flex space-x-4 sm:space-x-6 md:space-x-8 overflow-x-auto px-4">
          {categories.map((category) => (
            <span
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`cursor-pointer pb-1 transition-colors duration-200 text-sm md:text-2xl sm:text-base whitespace-nowrap ${
                activeCategory === category
                  ? "text-gray-800 font-semibold border-b-2 border-black"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {category}
            </span>
          ))}
        </nav>
      </div>

      {/* Product Cards */}
      <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth no-scrollbar">
        {filteredProducts.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] "
          >
            {/* New In Badge */}
            {item.isNew && (
              <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs px-3 py-1 rounded-sm font-medium">
                New In
              </div>
            )}

            {/* Image Container */}
            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden mb-3 sm:mb-4">
              <Image
                src={item.icon}
                alt={item.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-1 sm:space-y-2">
              {/* Sizes */}
              {item.sizes && (
                <div className="text-xs text-gray-500 font-medium">
                  {item.sizes}
                </div>
              )}
              
              {/* Title */}
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">
                {item.label}
              </h3>
              
             
              
        
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewCollection;



