"use client"

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
  description: string;
  createdAt: string;
}

interface ProductItem {
  id: string;
  icon: string;
  label: string;
  price: string;
  colors: string | null;
  sizes: string | null;
  isNew: boolean;
  category: string;
}

const NewCollection = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch recent products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/products?limit=4&page=1`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Get top 4 most recent products, sorted by createdAt
            const recentProducts = data.data
              .filter((p: Product) => (p as any).isActive !== false)
              .sort((a: Product, b: Product) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .slice(0, 4)
              .map((product: Product) => ({
                id: product.id,
                icon: product.imageUrl?.startsWith('http') 
                  ? product.imageUrl 
                  : product.imageUrl 
                    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.imageUrl}` 
                    : `/${product.category.toLowerCase()}.jpeg`,
                label: product.name,
                price: product.price ? `$${product.price.toFixed(2)}` : 'Price on request',
                colors: null,
                sizes: null,
                isNew: true, // Mark recent products as new
                category: product.category
              }));
            setProducts(recentProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleImageClick = (product: ProductItem) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <section className="w-full pt-2 sm:pt-3 md:pt-4 pb-8 px-4 sm:px-6 md:px-16">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-4xl font-bold jimthompson text-gray-800">NEW ARRIVALS</h2>
        </div>
        <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth no-scrollbar">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[450px] lg:w-[500px]">
              <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] bg-gray-200 animate-pulse rounded-lg mb-3 sm:mb-4" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return null;
  }

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
            <div className="relative">
              <Link 
                href={`/products/${item.category.toLowerCase()}/${item.id}`}
                className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden mb-3 sm:mb-4 rounded-lg bg-gray-100 group cursor-pointer block"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
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
                <Link 
                  href={`/products/${item.category.toLowerCase()}/${item.id}`}
                  className="absolute -right-4 top-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden z-20 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 cursor-pointer block"
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
                </Link>
              )}
              
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </Link>
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
              <Link href={`/products/${item.category.toLowerCase()}/${item.id}`}>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight hover:text-gray-600 transition-colors cursor-pointer">
                  {item.label}
                </h3>
              </Link>
              
             
              
        
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
                    <Link 
                      href={selectedProduct ? `/products/${selectedProduct.category.toLowerCase()}/${selectedProduct.id}` : '#'}
                      onClick={closeModal}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 text-center"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={closeModal}
                      className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:bg-gray-50"
                    >
                      Close
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



