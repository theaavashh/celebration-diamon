"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaSearch,
  FaShoppingBag,
  FaPhone,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";
import { Urbanist } from "next/font/google";

import TopBanner from "./top-banner";
const urbanist = Urbanist({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  navImage1Url?: string | null;
  navImage2Url?: string | null;
}

interface SiteSettings {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
}

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcatCache, setSubcatCache] = useState<Record<string, Subcategory[]>>({});
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [loadingSubFor, setLoadingSubFor] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const active = data.data
              .filter((c: Category) => c.isActive)
              .sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
            setCategories(active);
          }
        }
      } catch (_) {
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const res = await fetch(`${apiBaseUrl}/settings`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSettings(json.data as SiteSettings);
          }
        }
      } catch (_) {
      }
    };
    fetchSettings();
  }, []);

  const ensureSubcategories = async (categoryId: string) => {
    if (subcatCache[categoryId] || loadingSubFor === categoryId) return;
    try {
      setLoadingSubFor(categoryId);
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/categories/${categoryId}/subcategories`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSubcatCache(prev => ({ ...prev, [categoryId]: data.data as Subcategory[] }));
        }
      }
    } catch (_) {
    } finally {
      setLoadingSubFor(null);
    }
  };

  return (
    <> 
      <motion.header 
        className="sticky top-0 z-[250] shadow-sm bg-white mt-0"
        animate={{
          top: isScrolled ? 0 : "0px" // Changed from "40px" to "0px" since banner is removed
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
       
        <div className="pt-0 md:pt-0 w-full">
          {/* Main Header Row */}
          <div className="flex justify-between items-center py-0 md:pt-3  px-4">
            {/* Logo on the left - takes full height */}
            <div className="flex items-center justify-center h-5 md:pt-10">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/celeb.png"
                  alt="Celebration Diamond Logo"
                  width={120}
                  height={30}
                  className="object-contain h-7 sm:h-20 w-auto"
                />
              </Link>
            </div>

            {/* Right section - divided into two rows */}
            <div className="flex flex-col h-12 pt-1 md:pt-0 gap-1">
              {/* First row - Search, Bag, Phone */}
              <div className="flex items-center space-x-2 justify-end h-8">
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-2 text-black hover:text-gray-600 px-3 py-1"
                >
                  <FaSearch className="w-5 h-5" />
                  <span className={`${urbanist.className} hidden sm:inline`}>Search</span>
                </button>

                {(settings?.phone ) && (
                  <span className={`${urbanist.className} hidden md:inline-flex gap-2 items-center px-3 py-1`}>
                    <FaPhone className="w-5 h-5" /> {settings?.phone } (Nepal)
                  </span>
                )}

                <button
                  className="md:hidden text-black hover:text-gray-600 flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <FaBars className="w-6 h-6" /> {/* Removed mr-5 */}
                </button>
              </div>

              
            </div>
          </div>

          {/* Full-width Navbar Row */}
          <nav className="hidden md:flex mt-1 items-center justify-center space-x-6 w-full">
            {categories.map((cat) => {
              const href = cat.link || "/products";
              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredCategoryId(cat.id);
                    void ensureSubcategories(cat.id);
                  }}
                  onMouseLeave={() => setHoveredCategoryId(prev => (prev === cat.id ? null : prev))}
                >
                  <Link
                    href={href}
                    className={`flex items-center space-x-2 font-normal jimthompson transition-colors hover:text-amber-300 px-2 py-1 ${
                      pathname === href ? "text-amber-400 border-b-2 border-amber-400 pb-0.5" : "text-black"
                    }`}
                  >
                    <span className="text-lg">{cat.title}</span>
                  </Link>
                  <AnimatePresence>
                    {hoveredCategoryId === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-md w-[640px] p-4 z-50"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-2">{cat.title}</div>
                            <div className="rounded">
                              {(subcatCache[cat.id] || []).length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500">{loadingSubFor === cat.id ? "Loading..." : "No subcategories"}</div>
                              )}
                              {(subcatCache[cat.id] || []).map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {cat.navImage1Url ? (
                              <div className="relative aspect-[4/3] rounded overflow-hidden">
                                <Image
                                  src={getImageUrl(cat.navImage1Url)}
                                  alt={`${cat.title} image 1`}
                                  fill
                                  sizes="(max-width: 768px) 40vw, 20vw"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="bg-gray-100 rounded h-24"></div>
                            )}
                            {cat.navImage2Url ? (
                              <div className="relative aspect-[4/3] rounded overflow-hidden">
                                <Image
                                  src={getImageUrl(cat.navImage2Url)}
                                  alt={`${cat.title} image 2`}
                                  fill
                                  sizes="(max-width: 768px) 40vw, 20vw"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="bg-gray-100 rounded h-24"></div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
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
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.link || "/products"}
                        className="flex items-center justify-center py-2 px-1 text-lg font-medium text-black"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">{cat.title}</span>
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
