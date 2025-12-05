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
    <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Image/Video */}
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Media - Image or Video */}
            {currentStore.mediaType === 'video' && currentStore.videoUrl ? (
              <video
                src={currentStore.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={getImageUrl(currentStore.imageUrl)}
                alt={currentStore.title}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/store.png';
                }}
              />
            )}
          </div>
          
          {/* Right Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Main heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold jimthompson text-gray-900 leading-tight">
                {currentStore.title}
              </h2>
              
              {/* Location */}
              <h3 className="text-xl sm:text-2xl md:text-3xl text-amber-600 font-medium">
                {currentStore.location}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                Experience the artistry and craftsmanship of our diamond jewelry in person. 
                Visit our store to explore our exclusive collections and receive personalized consultation 
                from our expert jewelers.
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-4">
              <button className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                Plan Your Visit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Navigation dots (if multiple stores) */}
            {stores.length > 1 && (
              <div className="flex items-center gap-2 pt-4">
                {stores.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-amber-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to store ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitStore;