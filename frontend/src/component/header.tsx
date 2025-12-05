"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaSearch,
  FaShoppingBag,
  FaPhone,
  FaStore,
  FaGem,
  FaDollarSign,
  FaStar,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { GiDiamondRing, GiPearlNecklace, GiDropEarrings } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import TopBanner from "./top-banner";

type IconComponent = React.ComponentType<{ className?: string }>;

const NAV_ITEMS: { name: string; href: string; icon: IconComponent }[] = [
  { name: "All Jewellery", href: "/products", icon: FaStore },
  { name: "Necklace", href: "/products/necklace", icon: GiPearlNecklace },
  { name: "Bracelet", href: "/products/bracelet", icon: FaDollarSign },
  { name: "Earrings", href: "/products/earrings", icon: GiDropEarrings },
  { name: "Rings", href: "/products/rings", icon: GiDiamondRing },
  { name: "Pendant", href: "/products/pendant", icon: FaGem },
];

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolled down more than 50px
      if (currentScrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <> 
      <motion.header 
        className="sticky top-0 z-[250] shadow-sm bg-white mt-10"
        animate={{
          top: isScrolled ? 0 : "0px" // Changed from "40px" to "0px" since banner is removed
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
       
        <div className="pt-0 md:pt-0 w-full">
          {/* Main Header Row */}
          <div className="flex justify-between items-center py-0 md:py-3 px-5">
            {/* Logo on the left - takes full height */}
            <div className="flex items-center justify-center h-10">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/celeb.png"
                  alt="Celebration Diamond Logo"
                  width={180}
                  height={40}
                  className="object-contain w-20 sm:w-32 md:w-[180px]"
                />
              </Link>
            </div>

            {/* Right section - divided into two rows */}
            <div className="flex flex-col h-20 pt-5 md:pt-0">
              {/* First row - Search, Bag, Phone */}
              <div className="flex items-center space-x-3 justify-end h-10">
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-2 text-black hover:text-gray-600 px-3 py-1"
                >
                  <FaSearch className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </button>

                <span className="hidden md:inline-flex gap-2 items-center px-3 py-1">
                  <FaPhone className="w-5 h-5" />  +9779709196495 (Nepal)
                </span>

                <button
                  className="md:hidden text-black hover:text-gray-600 flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <FaBars className="w-6 h-6" /> {/* Removed mr-5 */}
                </button>
              </div>

              {/* Second row - Navigation - Centered exactly in middle */}
              <nav className="hidden md:flex mt-5 pl-32 items-start justify-start space-x-7  h-10 w-full">
                {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center space-x-2 font-normal jimthompson transition-colors hover:text-amber-300 px-4 py-2 ${
                      pathname === href
                        ? "text-amber-400 border-b-2 border-amber-400 pb-1"
                        : "text-black"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xl">{name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="fixed inset-0 z-50 flex mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="fixed inset-0 bg-black/30"
                  onClick={() => setMobileMenuOpen(false)}
                />

                <aside className="relative ml-auto w-80 h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
                  <button
                    className="flex items-center text-black mb-8 text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <FaTimes className="h-5 w-5 mr-2" /> CLOSE
                  </button>

                  <nav className="flex flex-col gap-2 mb-8">
                    {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
                      <Link
                        key={name}
                        href={href}
                        className="flex items-center justify-center py-2 px-1 text-lg font-medium text-black"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-5 h-5 mr-2" />
                          {name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_VARIANTS = {
  hidden: { opacity: 0, y: -60, transition: { duration: 0.35, ease: "easeInOut" as const } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeInOut" as const } },
  exit: { opacity: 0, y: -60, transition: { duration: 0.35, ease: "easeInOut" as const } },
};

const POPULAR_SEARCHES = ["BESTSELLERS", "NEW IN", "GIFTS"];

const RECOMMENDATIONS = [
  {
    title: "WEDDING PHOTO ALBUM",
    name: "Happily Ever After, Beige",
    price: "€50",
    image: "/images/album.jpg",
  },
  {
    title: "PORTABLE FAN",
    name: "Fantastic, Wood Beige",
    price: "€67",
    oldPrice: "€79",
    image: "/images/fan.jpg",
  },
  {
    title: "BOARD GAME",
    name: "Chess, Classic",
    price: "€65",
    image: "/images/chess.jpg",
  },
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white z-[999] overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={SEARCH_VARIANTS}
        >
          <button
            className="absolute top-6 right-8 text-3xl text-black hover:text-gray-600 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>

          <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
            <div className="flex items-center gap-4 mb-10">
              <FaSearch className="text-2xl text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, categories, or keywords..."
                className="w-full border-b-2 border-gray-200 outline-none text-xl bg-transparent pb-3 focus:border-amber-400 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-12 flex-col lg:flex-row">
              <div className="lg:w-1/3">
                <h2 className="text-3xl font-serif font-bold mb-6 text-black">
                  POPULAR <span className="italic font-normal">Searches</span>
                </h2>
                <ul className="space-y-3">
                  {POPULAR_SEARCHES.map((item) => (
                    <li 
                      key={item} 
                      className="font-medium text-lg text-gray-700 hover:text-amber-600 cursor-pointer transition-colors py-2 border-b border-gray-100"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-2/3">
                <h2 className="text-3xl font-serif text-black font-bold mb-6">
                  TRENDING <span className="italic font-normal">Products</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RECOMMENDATIONS.map((rec) => (
                    <div key={rec.name} className="flex flex-col group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-50">
                        <Image
                          src={rec.image}
                          alt={rec.name}
                          width={256}
                          height={256}
                          className="object-contain w-full h-48 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{rec.title}</div>
                        <div className="font-medium text-lg mb-1 text-gray-800 group-hover:text-amber-600 transition-colors">{rec.name}</div>
                        <div className="flex items-center justify-center gap-2">
                          {rec.oldPrice && (
                            <span className="line-through text-gray-400 text-sm">{rec.oldPrice}</span>
                          )}
                          <span className="font-semibold text-amber-600">{rec.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
