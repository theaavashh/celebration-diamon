"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const InstagramProducts = () => {
  const instagramProducts = [
    {
      id: 1,
      image: "/ig-1.jfif",
      alt: "Elegant jewelry collection",
      category: "#earring",
      likes: "2.4k",
      comments: "128"
    },
    {
      id: 2,
      image: "/ig-2.jfif",
      alt: "Diamond bracelet",
      category: "#necklace", 
      likes: "1.8k",
      comments: "95"
    }
  ];

  return (
    <section className="w-full py-12 px-4 bg-[#F8F7F4">
      <div className="max-w-7xl mx-auto">
        {/* Instagram Style Product Grid - 3 containers */}
        <div className="flex gap-4 md:gap-2 justify-center">
          {/* First container - Image */}
          <div className="w-80 md:w-96 bg-white shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="relative h-80 md:h-96 overflow-hidden">
              <Image
                src={instagramProducts[0].image}
                alt={instagramProducts[0].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {instagramProducts[0].category}
                </h3>
                <span className="text-sm text-gray-500">@celebrationsdiamond</span>
              </div>
            </div>
          </div>

          {/* Second container - Image */}
          <div className="w-80 md:w-96 bg-white shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="relative h-80 md:h-96 overflow-hidden">
              <Image
                src={instagramProducts[1].image}
                alt={instagramProducts[1].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {instagramProducts[1].category}
                </h3>
                <span className="text-sm text-gray-500">@celebrationsdiamond</span>
              </div>
            </div>
          </div>

          {/* Third container - Text */}
          <div className="w-80 md:w-96 bg-[#E1C16E] rounded-tr-2xl shadow-lg overflow-hidden flex flex-col justify-center items-center p-8 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 ">
                Join our Instagram community!
              </h3>
              <p className="text-gray-600 mb-6">
                Follow us for the latest jewelry trends and exclusive offers
              </p>
              <Link
                href="https://instagram.com/celebrationdiamond"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <span>Follow Now</span>
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramProducts;