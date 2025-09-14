"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Heart, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Product data structure
interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  details: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

// Ring products data
const ringProducts: Product[] = [
  // {
  //   id: "1",
  //   name: "Diamond Solitaire Ring",
  //   category: "rings",
  //   subcategory: "engagement",
  //   price: 2500,
  //   originalPrice: 3000,
  //   image: "/ring.jpeg",
  //   rating: 4.8,
  //   reviews: 124,
  //   description: "Classic 1-carat diamond solitaire ring in 18k white gold",
  //   details: "This timeless engagement ring features a brilliant-cut diamond set in a classic solitaire setting. The 18k white gold band provides the perfect backdrop for the diamond's sparkle.",
  //   inStock: true,
  //   isNew: true
  // },
  // {
  //   id: "5",
  //   name: "Vintage Style Diamond Ring",
  //   category: "rings",
  //   subcategory: "vintage",
  //   price: 4200,
  //   image: "/ring.jpeg",
  //   rating: 4.9,
  //   reviews: 92,
  //   description: "Art deco inspired diamond ring with intricate details",
  //   details: "This stunning vintage-inspired ring features an art deco design with multiple diamonds set in an intricate pattern. The 18k yellow gold setting adds warmth and character.",
  //   inStock: true,
  //   isNew: true
  // },
  // {
  //   id: "7",
  //   name: "Three Stone Diamond Ring",
  //   category: "rings",
  //   subcategory: "engagement",
  //   price: 3800,
  //   image: "/ring.jpeg",
  //   rating: 4.7,
  //   reviews: 156,
  //   description: "Elegant three-stone ring symbolizing past, present, and future",
  //   details: "This meaningful three-stone ring features three brilliant-cut diamonds representing your past, present, and future together. Set in 18k white gold with a classic design.",
  //   inStock: true
  // },
  // {
  //   id: "8",
  //   name: "Modern Stackable Ring Set",
  //   category: "rings",
  //   subcategory: "stackable",
  //   price: 1200,
  //   image: "/ring.jpeg",
  //   rating: 4.6,
  //   reviews: 89,
  //   description: "Contemporary stackable rings for versatile styling",
  //   details: "This modern set includes three thin bands that can be worn together or separately. Each ring features delicate diamond accents in a sleek, contemporary design.",
  //   inStock: true
  // }
];

const subcategories = ["engagement", "wedding", "vintage", "modern", "stackable"];

export default function RingsPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      // Auto-hide filters on mobile when screen size changes
      if (window.innerWidth < 1024) {
        setShowFilters(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const filteredProducts = ringProducts.filter(product => {
    const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubcategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Fixed Header */}
      <div className="relative top-0 left-0 right-0  z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4 mt-16">
            <Link href="/products" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Collections</span>
            </Link>
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              Diamond Rings
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our exquisite collection of diamond rings, from classic solitaires to modern designs
            </p>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header */}
  

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-amber-700 transition-colors font-medium"
          >
            <Filter className="w-5 h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="lg:w-80 space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Filter Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search rings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Ring Types */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ring Types</h3>
                  <div className="space-y-2">
                    {subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedSubcategory === sub
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {sortedProducts.length} rings
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid" ? "bg-amber-50 text-amber-700" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list" ? "bg-amber-50 text-amber-700" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={setSelectedProduct}
                    onImageModal={() => {
                      setSelectedProduct(product);
                      setShowImageModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <ProductListCard 
                    key={product.id} 
                    product={product} 
                    onSelect={setSelectedProduct}
                    onImageModal={() => {
                      setSelectedProduct(product);
                      setShowImageModal(true);
                    }}
                  />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rings found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onImageModal={() => {
            setShowImageModal(true);
          }}
        />
      )}

      {/* Image Only Modal */}
      {showImageModal && selectedProduct && (
        <ImageModal product={selectedProduct} onClose={() => setShowImageModal(false)} />
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onSelect, onImageModal }: { product: Product; onSelect: (product: Product) => void; onImageModal: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            New
          </div>
        )}
        {product.isSale && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Sale
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onSelect(product)}
            className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
          >
            Quick View
          </button>
          <button
            onClick={onImageModal}
            className="bg-amber-600 text-white px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
          >
            View Image
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-end">
          <button className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Product List Card Component
function ProductListCard({ product, onSelect, onImageModal }: { product: Product; onSelect: (product: Product) => void; onImageModal: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow group">
      <div className="flex gap-6">
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              New
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => onSelect(product)}
              className="bg-white text-gray-900 px-3 py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs hover:scale-105 active:scale-95"
            >
              Quick View
            </button>
            <button
              onClick={onImageModal}
              className="bg-amber-600 text-white px-3 py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs hover:scale-105 active:scale-95"
            >
              View Image
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex items-center justify-end">
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({ product, onClose, onImageModal }: { product: Product; onClose: () => void; onImageModal: () => void }) {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="relative aspect-square group cursor-pointer" onClick={onImageModal}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                {(product.isNew || product.isSale) && (
                  <div className="absolute top-4 left-4">
                    {product.isNew && (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
                        New
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sale
                      </span>
                    )}
                  </div>
                )}
                {/* Hover text overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg">
                    Click to view more
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{product.details}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-amber-600 text-white py-4 px-8 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg">
                    Add to Cart
                  </button>
                  <button className="px-8 py-4 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Image Only Modal Component
function ImageModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Product Image */}
          <div className="relative w-full h-96 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            
            {/* Close Button - Overlay on image */}
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-black hover:bg-opacity-20 rounded-full backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {(product.isNew || product.isSale) && (
              <div className="absolute top-4 left-4">
                {product.isNew && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-2">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sale
                  </span>
                )}
              </div>
            )}
            
            {/* Product Name - Overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent bg-opacity-50 p-6">
              <h2 className="text-2xl font-bold text-white text-center">{product.name}</h2>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 