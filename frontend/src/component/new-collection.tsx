"use client"

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
  description: string;
  createdAt: string;
  isActive: boolean;
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/products?limit=4&page=1`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const recentProducts = data.data
              .filter((p: Product) => p.isActive !== false)
              .sort((a: Product, b: Product) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .slice(0, 4)
              .map((product: Product) => ({
                id: product.id,
                icon: product.imageUrl ? getImageUrl(product.imageUrl) : `/${product.category.toLowerCase()}.jpeg`,
                label: product.name,
                price: product.price ? `$${product.price.toFixed(2)}` : 'Price on request',
                colors: null,
                sizes: null,
                isNew: true,
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
    <section className="w-full pt-2 sm:pt-3 md:pt-4 pb-8 px-4 sm:px-6 md:px-16 bg-white ">
      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Static Information Section */}
        <div className="lg:w-1/3 flex flex-col justify-center text-center">
          <h2 className=" text-2xl sm:text-4xl  font-bold jimthompson text-gray-800 mb-4">
            NEW ARRIVALS
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6 font-sans">
            Discover our latest collection of exquisite diamond jewelry, crafted with precision and designed to captivate.
          </p>
         
        </div>

        {/* Right Scrollable Product Display Section */}
        <div className="lg:w-2/3">
          <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth no-scrollbar">
        {filteredProducts.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px]"
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={handleMouseLeave}
          >
            {/* New In Badge */}
            {item.isNew && (
              <div className="absolute top-4 left-0 z-10 bg-black text-white text-xs px-3 py-1 font-medium">
                New In
              </div>
            )}

            {/* Image Container with Hover Detail View */}
            <div className="relative">
              <Link 
                href={`/products/${item.category.toLowerCase()}/${item.id}`}
                className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] overflow-hidden mb-3 sm:mb-4 bg-gray-100 group cursor-pointer block"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
              >
              {/* Main Image */}
              <Image
                src={`${item.icon}?_t=${Date.now()}`}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
                onError={() => {
                  console.log('Image failed to load:', item.icon);
                }}
              />
              
             
              
            
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
        </div>
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
                  src={`${selectedProduct.icon}?_t=${Date.now()}`}
                  alt={selectedProduct.label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
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



