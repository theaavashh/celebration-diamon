"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SerenityGallery = () => {
  const galleryImages = [
    {
      src: "/3D4tLWcF.jpeg",
      alt: "Relaxing spa moment",
      title: "Moments of Tranquility",
    },
    {
      src: "/1tKbqLYD.jpeg", 
      alt: "Natural beauty elements",
      title: "Natural Elegance",
     
    },
    {
      src: "/oudvr-oZ.jpeg",
      alt: "Self-care ritual",
      title: "Personal Wellness",
    
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 relative overflow-hidden">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl jimthompson font-bold text-black mb-4">
            Moments of Serenity
          </h2>
          <p className="text-lg sm:text-2xl text-black max-w-5xl mx-auto jimthompson">
            Discover the art of mindful living through our curated collection of peaceful moments
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-80 sm:h-96 lg:h-[28rem] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 -mt-5">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-black text-xl sm:text-2xl font-bold mb-2">
                      {image.title}
                    </h3>
                  
                  </div>
                </div>

                {/* Decorative Border */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-colors duration-500"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
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
