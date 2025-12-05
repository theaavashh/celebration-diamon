"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Heart, X, ChevronDown, Sliders } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/lib/apiService';
import type { Product } from '@/lib/apiService';
import { getImageUrl } from '@/lib/api';
import Link from 'next/link';

// Add Category interface
interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Add categories state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        // Fetch both products and categories in parallel
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          apiService.getProducts(),
          fetchCategories()
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products or categories:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Add function to fetch categories
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/categories`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  };

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
      case "price-low-high":
        // Placeholder - would need actual price data
        return 0;
      case "price-high-low":
        // Placeholder - would need actual price data
        return 0;
      default:
        return 0;
    }
  });

  // Add function to get category title by ID
  const getCategoryTitle = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
  };

  // Product grid component with Jim Thompson inspired design
  const ProductGrid = () => {
    if (sortedProducts.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-6">
            <Search className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-3">No products found</h3>
          <p className="text-gray-600 max-w-md mx-auto">Try adjusting your filters or search terms to discover our exquisite collection</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.map((product) => {
          // Get category title for display
          const categoryTitle = getCategoryTitle(product.category);
          
          // Find the category object to get the link
          const categoryObj = categories.find(cat => cat.id === product.category);
          const categoryLink = categoryObj ? categoryObj.link?.replace('/', '') || categoryObj.title.toLowerCase() : 'collection';

          return (
            <Link 
              href={`/products/${categoryLink}/${product.id}`}
              key={product.id} 
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-gray-50 aspect-square">
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium">
                    NEW
                  </div>
                )}
                {product.isSale && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-medium">
                    SALE
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white text-black px-6 py-3 text-sm font-medium">
                    View Details
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{categoryTitle}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 tracking-wide inter">
              OUR COLLECTIONS
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our exquisite collection of fine jewelry, crafted with precision and designed for elegance
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Sliders className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent text-sm font-medium text-gray-700 hover:text-gray-900 pr-8 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {sortedProducts.length} products
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="lg:w-64 flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Search */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Search</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-amber-600 focus:border-amber-600 text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
                    <div className="space-y-3">
                      <button
                        key="all"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedSubcategory(null);
                        }}
                        className={`w-full text-left text-sm ${
                          selectedCategory === "all"
                            ? "text-amber-600 font-medium"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        All Products
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSelectedSubcategory(null);
                          }}
                          className={`w-full text-left text-sm ${
                            selectedCategory === category.id
                              ? "text-amber-600 font-medium"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {category.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subcategories */}
                  {selectedCategory !== "all" && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Type</h4>
                      <div className="space-y-3">
                        {Array.from(new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory))).map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                            className={`w-full text-left text-sm ${
                              selectedSubcategory === sub
                                ? "text-amber-600 font-medium"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {sub ? sub.charAt(0).toUpperCase() + sub.slice(1) : 'Uncategorized'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid />
            
            {sortedProducts.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 max-w-md mx-auto">Try adjusting your filters or search terms to discover our exquisite collection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}