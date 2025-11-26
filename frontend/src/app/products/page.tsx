"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Heart, X, User, MapPin, Settings, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/lib/apiService';
import type { Product } from '@/lib/apiService';
import { getImageUrl } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartStep, setCartStep] = useState<'service' | 'details'>('service');
  const [selectedService, setSelectedService] = useState<string>('');
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await apiService.getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSubcategory && matchesSearch;
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

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
    setCartStep('service');
    setSelectedService('');
    setPersonalDetails({
      name: '',
      email: '',
      phone: '',
      address: '',
      preferredDate: '',
      preferredTime: '',
      additionalNotes: ''
    });
  };

  const handleServiceSelection = (service: string) => {
    setSelectedService(service);
    setCartStep('details');
  };

  const handlePersonalDetailsSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Service:', selectedService);
    console.log('Product:', selectedProduct);
    console.log('Personal Details:', personalDetails);
    
    // Close modal and show success message
    setShowCartModal(false);
    alert('Thank you! We will contact you soon to arrange your appointment.');
  };

  // Bento grid layout component
  const BentoGrid = () => {
    if (sortedProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      );
    }

    // Create a bento grid layout with different aspect ratios
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {sortedProducts.map((product, index) => {
          // Determine the grid area based on index for bento effect
          let rowSpan = "row-span-1";
          let colSpan = "col-span-1";
          
          // Every 5th item takes double width
          if (index % 5 === 0) {
            colSpan = "col-span-2";
          }
          
          // Every 7th item takes double height
          if (index % 7 === 0) {
            rowSpan = "row-span-2";
          }
          
          // Special case for items that should be large
          if (index % 11 === 0) {
            rowSpan = "row-span-2";
            colSpan = "col-span-2";
          }

          return (
            <div 
              key={product.id} 
              className={`${rowSpan} ${colSpan} bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer`}
              onClick={() => setSelectedProduct(product)}
            >
              <div className={`relative overflow-hidden bg-gray-100 ${
                rowSpan.includes("2") && colSpan.includes("2") 
                  ? "aspect-video" 
                  : rowSpan.includes("2") 
                    ? "aspect-square" 
                    : colSpan.includes("2") 
                      ? "aspect-[2/1]" 
                      : "aspect-square"
              }`}>
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isNew && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    New
                  </div>
                )}
                {product.isSale && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Sale
                  </div>
                )}
                {/* Removed hover buttons */}
              </div>
              
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm sm:text-base">{product.name}</h3>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex gap-2 sm:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="flex-1 bg-white text-gray-900 px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95 border border-gray-200"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setShowImageModal(true);
                      }}
                      className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
                    >
                      View Image
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Fixed Header */}
      <div className="relative top-5 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              Our Collections
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our exquisite collection of fine jewelry, crafted with precision and designed for elegance
            </p>
          </div>
        </div>
      </div>

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
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      key="all"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubcategory(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === "all"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>All Products</span>
                        <span className="text-sm text-gray-500">({products.length})</span>
                      </div>
                    </button>
                    {Array.from(new Set(products.map(p => p.category))).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedSubcategory(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                          <span className="text-sm text-gray-500">
                            ({products.filter(p => p.category === category).length})
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {selectedCategory !== "all" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Types</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory))).map((sub) => (
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
                )}
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
                    {sortedProducts.length} products
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
              <BentoGrid />
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
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
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
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Image Only Modal */}
      {showImageModal && selectedProduct && (
        <ImageModal product={selectedProduct} onClose={() => setShowImageModal(false)} />
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal
          service={selectedService}
          personalDetails={personalDetails}
          cartStep={cartStep}
          onClose={() => setShowCartModal(false)}
          onServiceSelection={handleServiceSelection}
          onPersonalDetailsSubmit={handlePersonalDetailsSubmit}
          setPersonalDetails={setPersonalDetails}
        />
      )}
    </div>
  );
}

// Product List Card Component
function ProductListCard({ product, onSelect, onImageModal, onAddToCart }: { product: Product; onSelect: (product: Product) => void; onImageModal: () => void; onAddToCart: (product: Product) => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow group">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer" onClick={() => onSelect(product)}>
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              New
            </div>
          )}
          {/* Removed hover buttons */}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{product.name}</h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(product);
                }}
                className="flex-1 bg-white text-gray-900 px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95 border border-gray-200"
              >
                Quick View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageModal();
                }}
                className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
              >
                View Image
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
              >
                Add to Cart
              </button>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base w-full sm:w-auto flex justify-center"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Modal Component with Accordion Diamond Details
function ProductModal({ product, onClose, onImageModal, onAddToCart }: { product: Product; onClose: () => void; onImageModal: () => void; onAddToCart: (product: Product) => void }) {
  const [showDiamondDetails, setShowDiamondDetails] = useState(false);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
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
              {/* Left side - Product Image */}
              <div className="relative aspect-square group cursor-pointer" onClick={onImageModal}>
                <Image
                  src={getImageUrl(product.image)}
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
              
              {/* Right side - Product Details */}
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{product.details || product.fullDescription}</p>
                </div>

                {/* Diamond Details - Collapsible Accordion */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setShowDiamondDetails(!showDiamondDetails)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">Diamond Details</h3>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                        showDiamondDetails ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Collapsible Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    showDiamondDetails ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-4 space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{(product.subcategory || product.subCategory).charAt(0).toUpperCase() + (product.subcategory || product.subCategory).slice(1)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Metal:</span>
                        <span className="font-medium">{product.metal}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Purity:</span>
                        <span className="font-medium">{product.purity}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Carat Weight:</span>
                        <span className="font-medium">{product.caratWeight}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Clarity:</span>
                        <span className="font-medium">{product.clarity}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{product.color}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Cut:</span>
                        <span className="font-medium">{product.cut}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Length:</span>
                        <span className="font-medium">{product.length}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Width:</span>
                        <span className="font-medium">{product.width}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">{product.height}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{product.weight}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Certification:</span>
                        <span className="font-medium">{product.certification}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Warranty:</span>
                        <span className="font-medium">{product.warranty}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Other Gemstones:</span>
                        <span className="font-medium">None</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Order Duration:</span>
                        <span className="font-medium">7 days to make</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Availability:</span>
                        <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-amber-600 text-white py-4 px-8 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg"
                  >
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
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
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
              src={getImageUrl(product.image)}
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

// Cart Modal Component
function CartModal({ service, personalDetails, cartStep, onClose, onServiceSelection, onPersonalDetailsSubmit, setPersonalDetails }: {
  service: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    additionalNotes: string;
  };
  cartStep: 'service' | 'details';
  onClose: () => void;
  onServiceSelection: (service: string) => void;
  onPersonalDetailsSubmit: () => void;
  setPersonalDetails: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    additionalNotes: string;
  }>>;
}) {
  const [step, setStep] = useState<'service' | 'details'>(cartStep);

  useEffect(() => {
    setStep(cartStep);
  }, [cartStep]);

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPersonalDetailsSubmit();
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {step === 'service' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => onServiceSelection('in-house visit')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        service === 'in-house visit'
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-amber-500" />
                        <span>In-House Visit</span>
                      </div>
                    </button>
                    <button
                      onClick={() => onServiceSelection('store visit')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        service === 'store visit'
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        <span>Store Visit</span>
                      </div>
                    </button>
                    <button
                      onClick={() => onServiceSelection('private consultancy')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        service === 'private consultancy'
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-amber-500" />
                        <span>Private Consultancy</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={personalDetails.name}
                        onChange={handlePersonalDetailsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={personalDetails.email}
                        onChange={handlePersonalDetailsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={personalDetails.phone}
                        onChange={handlePersonalDetailsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        id="address"
                        name="address"
                        value={personalDetails.address}
                        onChange={handlePersonalDetailsChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={personalDetails.preferredDate}
                        onChange={handlePersonalDetailsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">Preferred Time</label>
                      <input
                        type="time"
                        id="preferredTime"
                        name="preferredTime"
                        value={personalDetails.preferredTime}
                        onChange={handlePersonalDetailsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={personalDetails.additionalNotes}
                        onChange={handlePersonalDetailsChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setStep('service')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Submit Details
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}