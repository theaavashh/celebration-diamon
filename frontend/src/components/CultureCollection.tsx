"use client";

import React from 'react';
import Link from 'next/link';

const CultureCollection = () => {
  const cultures = [
    {
      id: 'newari',
      name: 'Newari',
      image: '/newari-culture.jpg',
      description: 'Ancient traditions of the Kathmandu Valley'
    },
    {
      id: 'bhutanese', 
      name: 'Bhutanese',
      image: '/bhutanese-culture.jpg',
      description: 'Sacred symbols and spiritual elegance'
    },
    {
      id: 'tamang',
      name: 'Tamang', 
      image: '/tamang-culture.jpg',
      description: 'Mountain heritage and tribal artistry'
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore Our Culture Collection
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the rich traditions and exquisite craftsmanship of Himalayan cultures
        </p>
      </div>

      {/* Cultural Triptych */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                 {cultures.map((culture) => (
          <div key={culture.id} className="relative group cursor-pointer">
            {/* Cultural Panel */}
            <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-2xl">
              {/* Background Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-sm">Cultural Image</p>
                  </div>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-center">
                  {/* Cultural Name */}
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {culture.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-lg mb-6 max-w-xs mx-auto">
                    {culture.description}
                  </p>
                  
                  {/* Explore Button */}
                  <Link 
                    href={`/culture/${culture.id}`}
                    className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300"
                  >
                    <span className="text-lg font-semibold">EXPLORE</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CultureCollection;
