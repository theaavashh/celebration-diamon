"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { HeroSkeletonLoader } from "./skeleton-loader";

interface HeroSection {
  id: string;
  heading: string;
  subHeading: string | null;
  description: string | null;
  ctaTitle: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        console.log('Fetching hero section from API...');
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/hero');
        if (response.ok) {
          const data = await response.json();
          console.log('Hero section API response:', data);
          if (data.success && data.data && data.data.length > 0) {
            // Get the first active hero section
            const activeHero = data.data.find((hero: HeroSection) => hero.isActive) || data.data[0];
            console.log('Using hero section:', activeHero);
            setHeroData(activeHero);
          } else {
            console.log('No hero sections found in API response');
          }
        } else {
          console.error('API response not ok:', response.status);
          setError('Failed to fetch hero section');
        }
      } catch (error) {
        console.error('Error fetching hero section:', error);
        setError('Failed to fetch hero section');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroSection();
  }, []);

  // Show loading state
  if (isLoading) {
    return <HeroSkeletonLoader />;
  }

  // Show error state or fallback to default content
  if (error || !heroData) {
    return (
      <section className="relative pt-0 w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-amber-50/30">
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-0 md:pt-0 pb-4 sm:pb-6 md:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-16 xl:gap-20 items-center max-w-7xl mx-auto">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left order-1 px-2 sm:px-0 lg:col-span-7">
              <h2 className="hero-main-text text-3xl sm:text-4xl md:text-4xl lg:text-5xl jimthompson font-extrabold text-gray-800 mb-1 sm:mb-2 md:mb-3 lg:mb-4 italic leading-tight text-center lg:text-left">
                <span className="italic font-normal">Introducing,</span> Nepal&apos;s 1st and<br />
                <span className="italic font-extrabold jimthompson">Finest Diamond Studio</span>
              </h2>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-3xl xl:text-3xl jimthompson font-bold leading-tight text-gray-900 mb-2 sm:mb-3 md:mb-4 tracking-wide mt-6 sm:mt-8 lg:mt-10 text-center lg:text-left w-full lg:w-auto">
                We craft <span className="italic font-medium jimthompson">luxury</span> diamonds <br className="hidden" />
                <span className="hidden sm:inline"> </span>jewellery for worldwide
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-xs md:max-w-sm leading-relaxed mt-3 sm:mt-4 lg:mt-5 text-center lg:text-left mx-auto lg:mx-0">
                Discover, design, and celebrate with masterpieces that reflect your story.
              </p>

              {/* === CTA Button === */}
              <div className="flex justify-center lg:justify-start">
                <Link href="/products">
                  <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 active:scale-95">
                    Discover Collection
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Default Image */}
            <div className="order-2 lg:order-2 lg:col-span-5">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto lg:mx-0 mt-4 sm:mt-6 md:mt-8 lg:-top-12 xl:-top-16">
                <div className="group relative overflow-hidden transition-all duration-500 ">
                  <div className="aspect-[3/4] sm:aspect-[4/3] lg:aspect-[4/3] w-full relative">
                    <Image
                      src="/model.jpeg"
                      alt="Elegant woman in red dress with jewelry"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 45vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-0 w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-amber-50/30">
     

      {/* === Main Content with Grid Layout === */}
      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-0 md:pt-0 pb-4 sm:pb-6 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-16 xl:gap-20 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left order-1 px-2 sm:px-0  lg:col-span-7">
            <h2 className="hero-main-text text-3xl sm:text-4xl md:text-4xl lg:text-5xl jimthompson font-extrabold text-gray-800 mb-1 sm:mb-2 md:mb-3 lg:mb-4 italic leading-tight text-center lg:text-left">
              <div dangerouslySetInnerHTML={{ __html: heroData.heading }} />
            </h2>
            {heroData.subHeading && (
              <h1 className="text-base sm:text-lg md:text-xl lg:text-3xl xl:text-3xl jimthompson font-bold leading-tight text-gray-900 mb-2 sm:mb-3 md:mb-4 tracking-wide mt-6 sm:mt-8 lg:mt-10 text-center lg:text-left w-full lg:w-auto">
                <div dangerouslySetInnerHTML={{ __html: heroData.subHeading }} />
              </h1>
            )}
            {heroData.description && (
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-xs md:max-w-sm leading-relaxed mt-3 sm:mt-4 lg:mt-5 text-center lg:text-left mx-auto lg:mx-0">
                <div dangerouslySetInnerHTML={{ __html: heroData.description }} />
              </div>
            )}

            {/* === CTA Button === */}
            <div className="flex justify-center lg:justify-start">
              <Link href={heroData.ctaLink || "/products"}>
                <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 active:scale-95">
                  {heroData.ctaTitle || "Discover Collection"}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="order-2 lg:order-2 lg:col-span-5">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto lg:mx-0 mt-4 sm:mt-6 md:mt-8 lg:-top-12 xl:-top-16">
              <div className="group relative overflow-hidden transition-all duration-500 ">
                <div className="aspect-[3/4] sm:aspect-[4/3] lg:aspect-[4/3] w-full relative">
                  {heroData.imageUrl ? (
                    <Image
                      src={`http://localhost:5000${heroData.imageUrl}`}
                      alt={heroData.heading.replace(/<[^>]*>/g, '') || "Hero image"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 45vw"
                      onError={(e) => {
                        console.log('Hero image failed to load, using fallback');
                        e.currentTarget.src = '/model.jpeg';
                      }}
                    />
                  ) : (
                    <Image
                      src="/model.jpeg"
                      alt="Elegant woman in red dress with jewelry"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 45vw"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* === Bottom Section - Three Elements in Same Line === */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-3 sm:left-4 md:left-6 lg:left-8 right-3 sm:right-4 md:right-6 lg:right-8 z-10 hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Connect with Experts */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {/* Expert A - Mr. Subash Verma */}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200">
                    A
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                    Mr. Subash Verma
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
                {/* Expert B - Mr. Amit Shrestha */}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200">
                    B
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                    Mr. Amit Shrestha
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
                {/* Expert C - Mrs. Deepa Shahi */}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200">
                    C
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                    Mrs. Deepa Shahi
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">Connect our experts</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </div>
            </div>

            {/* Center Description */}
            <div className="text-center">
              <p className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed akzidenz-grotesk">
                We build, optimize, and scale diamond experiences that inspire and elevate every occasion.
              </p>
            </div>

            {/* Client Reviews */}
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 text-yellow-400">
                    ★
                  </div>
                ))}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                5000+ Client reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Decorative Elements === */}
      <div className="absolute bottom-0 right-0 z-0 flex gap-2 p-4 hidden lg:flex">
        <div className="w-4 h-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full" />
        <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full" />
      </div>
    </section>
  );
}