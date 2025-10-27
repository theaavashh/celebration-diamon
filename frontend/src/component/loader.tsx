'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);
  const [currentSubtitleLetterIndex, setCurrentSubtitleLetterIndex] = useState(-1);

  const text = "Celebration Diamond";
  const letters = text.split("");
  
  const subtitleText = "Diamond ForEvery0ne";
  const subtitleLetters = subtitleText.split("");

  useEffect(() => {
    // Lock body scroll when loader is active
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Start letter-by-letter replacement after 0.5 seconds
    const startTimer = setTimeout(() => {
      setCurrentLetterIndex(0);
    }, 500);

    // Hide loader after total time
    const loaderTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds total loading time

    return () => {
      clearTimeout(startTimer);
      clearTimeout(loaderTimer);
      // Cleanup: restore scroll when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  // Handle letter-by-letter animation
  useEffect(() => {
    if (currentLetterIndex >= 0 && currentLetterIndex < letters.length) {
      const timer = setTimeout(() => {
        setCurrentLetterIndex(prev => prev + 1);
      }, 80); // 80ms delay between each letter (faster)

      return () => clearTimeout(timer);
    }
  }, [currentLetterIndex, letters.length]);

  // Handle subtitle letter-by-letter animation
  useEffect(() => {
    if (currentLetterIndex >= letters.length - 1) {
      // Start subtitle animation after main title is complete
      const subtitleTimer = setTimeout(() => {
        setCurrentSubtitleLetterIndex(0);
      }, 200);
      
      return () => clearTimeout(subtitleTimer);
    }
  }, [currentLetterIndex, letters.length]);

  useEffect(() => {
    if (currentSubtitleLetterIndex >= 0 && currentSubtitleLetterIndex < subtitleLetters.length) {
      const timer = setTimeout(() => {
        setCurrentSubtitleLetterIndex(prev => prev + 1);
      }, 100); // 100ms delay between each subtitle letter

      return () => clearTimeout(timer);
    }
  }, [currentSubtitleLetterIndex, subtitleLetters.length]);

  const letterVariants: Variants = {
    white: {
      color: "#ffffff",
      opacity: 0.5,
      scale: 1,
      transition: {
        duration: 0.05,
        ease: "easeOut",
      },
    },
    golden: {
      color: "#D4AF37",
      opacity: 1,
      scale: 1.05,
      textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  const subtitleLetterVariants: Variants = {
    white: {
      color: "#F4E4BC",
      opacity: 0.5,
      scale: 1,
      transition: {
        duration: 0.05,
        ease: "easeOut",
      },
    },
    golden: {
      color: "#F4E4BC",
      opacity: 1,
      scale: 1.02,
      textShadow: "0 0 15px rgba(244, 228, 188, 0.3)",
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };


  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] w-full h-full flex items-center justify-center bg-black"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="text-center w-full px-2 sm:px-4 max-w-full">
            {/* Letter-by-letter replacement text */}
            <motion.h1
              className="loader-text text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-2 sm:mb-4 flex justify-center flex-wrap leading-tight"
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  animate={index <= currentLetterIndex ? "golden" : "white"}
                  className="inline-block"
                  style={{
                    textShadow: index <= currentLetterIndex ? "0 0 20px rgba(212, 175, 55, 0.5)" : "none"
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.h1>
            
            {/* Subtitle with letter-by-letter replacement */}
            {currentLetterIndex >= letters.length - 1 && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="loader-subtitle text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl flex justify-center flex-wrap leading-tight"
              >
                {subtitleLetters.map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={subtitleLetterVariants}
                    animate={index <= currentSubtitleLetterIndex ? "golden" : "white"}
                    className="inline-block"
                    style={{
                      textShadow: index <= currentSubtitleLetterIndex ? "0 0 15px rgba(244, 228, 188, 0.3)" : "none"
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.p>
            )}
            
            {/* Spinner appears after subtitle animation is complete */}
            {currentSubtitleLetterIndex >= subtitleLetters.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: [0, 360]
                }}
                transition={{ 
                  opacity: { duration: 0.3, delay: 0.5 },
                  scale: { duration: 0.3, delay: 0.5 },
                  rotate: { duration: 0.8, repeat: Infinity, ease: "linear", delay: 0.8 }
                }}
                className="mt-8 flex justify-center"
              >
                <div className="loader-spinner"></div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
