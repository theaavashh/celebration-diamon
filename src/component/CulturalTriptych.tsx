"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CultureCollection = () => {
  const cultures = [
    {
      id: 'newari',
      name: 'Newari',
      image: '/newari.avif',
      description: 'Ancient traditions of the Kathmandu Valley'
    },
    {
      id: 'bhutanese', 
      name: 'Bhutanese',
      image: '/bhutanese.jpg',
      description: 'Sacred symbols and spiritual elegance'
    },
    {
      id: 'tamang',
      name: 'Tamang', 
      image: '/tamang.avif',
      description: 'Mountain heritage and tribal artistry'
    }
  ];

  return (
    <div className="w-full py-7">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 ">
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
            <div className="relative h-[600px] lg:h-[700px] overflow-hidden ">
                             {/* Background Image */}
               <div className="absolute inset-0">
                 <Image 
                   src={culture.image} 
                   alt={culture.name}
                   fill
                   className="object-cover"
                   priority
                 />
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
