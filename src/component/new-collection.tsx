"use client"

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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
  const [activeCategory] = useState("Ring");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof newArrivals[0] | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredProducts = newArrivals.filter(item => item.category === activeCategory);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleImageClick = (product: typeof newArrivals[0]) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="w-full pt-2 sm:pt-3 md:pt-4 pb-8 px-4 sm:px-6 md:px-16 ">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-4xl font-bold jimthompson text-gray-800">NEW ARRIVALS</h2>
      </div>


      {/* Product Cards */}
      <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth no-scrollbar">
        {filteredProducts.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[450px] lg:w-[500px]"
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={handleMouseLeave}
          >
            {/* New In Badge */}
            {item.isNew && (
              <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs px-3 py-1 rounded-sm font-medium">
                New In
              </div>
            )}

            {/* Image Container with Hover Detail View */}
            <div 
              ref={(el) => { imageRefs.current[idx] = el; }}
              className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden mb-3 sm:mb-4 rounded-lg bg-gray-100 group cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleImageClick(item)}
            >
              {/* Main Image */}
              <Image
                src={item.icon}
                alt={item.label}
                fill
                className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
                onError={() => {
                  console.log('Image failed to load:', item.icon);
                }}
              />
              
              {/* Hover Detail View - appears on the right side */}
              {hoveredIndex === idx && (
                <div 
                  className="absolute -right-4 top-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden z-20 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 cursor-pointer"
                  onClick={() => handleImageClick(item)}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    className="object-cover scale-150"
                    style={{
                      transform: `scale(2.5) translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`,
                      transformOrigin: 'center center'
                    }}
                  />
                  {/* Detail indicator */}
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Click to View
                  </div>
                </div>
              )}
              
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
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

      {/* Product Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Modal Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-[400px] lg:h-[600px] bg-gray-100">
                <Image
                  src={selectedProduct.icon}
                  alt={selectedProduct.label}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-bold jimthompson text-gray-900">
                    {selectedProduct.label}
                  </h2>

                  {/* Price */}
                  <div className="text-2xl lg:text-3xl font-semibold text-gray-800">
                    {selectedProduct.price}
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    {selectedProduct.sizes && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          Available Sizes
                        </h3>
                        <p className="text-gray-800">{selectedProduct.sizes}</p>
                      </div>
                    )}

                    {selectedProduct.colors && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          Colors
                        </h3>
                        <p className="text-gray-800">{selectedProduct.colors}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Category
                      </h3>
                      <p className="text-gray-800">{selectedProduct.category}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105">
                      Add to Cart
                    </button>
                    <button className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewCollection;



