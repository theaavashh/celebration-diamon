"use client";

import React from 'react';
import Image from 'next/image';

const SocialMediaIcons = () => {
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-1 rounded-r-2xl  bg-white items-center">
      {/* Facebook */}
      <a
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Follow us on Facebook"
      >
        <Image src="/facebook-logo.webp" alt="Facebook" width={200} height={200} className="object-cover" />
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Follow us on Instagram"
      >
        <Image src="/instagram-logo.png" alt="Instagram" width={200} height={200} className="object-cover" />
      </a>

      {/* TikTok */}
      <a
        href="https://tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-8 h-8 bg-black hover:bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 space-y-3"
        aria-label="Follow us on TikTok"
      >
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      </a>
    </div>
  );
};

export default SocialMediaIcons;
