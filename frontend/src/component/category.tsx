"use client";

import Link from "next/link";
import Image from "next/image";
import { Public_Sans } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Wait for initial loader to complete (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Now start showing skeleton loaders and fetch data
        setIsLoading(true);
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const activeCategories = data.data
              .filter((cat: Category) => cat.isActive)
              .sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
            setCategories(activeCategories);
          }
        } else {
          setError('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.offsetWidth * 0.8;
      
      container.scrollTo({
        left: container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8 sm:mb-12 animate-pulse"></div>
          <div className="flex space-x-4 sm:space-x-6 overflow-x-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-64 aspect-square bg-gray-200 rounded-lg relative overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8 sm:mb-12 animate-pulse"></div>
          <div className="flex space-x-4 sm:space-x-6 overflow-x-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-64 aspect-square bg-gray-200 rounded-lg relative overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 sm:py-16  px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className={`${publicSans.className} text-center text-lg sm:text-2xl lg:text-4xl font-semibold text-amber-600 mb-2`}>
          Our Collection
        </h2>
        <h2 className="text-center text-2xl sm:text-3xl lg:text-5xl font-semibold text-gray-900 mb-2 jimthompson">
          Shop by Category
        </h2>
       
                
        {/* Navigation arrows */}
        <div className="relative group">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
                  
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar"
          >
            <div className="flex space-x-4 sm:space-x-6 min-w-max">
            {categories.map((category, index) => {
            const categoryLink = category.link || `/products/${category.title.toLowerCase()}`;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-32 sm:w-40 md:w-64"
              >
                <Link href={categoryLink} className="group block">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    {category.imageUrl && !imageErrors.has(category.id) ? (
                      <Image
                        src={getImageUrl(category.imageUrl)}
                        alt={category.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(category.id));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                        <span className="text-gray-400 text-sm">{category.title}</span>
                      </div>
                    )}
                  </div>
                  <h3 className={`${publicSans.className} mt-3 text-center text-2xl sm:text-3xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors`}>
                    {category.title}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

