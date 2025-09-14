import React from "react";
import Image from "next/image";
import { Diamond, Sparkles } from "lucide-react";

const Aboutus = () => {
  return (
    <section className="w-full min-h-screen relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Section - Black Background with Image */}
        <div className="lg:col-span-5 bg-black relative">
          <div className="relative h-full w-full">
            {/* Main Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md mx-auto">
                <Image
                  src="/necklace.jpeg"
                  alt="Elegant woman wearing diamond necklace"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
            
            {/* Brand Logo */}
            <div className="absolute bottom-8 left-8">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 opacity-20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Right Section - Elegant Background with Content */}
        <div className="lg:col-span-7 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative">
          <div className="h-full flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-2xl space-y-8">
              {/* Subtitle */}
              <div className="space-y-2">
                <span className="text-sm sm:text-base font-medium text-amber-700 tracking-widest uppercase">
                  Where Heritage Meets Innovation
                </span>
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600"></div>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                WHY CELEBRATION DIAMONDS
                <br />
                <span className="text-amber-700">PERFECT FOR YOU?</span>
              </h2>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  At Celebration Diamond Studio, we don&apos;t just create jewelry; we craft
                  emotions, preserve legacies, and celebrate individuality. Based in the
                  heart of Kathmandu, we blend timeless elegance with modern precision.
                </p>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  With an <span className="font-semibold text-amber-700">in-house diamond lab</span> and 3 <span className="font-semibold text-amber-700">advanced SJI machines</span>, we ensure
                  authenticity, ethical sourcing, and unmatched craftsmanship. Each
                  piece is a fusion of tradition and innovation, designed with soul,
                  delivered with meaning.
                </p>
              </div>

              {/* Signature Quote */}
              <div className="border-l-4 border-amber-600 pl-6 py-4 bg-white/70 backdrop-blur-sm rounded-r-lg shadow-sm">
                <p className="text-lg sm:text-xl font-semibold text-gray-900 italic">
                  &ldquo;You don&apos;t just wear jewelry. You wear legacy. You wear you.&rdquo;
                </p>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm sm:text-base font-medium rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Diamond className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Discover Our Story</span>
                </button>
                
                <button className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-amber-600 text-amber-700 text-sm sm:text-base font-medium rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300">
                  <span>View Collections</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Floating Chat Icon */}
          <div className="absolute bottom-8 right-8">
            <div className="w-14 h-14 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110">
              <span className="text-white font-bold text-lg">O</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
