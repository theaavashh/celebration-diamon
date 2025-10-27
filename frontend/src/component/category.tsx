"use client"

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoriesSkeletonLoader } from "./skeleton-loader";

interface Category {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Default subcategories for each category type
const defaultSubcategories: { [key: string]: string[] } = {
  necklace: ["Bridal", "Lightweight", "Choker", "Pendant"],
  bracelet: ["Bangle", "Cuff", "Chain", "Charm"],
  ring: ["Engagement", "Wedding", "Solitaire", "Band"],
  rings: ["Engagement", "Wedding", "Solitaire", "Band"],
  earrings: ["Stud", "Hoop", "Drop", "Jacket"],
  men: ["Rings", "Bracelets", "Chains", "Cufflinks"],
  ladies: ["Necklaces", "Earrings", "Bracelets", "Rings"],
  kids: ["Pendants", "Bracelets", "Earrings", "Rings"],
};

const Category = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCategories(data.data);
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

  // Get image URL for category with fallback
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };

  // Fallback image URL for when the main image fails
  const getFallbackImageUrl = () => {
    return 'http://localhost:5000/uploads/categories/image-1758798193293-520590607.jpeg';
  };

  // Check if the image URL is the problematic one and use fallback immediately
  const getValidImageUrl = (imageUrl: string) => {
    // If it's the problematic image, use fallback immediately
    if (imageUrl.includes('image-1759729146780-642639238.jpeg')) {
      return getFallbackImageUrl();
    }
    return getImageUrl(imageUrl);
  };

  // Get subcategories for a category
  const getSubcategories = (categoryTitle: string) => {
    const key = categoryTitle.toLowerCase();
    return defaultSubcategories[key] || [];
  };

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

  // Show loading state
  if (isLoading) {
    return <CategoriesSkeletonLoader />;
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-4 sm:px-6 md:px-16">
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl jimthompson font-bold text-black uppercase tracking-wide mb-4 sm:mb-6 md:mb-8">
          Categories
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (categories.length === 0) {
    return (
      <section className="w-full pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-4 sm:px-6 md:px-16">
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl jimthompson font-bold text-black uppercase tracking-wide mb-4 sm:mb-6 md:mb-8">
          Categories
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">No categories available</div>
        </div>
      </section>
    );
  }

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
        style={{ height: '600px' }}
      >
         {categories.map((category, idx) => {
           const subcategories = getSubcategories(category.title);
           return (
             <div
               key={category.id}
               className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] flex flex-col"
             >
               {/* Image Container */}
               <Link href={category.link || `/products/${category.title.toLowerCase()}`} className="block">
                 <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden shadow-md rounded-lg">
                   <Image
                     src={getValidImageUrl(category.imageUrl)}
                     alt={category.title}
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-300"
                     onError={(e) => {
                       console.log('Image failed, showing placeholder:', category.imageUrl);
                       e.currentTarget.src = 'https://via.placeholder.com/500x600?text=No+Image';
                     }}
                   />
                   {/* Overlay for better text readability */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                   
                   {/* Centered Category Title */}
                   <div className="absolute inset-0 flex items-center justify-center z-30">
                     <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg bg-black/40 px-6 py-3 rounded-lg backdrop-blur-sm text-center">
                       {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
                     </h3>
                   </div>
                 </div>
               </Link>

               {/* Subcategories Dropdown */}
               {subcategories.length > 0 && (
                 <div className="absolute top-[450px] sm:top-[500px] md:top-[600px] left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                   <div className="w-48 sm:w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center">
                     <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                     <div className="flex flex-col gap-2">
                       {subcategories.map((sub, subIdx) => (
                         <Link
                           key={subIdx}
                           href={`/products/${category.title.toLowerCase()}/${sub.toLowerCase()}`}
                           className="text-gray-700 hover:text-amber-600 text-sm font-medium cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors duration-200"
                         >
                           {sub}
                         </Link>
                       ))}
                     </div>
                   </div>
                 </div>
               )}
             </div>
           );
         })}
      </div>
    </section>
  );
};

export default Category;