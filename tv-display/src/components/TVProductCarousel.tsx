'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Diamond, Star, Zap, Clock, MapPin, Phone, Sparkles, Crown, Gem, Play } from 'lucide-react';
import { productService, Product } from '@/services/productService';
import TV_DISPLAY_CONFIG from '@/config/tvConfig';

export default function TVProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showImageAnimation, setShowImageAnimation] = useState(false);
  const [slideCount, setSlideCount] = useState(0);

  // Enhanced parallax scroll effects
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, -120]);
  const y3 = useTransform(scrollY, [0, 500], [0, -160]);
  const opacity1 = useTransform(scrollY, [0, 200], [0.1, 0.3]);
  const opacity2 = useTransform(scrollY, [0, 200], [0.05, 0.2]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-advance products with smooth transitions
  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setSlideCount((prevCount) => {
          const newCount = prevCount + 1;
          
          // Show image animation after every 4 slides
          if (newCount % 4 === 0) {
            setShowImageAnimation(true);
            setTimeout(() => {
              setShowImageAnimation(false);
            }, 3000); // Show image animation for 3 seconds
          }
          
          return newCount;
        });
        
        setDirection(1);
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
      }, TV_DISPLAY_CONFIG.autoplayDelay);

      return () => clearInterval(timer);
    }
  }, [products]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(TV_DISPLAY_CONFIG.fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Prevent screen sleep and hide cursor
  useEffect(() => {
    if (TV_DISPLAY_CONFIG.tvMode) {
      document.body.style.cursor = 'none';
      
      const preventContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', preventContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', preventContextMenu);
      };
    }
  }, []);

  const nextProduct = () => {
    setDirection(1);
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setDirection(-1);
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToProduct = (index: number) => {
    setDirection(index > currentProductIndex ? 1 : -1);
    setCurrentProductIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Celebration Diamond
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Loading Premium Collection...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const currentProduct = products[currentProductIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.95,
      y: 20,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.95,
      y: -20,
    }),
  };

  const slideTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex flex-col overflow-hidden">
      {/* Elegant Fashion Brand Header */}
      <motion.div 
        className="border-b border-amber-200 px-8 py-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between mx-8">
          {/* Left side - Logo */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg border border-amber-200">
              {/* <img 
                src="/celebration-diamond-logo.png" 
                alt="Celebration Diamond Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to diamond icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              /> */}
              <Diamond className="w-6 h-6 text-amber-600 hidden" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Celebration Diamond</h1>
              <p className="text-xs text-gray-600">EST. 2024</p>
            </div>
          </motion.div>

          {/* Center - Collection Name */}
          <motion.div 
            className="text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Diamond className="w-6 h-6 text-amber-800" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Diamond className="w-6 h-6 text-amber-700" />
                </motion.div>
              </div>
              <span className="text-xl font-bold text-amber-800">diamond collection</span>
            </div>
          </motion.div>

          {/* Right side - Location */}
          <motion.div 
            className="text-right"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Kathmandu, Nepal</p>
                <p className="text-xs text-gray-600">📍 Location</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Animation - Shows after every 4 slides */}
      <AnimatePresence>
        {showImageAnimation && (
          <motion.div
            className="absolute inset-0 z-50 bg-gradient-to-br from-slate-900 via-gray-800 to-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Simple Image Showcase */}
            <div className="relative w-full h-full flex items-center justify-center">
              {currentProduct && currentProduct.images && currentProduct.images.length > 0 && currentProduct.images[0] !== '/diamond-placeholder.svg' ? (
                <motion.div
                  className="relative"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.img
                    src={currentProduct.images[0]}
                    alt={currentProduct.name}
                    className="max-w-4xl max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Subtle overlay effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Gem className="w-48 h-48 text-amber-400 mx-auto mb-8" />
                  </motion.div>
                  <motion.h2
                    className="text-4xl font-light text-white mb-4"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    CELEBRATION DIAMOND
                  </motion.h2>
                  <motion.p
                    className="text-xl text-gray-300"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    Premium Collection
                  </motion.p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Screen Layout */}
      <div className="flex flex-1 relative">
        {/* Organic Floating Background Elements */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y: y1, opacity: opacity1 }}
        >
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl"
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 15, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"
            animate={{
              x: [0, -25, 35, 0],
              y: [0, 25, -15, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          ></motion.div>
        </motion.div>

        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y: y2, opacity: opacity2 }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-2xl"
            animate={{
              x: [0, 20, -30, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full blur-2xl"
            animate={{
              x: [0, -15, 25, 0],
              y: [0, 20, -25, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 8
            }}
          ></motion.div>
        </motion.div>

        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ y: y3 }}
        >
          <motion.div 
            className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-xl"
            animate={{
              x: [0, 25, -20, 0],
              y: [0, -15, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          ></motion.div>
        </motion.div>

        {/* Left Panel - Product Image */}
        <div className="w-1/2 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
          {/* Logo */}
          <motion.div 
            className="absolute top-8 left-8 z-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Diamond className="w-6 h-6 text-amber-800" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Diamond className="w-6 h-6 text-amber-700" />
                </motion.div>
              </div>
              <span className="text-2xl font-bold text-amber-800">diamond collection</span>
            </div>
          </motion.div>

          {/* Main Product Image */}
          <div className="flex items-center justify-center h-full relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentProductIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="relative"
              >
                {/* Product Container */}
                <div className="relative">
                  {/* Main Diamond Display */}
                  <motion.div 
                    className="w-80 h-80 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-2xl flex items-center justify-center relative"
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {currentProduct.images && currentProduct.images.length > 0 && currentProduct.images[0] ? (
                      <img
                        src={currentProduct.images[0]}
                        alt={currentProduct.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-center">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <Gem className="w-32 h-32 text-amber-600 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-amber-800 font-semibold">Premium Quality</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Organic Decorative Elements */}
                  <motion.div 
                    className="absolute top-16 left-16 w-4 h-4 bg-amber-800 rounded-full opacity-60"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute top-32 right-20 w-3 h-3 bg-amber-700 rounded-full opacity-70"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute bottom-20 left-20 w-5 h-5 bg-amber-600 rounded-full opacity-50"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute bottom-32 right-16 w-3 h-3 bg-amber-800 rounded-full opacity-60"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute top-48 left-8 w-2 h-2 bg-amber-700 rounded-full opacity-80"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  ></motion.div>

                  {/* Spoon equivalent - diamond tool */}
                  <motion.div 
                    className="absolute top-24 left-8 w-16 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform rotate-12"
                    animate={{
                      rotate: [12, 15, 9, 12],
                      scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute top-20 left-6 w-2 h-2 bg-amber-600 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>

                  {/* Autumn leaf equivalent - sparkle */}
                  <motion.div 
                    className="absolute top-12 right-12 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-60"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                      opacity: [0.6, 0.9, 0.6],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                </div>

                {/* Play Button Overlay */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <motion.div 
                    className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play className="w-8 h-8 text-amber-600 ml-1" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Copyright */}
          <motion.div 
            className="absolute bottom-8 left-8 text-amber-600 text-sm transform -rotate-90 origin-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © Celebration Diamond
          </motion.div>
        </div>

        {/* Right Panel - Product Details */}
        <div className="w-1/2 bg-gradient-to-br from-amber-50 to-orange-50 relative">
          {/* Social Media Icons */}
          <motion.div 
            className="absolute top-8 right-8 flex space-x-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {['f', 'i', 'y'].map((letter, index) => (
              <motion.div 
                key={letter}
                className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "#92400e" }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white text-xs font-bold">{letter}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div 
            className="absolute top-16 right-8 text-amber-600 text-sm font-light"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {String(currentProductIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col justify-center h-full px-16 py-20">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentProductIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="space-y-12"
              >
                {/* Product Name */}
                <motion.h1 
                  className="text-6xl font-bold text-amber-900 leading-tight"
                  initial={{ y: 40, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.2,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  {currentProduct.name}
                </motion.h1>

                {/* Product Description */}
                <motion.p 
                  className="text-lg text-amber-800 leading-relaxed max-w-md"
                  initial={{ y: 40, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.4,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  {currentProduct.description}
                </motion.p>

                {/* Order Button */}
                <motion.button 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg w-fit"
                  initial={{ y: 40, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.6,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 10px 25px rgba(217, 119, 6, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  ORDER NOW
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Color/Type Selector */}
          <motion.div 
            className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                  index === currentProductIndex
                    ? 'bg-amber-600 scale-125'
                    : index === 0
                    ? 'bg-gray-300'
                    : index === 1
                    ? 'bg-amber-200'
                    : index === 2
                    ? 'bg-amber-400'
                    : index === 3
                    ? 'bg-amber-600'
                    : 'bg-amber-800'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToProduct(index)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              />
            ))}
          </motion.div>

          {/* Scroll Indicators */}
          <motion.div 
            className="absolute bottom-8 right-8 flex flex-col items-center space-y-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <motion.div 
              className="w-4 h-4 border-t-2 border-r-2 border-amber-600 transform rotate-45"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <div className="w-1 h-8 bg-amber-600"></div>
            <motion.div 
              className="w-4 h-4 border-b-2 border-r-2 border-amber-600 transform rotate-45"
              animate={{ 
                y: [0, 8, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            ></motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="absolute bottom-8 left-8 text-amber-700 text-sm"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-4 h-4" />
              <span>{TV_DISPLAY_CONFIG.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{TV_DISPLAY_CONFIG.showroomHours}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Banner */}
      <motion.div 
        className="bg-white border-t border-gray-200 px-8 py-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left side - Diamond Collection */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <Diamond className="w-4 h-4 text-gray-600" />
              <Diamond className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">diamond collection</span>
          </div>

          {/* Right side - Slide Numbers */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500 line-through">
              {String(currentProductIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              / {String(products.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}