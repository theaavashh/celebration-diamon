"use client";

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  showButton?: boolean;
}

export default function SkeletonLoader({ 
  className = "", 
  lines = 3, 
  showButton = true 
}: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        {/* Skeleton for heading */}
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        
        {/* Skeleton for sub-heading */}
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
        
        {/* Skeleton for description lines */}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div 
              key={index}
              className={`h-4 bg-gray-300 rounded ${
                index === lines - 1 ? 'w-4/6' : 
                index === lines - 2 ? 'w-5/6' : 'w-full'
              }`}
            ></div>
          ))}
        </div>
        
        {/* Skeleton for CTA button */}
        {showButton && (
          <div className="h-12 bg-gray-300 rounded-full w-40"></div>
        )}
      </div>
    </div>
  );
}

// Card skeleton loader
export function CardSkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-300 rounded-lg h-48 w-full mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Categories skeleton loader
export function CategoriesSkeletonLoader() {
  return (
    <section className="w-full pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 px-4 sm:px-6 md:px-16">
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl jimthompson font-bold text-black uppercase tracking-wide mb-4 sm:mb-6 md:mb-8">
        Categories
      </h2>
      
      {/* Navigation arrows skeleton */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
      </div>

      {/* Categories grid skeleton */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 mb-2 px-2 overflow-x-auto no-scrollbar" style={{ height: '600px' }}>
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] flex flex-col">
            {/* Image skeleton */}
            <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden shadow-md rounded-lg">
              <div className="w-full h-full bg-gray-300 animate-pulse"></div>
              
              {/* Centered title skeleton */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="h-8 sm:h-10 md:h-12 bg-gray-400 rounded w-32 animate-pulse"></div>
              </div>
            </div>

            {/* Subcategories dropdown skeleton */}
            <div className="absolute top-[450px] sm:top-[500px] md:top-[600px] left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <div className="w-48 sm:w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, subIdx) => (
                    <div key={subIdx} className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Top banner skeleton loader
export function TopBannerSkeletonLoader() {
  return (
    <div className="w-screen bg-[#101923] text-[#F2F8FC] py-1 sm:py-2 flex justify-center items-center fixed top-0 left-0 z-[150] h-9 sm:h-11 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-4 sm:h-5 bg-gray-400 rounded w-64 sm:w-80"></div>
      </div>
    </div>
  );
}

// Hero section specific skeleton loader
export function HeroSkeletonLoader() {
  return (
    <section className="relative pt-0 w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-amber-50/30">
      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-0 md:pt-0 pb-4 sm:pb-6 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-16 xl:gap-20 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content Skeleton */}
          <div className="text-center lg:text-left order-1 px-2 sm:px-0 lg:col-span-7">
            <div className="animate-pulse space-y-4">
              {/* Main heading skeleton */}
              <div className="space-y-2">
                <div className="h-12 sm:h-14 md:h-16 lg:h-20 bg-gray-300 rounded w-full"></div>
                <div className="h-12 sm:h-14 md:h-16 lg:h-20 bg-gray-300 rounded w-4/5"></div>
              </div>
              
              {/* Sub-heading skeleton */}
              <div className="h-8 sm:h-10 md:h-12 lg:h-16 bg-gray-300 rounded w-3/4"></div>
              
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-full"></div>
                <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 sm:h-5 md:h-6 bg-gray-300 rounded w-4/6"></div>
              </div>
              
              {/* CTA button skeleton */}
              <div className="flex justify-center lg:justify-start">
                <div className="h-12 sm:h-14 md:h-16 bg-gray-300 rounded-full w-48 sm:w-52 md:w-56"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Skeleton */}
          <div className="order-2 lg:order-2 lg:col-span-5">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto lg:mx-0 mt-4 sm:mt-6 md:mt-8 lg:-top-12 xl:-top-16">
              <div className="group relative overflow-hidden transition-all duration-500">
                <div className="aspect-[3/4] sm:aspect-[4/3] lg:aspect-[4/3] w-full relative">
                  <div className="w-full h-full bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section skeleton */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-3 sm:left-4 md:left-6 lg:left-8 right-3 sm:right-4 md:right-6 lg:right-8 z-10 hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Connect with Experts skeleton */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>

            {/* Center description skeleton */}
            <div className="text-center">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>

            {/* Client reviews skeleton */}
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}