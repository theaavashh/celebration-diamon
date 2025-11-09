"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Store {
  id: string;
  title: string;
  location: string;
  mediaType: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const VisitStore = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/stores');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Filter active stores and sort by sortOrder
            const activeStores = data.data
              .filter((store: Store) => store.isActive)
              .sort((a: Store, b: Store) => a.sortOrder - b.sortOrder);
            setStores(activeStores);
          }
        } else {
          setError('Failed to fetch stores');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError('Failed to fetch stores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Auto-rotate stores every 5 seconds if multiple stores
  useEffect(() => {
    if (stores.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stores.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stores.length]);

  // Get image URL for store
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return '/store.png'; // Fallback image
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="w-full flex justify-center py-4 sm:py-6 md:py-8 px-4">
        <div className="relative w-full max-w-[95vw] h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
      </section>
    );
  }

  // Show error state
  if (error || stores.length === 0) {
    return (
      <section className="w-full flex justify-center py-4 sm:py-6 md:py-8 px-4">
        <div className="relative w-full max-w-[95vw] h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">{error || 'No stores available'}</p>
        </div>
      </section>
    );
  }

  const currentStore = stores[currentIndex];

  return (
    <section className="w-full flex justify-center py-4 sm:py-6 md:py-8 px-4">
      <div className="relative w-full max-w-[95vw] h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden rounded-lg">
        {/* Media - Image or Video */}
        {currentStore.mediaType === 'video' && currentStore.videoUrl ? (
          <video
            src={currentStore.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        ) : (
          <Image
            src={getImageUrl(currentStore.imageUrl)}
            alt={currentStore.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/store.png';
            }}
          />
        )}
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        
        {/* Text Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Main heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold jimthompson text-white leading-tight">
              {currentStore.title}
            </h2>
            
            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white">{currentStore.location}</h3>
            </div>
          </div>
        </div>

        {/* Navigation dots (if multiple stores) */}
        {stores.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {stores.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to store ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VisitStore;