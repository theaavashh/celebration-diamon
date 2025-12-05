"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Interfaces
interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}

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
  metal: string;
  purity: string;
  caratWeight: string;
  clarity: string;
  color: string;
  cut: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  certification?: string;
  warranty?: string;
}

interface ApiProduct {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  isNew?: boolean;
  isSale?: boolean;
  description: string;
  metalType?: string;
  goldWeight?: string;
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
}

// Constants
const CATEGORY_TITLES: Record<string, string> = {
  necklace: 'Diamond Necklaces',
  bracelet: 'Diamond Bracelets',
  earrings: 'Diamond Earrings',
  ring: 'Diamond Rings',
  rings: 'Diamond Rings',
  pendant: 'Diamond Pendants',
};

const CATEGORY_MAPPING: Record<string, string> = {
  // Plural forms
  rings: 'Ring',
  necklaces: 'Necklace',
  bracelets: 'Bracelet',
  earrings: 'Earring',
  pendants: 'Pendant',
  // Singular forms
  ring: 'Ring',
  necklace: 'Necklace',
  bracelet: 'Bracelet',
  earring: 'Earring',
  pendant: 'Pendant',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  necklace: 'Discover our stunning collection of diamond necklaces, from delicate pendants to bold statement pieces',
  bracelet: 'Explore our exquisite collection of diamond bracelets, featuring elegant and timeless designs',
  earrings: 'Browse our beautiful collection of diamond earrings, from classic studs to dramatic chandeliers',
  rings: 'Find the perfect diamond ring in our curated collection of elegant and sophisticated designs',
  pendant: 'Discover our collection of stunning diamond pendants, perfect for adding elegance to any outfit',
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];

const JIM_THOMPSON_SORT_MAPPING: Record<string, string> = {
  'created-descending': 'newest',
  'price-ascending': 'price-low-high',
  'price-descending': 'price-high-low',
  'manual': 'featured',
};

export default function CategoryPage() {
  const params = useParams();
  const categoryParam = params?.category as string | undefined;
  const category = categoryParam || '';
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [0, 100000],
    metal: [] as string[],
    purity: [] as string[],
  });

  // Computed values
  const matchingCategory = categories.find(cat => 
    cat.title.toLowerCase() === category.toLowerCase() || 
    cat.title.toLowerCase() === category.toLowerCase() + 's' ||
    cat.title.toLowerCase() + 's' === category.toLowerCase()
  );

  const displayName = matchingCategory 
    ? matchingCategory.title 
    : (CATEGORY_TITLES[category] || `${category.charAt(0).toUpperCase() + category.slice(1)}`);
    
  const displayDescription = matchingCategory
    ? `Browse our collection of ${matchingCategory.title.toLowerCase()}`
    : (CATEGORY_DESCRIPTIONS[category] || `Browse our collection of ${displayName.toLowerCase()}`);

  // Get unique filter options
  const getUniqueOptions = (key: keyof Product) => {
    return [...new Set(products.map(product => product[key]))] as string[];
  };

  const metalOptions = getUniqueOptions('metal');
  const purityOptions = getUniqueOptions('purity');

  // Fetch categories and products
  useEffect(() => {
    if (!category) {
      setIsLoading(false);
      return;
    }

    const fetchCategoriesAndProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const categoriesResponse = await fetch(`${apiBaseUrl}/categories`);
        let fetchedCategories: Category[] = [];
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (categoriesData.success && categoriesData.data) {
            fetchedCategories = categoriesData.data;
            setCategories(fetchedCategories);
          }
        }
        
        // Find category ID
        let categoryId = '';
        const normalizedCategory = category.toLowerCase();
        
        const exactMatch = fetchedCategories.find(cat => 
          cat.title.toLowerCase() === normalizedCategory || 
          cat.title.toLowerCase() === normalizedCategory + 's' ||
          cat.title.toLowerCase() + 's' === normalizedCategory
        );
        
        if (exactMatch) {
          categoryId = exactMatch.id;
        } else {
          const partialMatch = fetchedCategories.find(cat => 
            cat.title.toLowerCase().includes(normalizedCategory)
          );
          
          if (partialMatch) {
            categoryId = partialMatch.id;
          } else {
            const apiCategory = CATEGORY_MAPPING[normalizedCategory] || CATEGORY_MAPPING[category] || category;
            
            const mappedMatch = fetchedCategories.find(cat => 
              cat.title.toLowerCase() === apiCategory.toLowerCase()
            );
            
            categoryId = mappedMatch ? mappedMatch.id : apiCategory;
          }
        }
        
        // Fetch products
        const apiUrl = `${apiBaseUrl}/products?category=${encodeURIComponent(categoryId)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          setProducts([]);
          return;
        }
        
        const data = await response.json();
        
        if (data.success) {
          const productsData = data.data || [];
          const activeProducts = productsData.filter((product: ApiProduct) => product.isActive !== false);
          
          const mappedProducts = activeProducts.map((product: ApiProduct) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.category.toLowerCase(),
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.imageUrl?.startsWith('http') 
              ? product.imageUrl 
              : product.imageUrl 
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.imageUrl}` 
                : `/${category}.jpeg`,
            rating: 4.5,
            reviews: 0,
            description: product.description,
            details: product.description,
            inStock: product.stock > 0,
            isNew: product.isNew || false,
            isSale: product.isSale || false,
            metal: product.metalType || 'Gold',
            purity: '18K',
            caratWeight: '1.00 CTW',
            clarity: 'VS2',
            color: 'G',
            cut: 'Round',
            length: '18 inches',
            width: '8mm',
            height: '2mm',
            weight: '3.2g',
            certification: 'GIA',
            warranty: 'Lifetime'
          }));
          
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [category]);

  // Update sort by from URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort_by');
    if (sortParam && JIM_THOMPSON_SORT_MAPPING[sortParam]) {
      setSortBy(JIM_THOMPSON_SORT_MAPPING[sortParam]);
    }
  }, []);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    const url = new URL(window.location.href);
    
    const sortParam = Object.keys(JIM_THOMPSON_SORT_MAPPING).find(
      key => JIM_THOMPSON_SORT_MAPPING[key] === value
    ) || 'manual';
    
    if (sortParam !== 'manual') {
      url.searchParams.set('sort_by', sortParam);
    } else {
      url.searchParams.delete('sort_by');
    }
    
    window.history.replaceState({}, '', url.toString());
  };

  // Filter handlers
  const handleMetalFilterChange = (metal: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      metal: prev.metal.includes(metal)
        ? prev.metal.filter(m => m !== metal)
        : [...prev.metal, metal]
    }));
  };

  const handlePurityFilterChange = (purity: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      purity: prev.purity.includes(purity)
        ? prev.purity.filter(p => p !== purity)
        : [...prev.purity, purity]
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      priceRange: [0, 100000],
      metal: [],
      purity: [],
    });
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const filteredAndSortedProducts = sortedProducts.filter((product: Product) => {
    // Price filter
    if (product.price < selectedFilters.priceRange[0] || product.price > selectedFilters.priceRange[1]) {
      return false;
    }
    
    // Metal filter
    if (selectedFilters.metal.length > 0 && !selectedFilters.metal.includes(product.metal)) {
      return false;
    }
    
    // Purity filter
    if (selectedFilters.purity.length > 0 && !selectedFilters.purity.includes(product.purity)) {
      return false;
    }
    
    return true;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light tracking-widest text-sm">LOADING</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb and Header */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors font-light tracking-widest font-sans">
              HOME
            </Link>
            <span className="text-2xl text-gray-400 font-sans">/</span>
            <span className="text-2xl text-gray-900 font-light tracking-widest font-sans">{displayName.toUpperCase()}</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-widest mb-3 jimthompson">
              {displayName.toUpperCase()}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full">
            {/* Filter and Sorting Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="text-2xl text-gray-700 font-light font-sans">
                {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              </div>
              
              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 text-2xl font-light tracking-widest font-sans"
                >
                  <Filter className="w-4 h-4" />
                  FILTER
                </button>
                
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-transparent border-none py-1 pl-0 pr-4 text-sm focus:outline-none focus:border-black font-light cursor-pointer font-sans"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value} className="font-sans">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-200 mb-6">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-light text-gray-900 mb-3 tracking-widest font-sans">NO PRODUCTS FOUND</h3>
                <p className="text-gray-600 text-sm font-light tracking-widest font-sans">PLEASE TRY DIFFERENT FILTERS</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product: Product) => (
                  <Link 
                    href={`/products/${category}/${product.id}`}
                    key={product.id} 
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden bg-gray-50 aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.isNew && (
                        <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 text-xs font-light tracking-widest font-sans">
                          NEW
                        </div>
                      )}
                      {product.isSale && (
                        <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 text-xs font-light tracking-widest font-sans">
                          SALE
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-light text-sm text-gray-900 group-hover:text-gray-700 transition-colors tracking-wide font-sans">
                        {product.name}
                      </h3>
                      <div className="mt-1">
                        <span className="text-sm font-light text-gray-900 font-sans">
                          ${product.price.toLocaleString()}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through ml-2 font-sans">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div 
              className="absolute inset-0 bg-black/30 transition-opacity"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Filter panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex z-[10000]">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-light tracking-widest font-sans">FILTERS</h2>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="ml-3 h-7 flex items-center justify-center"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-light tracking-widest font-sans">FILTERS</h3>
                        <button 
                          onClick={clearFilters}
                          className="text-xs text-gray-600 hover:text-gray-900 font-light font-sans"
                        >
                          Clear all
                        </button>
                      </div>

                      {/* Price Range Filter */}
                      <div className="mb-6">
                        <h3 className="text-xs font-light tracking-widest mb-3 font-sans">PRICE RANGE</h3>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={selectedFilters.priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(Number(e.target.value), selectedFilters.priceRange[1])}
                            className="border border-gray-300 p-1 text-xs w-20 font-sans"
                            placeholder="Min"
                          />
                          <span className="text-xs font-sans">-</span>
                          <input
                            type="number"
                            value={selectedFilters.priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(selectedFilters.priceRange[0], Number(e.target.value))}
                            className="border border-gray-300 p-1 text-xs w-20 font-sans"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      {/* Metal Filter */}
                      <div className="mb-6">
                        <h3 className="text-xs font-light tracking-widest mb-3 font-sans">METAL</h3>
                        <div className="space-y-2">
                          {metalOptions.map(metal => (
                            <div key={metal} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`metal-${metal}`}
                                checked={selectedFilters.metal.includes(metal)}
                                onChange={() => handleMetalFilterChange(metal)}
                                className="mr-2 h-3 w-3"
                              />
                              <label htmlFor={`metal-${metal}`} className="text-xs font-light font-sans">
                                {metal}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Purity Filter */}
                      <div className="mb-6">
                        <h3 className="text-xs font-light tracking-widest mb-3 font-sans">PURITY</h3>
                        <div className="space-y-2">
                          {purityOptions.map(purity => (
                            <div key={purity} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`purity-${purity}`}
                                checked={selectedFilters.purity.includes(purity)}
                                onChange={() => handlePurityFilterChange(purity)}
                                className="mr-2 h-3 w-3"
                              />
                              <label htmlFor={`purity-${purity}`} className="text-xs font-light font-sans">
                                {purity}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
                    <button
                      type="button"
                      className="w-full bg-black text-white py-3 text-sm font-light tracking-widest font-sans"
                      onClick={() => setShowFilters(false)}
                    >
                      APPLY FILTERS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}