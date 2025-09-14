"use client"

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    icon: "/necklace.jpeg",
    label: "Necklace",
    subcategories: ["Bridal", "Lightweight", "Choker", "Pendant"],
  },
  {
    icon: "/bracelet.jpeg",
    label: "Bracelet",
    subcategories: ["Bangle", "Cuff", "Chain", "Charm"],
  },
  {
    icon: "/Gold Leaf Ring Close-Up.png",
    label: "Ring",
    subcategories: ["Engagement", "Wedding", "Solitaire", "Band"],
  },
  {
    icon: "/earring.jpeg",
    label: "Earrings",
    subcategories: ["Stud", "Hoop", "Drop", "Jacket"],
  },
  {
    icon: "/men.jpg",
    label: "Men",
    subcategories: ["Rings", "Bracelets", "Chains", "Cufflinks"],
  },
  {
    icon: "/ladies.jpg",
    label: "Ladies",
    subcategories: ["Necklaces", "Earrings", "Bracelets", "Rings"],
  },
  {
    icon: "/kids.jpeg",
    label: "Kids",
    subcategories: ["Pendants", "Bracelets", "Earrings", "Rings"],
  },
];

const Category = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth;
        const gap = 24; // Gap between items
        const scrollAmount = itemWidth + gap;
        
        container.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth;
        const gap = 24; // Gap between items
        const scrollAmount = itemWidth + gap;
        
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const scrollLeft = container.scrollLeft;
        const itemWidth = firstChild.offsetWidth;
        const gap = 24; // Gap between items
        const newIndex = Math.round(scrollLeft / (itemWidth + gap));
        setCurrentIndex(Math.max(0, Math.min(categories.length - 1, newIndex)));
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="w-full pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-4 sm:px-6 md:px-16 scroll-smooth overflow-x-auto no-scrollbar ">
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl jimthompson font-bold text-black uppercase tracking-wide mb-4 sm:mb-6 md:mb-8">
        Categories
      </h2>

       {/* Navigation Arrows and Dots */}
       <div className="relative flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 text-green-700 hover:text-green-800 transition-colors duration-200 text-lg sm:text-xl md:text-2xl font-light cursor-pointer"
        >
          ←
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {categories.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "bg-green-700 w-4 h-1.5 sm:w-6 sm:h-2 rounded-full" // Dash for active
                  : "bg-green-700" // Dot for inactive
              }`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 text-green-700 hover:text-green-800 transition-colors duration-200 text-lg sm:text-xl md:text-2xl font-light cursor-pointer"
        >
          →
        </button>
      </div>

      {/* Scrollable titles row */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 sm:gap-3 md:gap-4 mb-2 px-2 overflow-x-auto no-scrollbar"
        style={{ height: '500px' }}
      >
         {categories.map((category, idx) => (
          <div
            key={idx}
            className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] flex flex-col"
          >
            {/* Category Title */}
            <div className="absolute top-4 left-4 z-30">
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                {category.label}
              </h3>
            </div>

            {/* Image Container */}
            <Link href={`/products/${category.label.toLowerCase()}`} className="block">
              <div className="relative w-full h-[280px] sm:h-[320px] md:h-[400px] overflow-hidden shadow-md rounded-lg">
                <Image
                  src={category.icon}
                  alt={category.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </Link>

            {/* Subcategories Dropdown */}
            <div className="absolute top-72 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="w-48 sm:w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                <div className="flex flex-col gap-2">
                  {category.subcategories.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      href={`/products/${category.label.toLowerCase()}/${sub.toLowerCase()}`}
                      className="text-gray-700 hover:text-amber-600 text-sm font-medium cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors duration-200"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
