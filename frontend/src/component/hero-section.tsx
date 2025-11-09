"use client";

import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  // Show error state or fallback to default content
  if (error || !heroData) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImageee: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 md:pt-6 lg:pt-8 pb-8 md:pb-10 lg:pb-12">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center max-w-7xl mx-auto h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Side - Text Content */}
            <motion.div
              className="text-center lg:text-left space-y-4 lg:space-y-5"
              variants={itemVariants}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl jimthompson font-normal text-gray-900 leading-[1.1] tracking-tight"
                variants={itemVariants}
              >
                <span className="font-normal italic">Introducing,</span>{" "}
                <span className="font-bold">Nepal&apos;s 1st</span> and{" "}
                <br className="hidden sm:block" />
                <span className="font-bold">Finest Diamond Studio</span>
              </motion.h2>

              <motion.h3
                className="text-base sm:text-lg md:text-xl lg:text-2xl jimthompson font-normal text-gray-800 leading-relaxed"
                variants={itemVariants}
              >
                We craft <span className="italic">luxury</span> diamonds{" "}
                <br className="hidden sm:block" />
                jewellery for worldwide
              </motion.h3>

              <motion.p
                className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
                variants={itemVariants}
              >
                Discover, design, and celebrate with masterpieces that reflect your story.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                className="flex justify-center lg:justify-start pt-1"
                variants={itemVariants}
              >
                <Link href="/products">
                  <motion.button
                    className="group relative inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-semibold text-white overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500"></span>
                    {/* Hover effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-2">
                    Discover Collection
                      <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {/* Shadow */}
                    <span className="absolute inset-0 rounded-full shadow-lg shadow-amber-500/50 group-hover:shadow-xl group-hover:shadow-amber-500/60 transition-shadow duration-300"></span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              className="relative w-full lg:max-w-sm xl:max-w-md mx-auto lg:mx-0 flex justify-end"
              variants={imageVariants}
            >
              <div className="relative aspect-[3/4] w-full max-w-[350px] lg:max-w-[400px] overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Image
                      src="/model.jpeg"
                      alt="Elegant woman in red dress with jewelry"
                      fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    />
                </motion.div>
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen flex pt-16 overflow-hidden bg-white">
     

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 md:pt-6  pb-8 md:pb-10 lg:pb-12">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20  max-w-7xl mx-auto h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Text Content */}
          <motion.div
            className="text-center lg:text-left "
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl jimthompson font-normal text-gray-900 leading-[1.3] tracking-tight"
              variants={itemVariants}
            >
              <div dangerouslySetInnerHTML={{ __html: heroData.heading }} />
            </motion.h2>

            {heroData.subHeading && (
              <motion.h3
                className="text-base sm:text-lg md:text-xl lg:text-2xl jimthompson font-normal text-gray-800 leading-relaxed"
                variants={itemVariants}
              >
                <div dangerouslySetInnerHTML={{ __html: heroData.subHeading }} />
              </motion.h3>
            )}

            {heroData.description && (
              <motion.p
                className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
                variants={itemVariants}
              >
                <div dangerouslySetInnerHTML={{ __html: heroData.description }} />
              </motion.p>
            )}

            {/* CTA Button */}
            <motion.div
              className="flex justify-center lg:justify-start pt-1"
              variants={itemVariants}
            >
              <Link href={heroData.ctaLink || "/products"}>
                <motion.button
                  className="group relative inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm font-semibold text-white overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500"></span>
                  {/* Hover effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                  {heroData.ctaTitle || "Discover Collection"}
                    <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {/* Shadow */}
                  <span className="absolute inset-0 rounded-full shadow-lg shadow-amber-500/50 group-hover:shadow-xl group-hover:shadow-amber-500/60 transition-shadow duration-300"></span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            className="relative w-full lg:max-w-sm xl:max-w-md mx-auto lg:mx-0 flex justify-end -mt-10"
            variants={imageVariants}
          >
            <div className="relative aspect-[3/4] w-full max-w-[350px] lg:max-w-[800px] overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl">
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                  {heroData.imageUrl ? (
                    <Image
                      src={`http://localhost:5000${heroData.imageUrl}`}
                      alt={heroData.heading.replace(/<[^>]*>/g, '') || "Hero image"}
                      fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
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
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    />
                  )}
              </motion.div>
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}