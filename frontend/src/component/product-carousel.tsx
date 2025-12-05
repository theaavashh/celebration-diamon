"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../types/product";
import ProductCard from "./product-card";

// Hardcoded product data for demonstration
const hardcodedProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Diamond Ring",
    category: "Rings",
    subcategory: "Engagement",
    price: 2499,
    originalPrice: 2999,
    image: "/ring.png",
    rating: 4.8,
    reviews: 124,
    description: "Stunning solitaire diamond ring with platinum setting",
    details: "1.5 carat round brilliant cut diamond, G color, VS1 clarity",
    inStock: true,
    isNew: true,
    isSale: true,
    metal: "Platinum",
    purity: "950",
    caratWeight: "1.5",
    clarity: "VS1",
    color: "G",
    cut: "Excellent",
    certification: "GIA",
    warranty: "Lifetime"
  },
  {
    id: "2",
    name: "Classic Pearl Necklace",
    category: "Necklaces",
    subcategory: "Everyday",
    price: 899,
    originalPrice: 1099,
    image: "/necklace.jpg",
    rating: 4.6,
    reviews: 87,
    description: "Timeless freshwater pearl necklace with gold clasp",
    details: "8mm white freshwater pearls on 18k gold chain",
    inStock: true,
    isNew: false,
    isSale: true,
    metal: "Gold",
    purity: "18k",
    caratWeight: "N/A",
    clarity: "N/A",
    color: "White",
    cut: "N/A",
    certification: "AGL",
    warranty: "2 Years"
  },
  {
    id: "3",
    name: "Diamond Stud Earrings",
    category: "Earrings",
    subcategory: "Studs",
    price: 1599,
    originalPrice: 1799,
    image: "/earrings.jpg",
    rating: 4.9,
    reviews: 203,
    description: "Brilliant round diamond stud earrings",
    details: "Two 0.75 carat round brilliant diamonds, H color, SI1 clarity",
    inStock: true,
    isNew: true,
    isSale: false,
    metal: "White Gold",
    purity: "14k",
    caratWeight: "0.75",
    clarity: "SI1",
    color: "H",
    cut: "Very Good",
    certification: "GIA",
    warranty: "Lifetime"
  },
  {
    id: "4",
    name: "Sapphire Tennis Bracelet",
    category: "Bracelets",
    subcategory: "Tennis",
    price: 3299,
    originalPrice: 3799,
    image: "/bracelet.jpg",
    rating: 4.7,
    reviews: 95,
    description: "Elegant sapphire and diamond tennis bracelet",
    details: "12 sapphires and 24 diamonds on 18k white gold",
    inStock: true,
    isNew: false,
    isSale: true,
    metal: "White Gold",
    purity: "18k",
    caratWeight: "2.1",
    clarity: "VS2",
    color: "F",
    cut: "Good",
    certification: "SSEF",
    warranty: "5 Years"
  },
  {
    id: "5",
    name: "Emerald Cut Engagement Ring",
    category: "Rings",
    subcategory: "Engagement",
    price: 4599,
    originalPrice: 5299,
    image: "/emerald-ring.jpg",
    rating: 4.9,
    reviews: 156,
    description: "Sophisticated emerald cut diamond engagement ring",
    details: "2.0 carat emerald cut diamond, E color, VVS2 clarity",
    inStock: true,
    isNew: true,
    isSale: false,
    metal: "Platinum",
    purity: "950",
    caratWeight: "2.0",
    clarity: "VVS2",
    color: "E",
    cut: "Excellent",
    certification: "GIA",
    warranty: "Lifetime"
  },
  {
    id: "6",
    name: "Diamond Pendant Necklace",
    category: "Necklaces",
    subcategory: "Pendants",
    price: 1899,
    originalPrice: 2199,
    image: "/pendant.jpg",
    rating: 4.5,
    reviews: 78,
    description: "Beautiful diamond pendant on delicate chain",
    details: "1.0 carat princess cut diamond, F color, SI2 clarity",
    inStock: true,
    isNew: false,
    isSale: true,
    metal: "White Gold",
    purity: "14k",
    caratWeight: "1.0",
    clarity: "SI2",
    color: "F",
    cut: "Very Good",
    certification: "GIA",
    warranty: "Lifetime"
  }
];

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
}

const ProductCarousel = ({ title, subtitle }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate products for infinite scroll effect
  const duplicatedProducts = [...hardcodedProducts, ...hardcodedProducts, ...hardcodedProducts];

  // Update visible products based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleProducts(4);
      } else if (window.innerWidth >= 768) {
        setVisibleProducts(3);
      } else if (window.innerWidth >= 640) {
        setVisibleProducts(2);
      } else {
        setVisibleProducts(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  // Handle infinite scroll logic
  useEffect(() => {
    if (trackRef.current) {
      const totalProducts = hardcodedProducts.length;
      const newIndex = currentIndex % totalProducts;
      
      // Reset to beginning when we reach the end of the duplicated set
      if (currentIndex >= totalProducts * 2) {
        setTimeout(() => {
          setCurrentIndex(newIndex);
        }, 300); // Match transition duration
      }
      
      // Reset to end when we go before the beginning
      if (currentIndex < 0) {
        setTimeout(() => {
          setCurrentIndex(totalProducts * 2 - 1);
        }, 300); // Match transition duration
      }
    }
  }, [currentIndex, duplicatedProducts.length]);

  // Auto slide every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {title && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold jimthompson text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative" ref={carouselRef}>
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hidden sm:flex items-center justify-center"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hidden sm:flex items-center justify-center"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Products Track */}
          <div className="overflow-hidden">
            <div 
              ref={trackRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${(currentIndex * (100 / visibleProducts))}%)` }}
            >
              {duplicatedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / visibleProducts}%` }}
                >
                  <ProductCard product={{
                    ...product,
                    bestseller: index % 3 === 0, // Mark every 3rd product as bestseller
                    discount: index % 2 === 0 ? "20% OFF" : undefined // Add discount to every 2nd product
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {hardcodedProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === (currentIndex % hardcodedProducts.length) 
                    ? 'bg-amber-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;