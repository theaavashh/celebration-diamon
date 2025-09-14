"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Store,
  Diamond,
  Gem,
  CircleDollarSign,
  Star,
  LucideIcon,
  Search,
  Handbag,
  Menu,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import TopBanner from "./top-banner";

const NAV_ITEMS: { name: string; href: string; icon: LucideIcon }[] = [
  { name: "All Jewellery", href: "/products", icon: Store },
  { name: "Necklace", href: "/products/necklace", icon: Diamond },
  { name: "Bracelet", href: "/products/bracelet", icon: CircleDollarSign },
  { name: "Earrings", href: "/products/earrings", icon: Star },
  { name: "Rings", href: "/products/rings", icon: Gem },
  { name: "Pendant", href: "/products/pendant", icon: Diamond },
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
        className="sticky top-0 z-[250] shadow-sm bg-white"
        animate={{
          top: isScrolled ? 0 : "40px" // Move to top when scrolled, leave space for banner when not scrolled
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <TopBanner />
        <div className="container pt-0 md:pt-0 mx-auto w-full bg-white">
          {/* Top Row */}
          <div className="flex items-center justify-between py-5 px-5 pr-10 flex-wrap md:flex-nowrap">
            <span className="min-w-[120px] hidden md:inline-flex gap-4 items-center">
              <Phone className="w-5 h-5" /> 9709196495  
            </span>

            <div className="flex-1 flex justify-start md:justify-center">
              <Link href="/" className="flex flex-col items-center text-black">
                <span className="text-2xl md:text-3xl font-bold font-serif tracking-wide jimthompson ">
                  Celebration
                </span>
                <span className="text-sm md:text-lg font-serif">Diamond Studio</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 min-w-[120px] justify-end">
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 text-black hover:text-gray-600"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              <div className="flex items-center gap-2">
                <Handbag className="w-5 h-5 text-black hover:text-gray-600" />
                <span className="hidden sm:inline">Bag</span>
              </div>

              <button
                className="md:hidden text-black hover:text-gray-600"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-12 pb-4 text-2xl">
            {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-2 text-lg font-normal jimthompson transition-colors hover:text-amber-300 ${
                  pathname === href
                    ? "text-amber-400 border-b-2 border-amber-400 pb-1"
                    : "text-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </Link>
            ))}
          </nav>

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
                  className="fixed inset-0 bg-black bg-opacity-30"
                  onClick={() => setMobileMenuOpen(false)}
                />

                <aside className="relative ml-auto w-80 h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
                  <button
                    className="flex items-center text-black mb-8 text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 mr-2" /> CLOSE
                  </button>

                  <nav className="flex flex-col gap-2 mb-8">
                    {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
                      <Link
                        key={name}
                        href={href}
                        className="flex items-center justify-between py-2 px-1 text-lg font-medium text-black"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {name}
                        </span>
                        <span className="text-xl">›</span>
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
          className="fixed inset-0 bg-[#ECE9E4] z-[999] overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={SEARCH_VARIANTS}
        >
          <button
            className="absolute top-6 right-8 text-3xl text-black"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>

          <div className="max-w-7xl mx-auto px-8 pt-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl text-black">🔍</span>
              <input
                type="text"
                placeholder="Search"
                className="w-full border-none outline-none text-xl bg-transparent"
                autoFocus
              />
            </div>
            <hr className="mb-8 border-[#ECE9E4]" />

            <div className="flex gap-12 flex-col md:flex-row">
              <div>
                <h2 className="text-5xl font-serif font-bold mb-6 text-black">
                  POPULAR <span className="italic font-normal">Searches</span>
                </h2>
                <ul className="space-y-4 text-lg">
                  {POPULAR_SEARCHES.map((item) => (
                    <li key={item} className="font-semibold text-[#212122]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1">
                <h2 className="text-5xl font-serif text-black font-bold mb-6">
                  YOU <span className="italic font-normal">may</span> LIKE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {RECOMMENDATIONS.map((rec) => (
                    <div key={rec.name} className="flex flex-col items-center">
                      <Image
                        src={rec.image}
                        alt={rec.name}
                        width={256}
                        height={256}
                        className="object-contain mb-4 bg-[#f8f6f3] rounded"
                      />
                      <div className="text-center">
                        <div className="text-xs text-black mb-1">{rec.title}</div>
                        <div className="font-bold text-lg mb-1">{rec.name}</div>
                        <div className="flex items-center justify-center gap-2">
                          {rec.oldPrice && (
                            <span className="line-through text-black">{rec.oldPrice}</span>
                          )}
                          <span className="font-semibold">{rec.price}</span>
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
