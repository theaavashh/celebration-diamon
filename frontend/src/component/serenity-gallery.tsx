"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getApiBaseUrl, getImageUrl } from '@/lib/api';

interface GalleryItem {
  id: string;
  title: string | null;
  imageUrl: string;
  fileType?: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface Gallery {
  id: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
  galleryItems: GalleryItem[];
}

const SerenityGallery = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));
      const apiBaseUrl = getApiBaseUrl();
      
      const [_, data] = await Promise.all([
        minLoadingTime,
        fetch(`${apiBaseUrl}/galleries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      ]);
      
      if (data.success && data.data) {
        setGalleries(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch galleries');
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch galleries');
    } finally {
      setLoading(false);
    }
  };

  const activeGallery = galleries.find(gallery => gallery.isActive);
  const galleryItems = activeGallery?.galleryItems?.filter(item => item.isActive) || [];

  const SkeletonLoader = () => (
    <section className="w-full py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Skeleton with shimmer effect */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-12 sm:h-16 md:h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto mb-4 w-3/4 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
          <div className="h-6 sm:h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto w-5/6 animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
        </div>

        {/* Gallery Grid Skeleton with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6">
          {[1, 2, 3].map((index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden shadow-lg rounded-xl animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Image Skeleton with gradient shimmer */}
              <div className="relative h-80 sm:h-96 lg:h-[28rem] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                
                {/* Content Overlay Skeleton */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-3/4 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-1/2 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>

                {/* Decorative Border Skeleton */}
                <div className="absolute inset-0 border-2 border-gray-300/50 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Skeleton */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]">
            <div className="h-5 w-32 bg-gray-300/70 rounded"></div>
            <div className="h-5 w-5 bg-gray-300/70 rounded"></div>
          </div>
        </div>
      </div>

      {/* Custom shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );

  // Loading state
  if (loading) {
    return <SkeletonLoader />;
  }

  // Error state with skeleton overlay
  if (error) {
    return (
      <div className="relative">
        <SkeletonLoader />
       
      </div>
    );
  }

  // No galleries found - don't show anything
  if (!activeGallery || galleryItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-20l md:py-14 relative overflow-hidden bg-[#f4f5ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl jimthompson font-extrabold text-black mb-4">
            {activeGallery.title}
          </h2>
          <p className="text-lg sm:text-2xl text-black max-w-5xl mx-auto akzidenz-grotesk ">
            {activeGallery.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-3">
          {galleryItems.map((item, index) => {
            // Construct full URL
            const fileUrl = item.imageUrl.startsWith('http') 
              ? item.imageUrl 
              : getImageUrl(item.imageUrl);
            
            const isVideo = item.fileType === 'video' || item.imageUrl.match(/\.(mp4|webm|ogg|mov)$/i);
            
            return (
            <div 
              key={item.id}
              className="relative overflow-hidden shadow-lg"
            >
              {/* Media Container */}
              <div className="relative h-80 sm:h-96 lg:h-[28rem] overflow-hidden">
                {isVideo ? (
                  <video
                    src={fileUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={fileUrl}
                    alt={item.title || 'Gallery item'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={(e) => {
                      console.error('Gallery image failed to load:', item.imageUrl);
                      console.error('Constructed URL:', fileUrl);
                      // Fallback to placeholder image if the image fails to load
                      (e.target as HTMLImageElement).src = getImageUrl('/uploads/placeholder.jpg');
                    }}
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0"></div>
                
                {/* Content Overlay */}
                {(item.title || item.description) && (
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 -mt-5">
                    <div>
                      {item.title && (
                        <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-white/90 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Decorative Border */}
                <div className="absolute inset-0 border-2 border-white/20"></div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link 
            href="https://www.instagram.com/celebrationdiamonds" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Follow Us on Instagram</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SerenityGallery;
