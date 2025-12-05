'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Start letter-by-letter replacement immediately
    const startTimer = setTimeout(() => {
      setCurrentLetterIndex(0);
    }, 0);

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

  // Handle main title letter-by-letter animation
  useEffect(() => {
    if (currentLetterIndex >= 0 && currentLetterIndex < letters.length) {
      const timer = setTimeout(() => {
        setCurrentLetterIndex(prev => prev + 1);
      }, 50); // 50ms delay between each letter for smoother animation

      return () => clearTimeout(timer);
    }
  }, [currentLetterIndex, letters.length]);

  // Handle subtitle letter-by-letter animation
  useEffect(() => {
    // Start subtitle animation after main title animation begins
    if (currentLetterIndex >= 2 && currentSubtitleLetterIndex === -1) {
      const subtitleTimer = setTimeout(() => {
        setCurrentSubtitleLetterIndex(0);
      }, 20);
      
      return () => clearTimeout(subtitleTimer);
    }
  }, [currentLetterIndex, currentSubtitleLetterIndex]);

  // Continue subtitle animation
  useEffect(() => {
    if (currentSubtitleLetterIndex >= 0 && currentSubtitleLetterIndex < subtitleLetters.length) {
      const timer = setTimeout(() => {
        setCurrentSubtitleLetterIndex(prev => prev + 1);
      }, 60); // 60ms delay between each subtitle letter for smoother animation

      return () => clearTimeout(timer);
    }
  }, [currentSubtitleLetterIndex, subtitleLetters.length]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ height: "100vh", opacity: 1 }}
          animate={{ height: "100vh", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ 
            height: { duration: 1.5, ease: "easeInOut" },
            opacity: { duration: 0.8 }
          }}
          className="fixed inset-0 z-[9999] w-full"
          style={{ 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundColor: '#000000'
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: '#000000' }}>
            <div className="flex flex-col items-center justify-center w-full h-full max-w-full">
              {/* Main title with letter-by-letter animation */}
              <motion.h1 
                className="loader-text text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-2 sm:mb-4 flex justify-center flex-wrap leading-tight jimthompson"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ color: "#ffffff", opacity: 0.5, scale: 1 }}
                    animate={{ 
                      color: index < currentLetterIndex ? "#D4AF37" : "#ffffff",
                      opacity: index < currentLetterIndex ? 1 : 0.5,
                      scale: index < currentLetterIndex ? 1.05 : 1,
                      textShadow: index < currentLetterIndex ? "0 0 20px rgba(212, 175, 55, 0.5)" : "none"
                    }}
                    transition={{ 
                      duration: 0.15, 
                      ease: "easeOut",
                      color: { duration: 0.1 },
                      opacity: { duration: 0.1 },
                      scale: { duration: 0.1 }
                    }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.h1>
              
              {/* Subtitle with letter-by-letter animation */}
              <motion.p 
                className="loader-subtitle text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl flex justify-center flex-wrap leading-tight jimthompson"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {subtitleLetters.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ color: "#F4E4BC", opacity: 0.5, scale: 1 }}
                    animate={{ 
                      color: index < currentSubtitleLetterIndex ? "#F4E4BC" : "#F4E4BC",
                      opacity: index < currentSubtitleLetterIndex ? 1 : 0.5,
                      scale: index < currentSubtitleLetterIndex ? 1.02 : 1,
                      textShadow: index < currentSubtitleLetterIndex ? "0 0 15px rgba(244, 228, 188, 0.3)" : "none"
                    }}
                    transition={{ 
                      duration: 0.15, 
                      ease: "easeOut",
                      color: { duration: 0.1 },
                      opacity: { duration: 0.1 },
                      scale: { duration: 0.1 }
                    }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.p>
              
              {/* Spinner appears after subtitle animation is complete */}
              {currentSubtitleLetterIndex >= Math.floor(subtitleLetters.length * 0.8) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    rotate: { duration: 0.6, repeat: Infinity, ease: "linear" }
                  }}
                  className="mt-8 flex justify-center"
                >
                  <div className="loader-spinner-container" data-testid="loader-spinner-container">
                    <div className="loader-spinner"></div>
                    <div className="loader-spinner-inner"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;