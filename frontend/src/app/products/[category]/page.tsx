"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
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
  design?: string;
  gender?: string;
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
  materialType?: string;
  goldWeight?: string;
  goldPurity?: string;
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
  const [selectedFilters, setSelectedFilters] = useState({
    metal: [] as string[],
    purity: [] as string[],
    subcategory: [] as string[],
    design: [] as string[],
    gender: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [showFilters, setShowFilters] = useState(false);
  const [accordion, setAccordion] = useState({
    metal: true,
    purity: true,
    category: true,
    design: true,
    gender: true,
  });
  const toggleSection = (key: 'metal' | 'purity' | 'category' | 'design' | 'gender') => {
    setAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
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
    return [...new Set(
      products
        .map((product) => product[key])
        .filter((v): v is string => typeof v === 'string' && v.length > 0)
    )] as string[];
  };

  const metalOptions = getUniqueOptions('metal');
  const purityOptions = getUniqueOptions('purity');
  const subcategoryOptions = getUniqueOptions('subcategory');
  const designOptions = getUniqueOptions('design');
  const genderOptions = getUniqueOptions('gender');

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
            subcategory: (product.subCategory || product.subcategory || product.category || '').toLowerCase(),
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
            purity: product.goldPurity || product.materialType || '18K',
            caratWeight: '1.00 CTW',
            clarity: 'VS2',
            color: 'G',
            cut: 'Round',
            length: '18 inches',
            width: '8mm',
            height: '2mm',
            weight: '3.2g',
            certification: 'GIA',
            warranty: 'Lifetime',
            design: (() => {
              const w = parseFloat(String(product.goldWeight || ''));
              if (!isNaN(w)) {
                if (w >= 10) return 'Heavy';
                if (w >= 5) return 'Medium';
                return 'Light';
              }
              return 'Standard';
            })(),
            gender: (() => {
              const sub = (product.subCategory || product.subcategory || '').toLowerCase();
              if (sub.includes('men') || sub.includes('male')) return 'Male';
              if (sub.includes('women') || sub.includes('female') || sub.includes('ladies')) return 'Female';
              return 'Unisex';
            })()
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

  const handleSubcategoryFilterChange = (sub: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      subcategory: prev.subcategory.includes(sub)
        ? prev.subcategory.filter(s => s !== sub)
        : [...prev.subcategory, sub]
    }));
  };

  const handleDesignFilterChange = (design: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      design: prev.design.includes(design)
        ? prev.design.filter(d => d !== design)
        : [...prev.design, design]
    }));
  };

  const handleGenderFilterChange = (gender: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      gender: prev.gender.includes(gender)
        ? prev.gender.filter(g => g !== gender)
        : [...prev.gender, gender]
    }));
  };

  

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, sortBy, searchTerm]);

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
    // Metal filter
    if (selectedFilters.metal.length > 0 && !selectedFilters.metal.includes(product.metal)) {
      return false;
    }
    
    // Purity filter
    if (selectedFilters.purity.length > 0 && !selectedFilters.purity.includes(product.purity)) {
      return false;
    }
    
    if (selectedFilters.subcategory.length > 0 && !selectedFilters.subcategory.includes(product.subcategory)) {
      return false;
    }
    
    if (selectedFilters.design.length > 0 && (!product.design || !selectedFilters.design.includes(product.design))) {
      return false;
    }
    
    if (selectedFilters.gender.length > 0 && (!product.gender || !selectedFilters.gender.includes(product.gender))) {
      return false;
    }
    
    return true;
  });

  const totalCount = filteredAndSortedProducts.length;
  const startIndex = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endIndex = Math.min(currentPage * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * pageSize, (currentPage) * pageSize);

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
    <div className="min-h-screen bg-white pt-18">
      <div className="bg-white">
        <div className="max-w-9xl mx-auto px-4 sm:px-18 text-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors font-light  ">
              Home
            </Link>
            <span className="text-2xl text-gray-400 font-sans">/</span>
            <span className="text-2xl text-gray-900 font-light">{displayName}</span>
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 jimthompson">
              {displayName.toUpperCase()}
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-9xl mx-auto px-4 sm:px-18 pt-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="hidden lg:block w-full lg:w-64 shrink-0">
            <div className="p-4">
              <div className="mb-6">
                <button onClick={() => toggleSection('metal')} className="w-full flex items-center justify-between text-2xl font-medium  mb-3">
                  <span>METAL</span>
                  {accordion.metal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {accordion.metal && (
                  <div className="space-y-2">
                    {metalOptions.map((metal) => (
                      <label key={metal} className="flex items-center text-xl font-light">
                        <input type="checkbox" checked={selectedFilters.metal.includes(metal)} onChange={() => handleMetalFilterChange(metal)} className="mr-2 h-3 w-3" />
                        {metal}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-6">
                <button onClick={() => toggleSection('purity')} className="w-full flex items-center justify-between text-2xl font-medium  mb-3">
                  <span>PURITY</span>
                  {accordion.purity ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {accordion.purity && (
                  <div className="space-y-2">
                    {purityOptions.map((purity) => (
                      <label key={purity} className="flex items-center text-xl font-light">
                        <input type="checkbox" checked={selectedFilters.purity.includes(purity)} onChange={() => handlePurityFilterChange(purity)} className="mr-2 h-3 w-3" />
                        {purity}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-6">
                <button onClick={() => toggleSection('category')} className="w-full flex items-center justify-between text-2xl font-medium mb-3">
                  <span>CATEGORY</span>
                  {accordion.category ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {accordion.category && (
                  <div className="space-y-2">
                    {subcategoryOptions.map((sub) => (
                      <label key={sub} className="flex items-center text-xl font-light">
                        <input type="checkbox" checked={selectedFilters.subcategory.includes(sub)} onChange={() => handleSubcategoryFilterChange(sub)} className="mr-2 h-3 w-3" />
                        {sub}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-6">
                <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between text-2xl font-medium  mb-3">
                  <span>DESIGN</span>
                  {accordion.design ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {accordion.design && (
                  <div className="space-y-2">
                    {designOptions.map((design) => (
                      <label key={design} className="flex items-center text-xl font-light">
                        <input type="checkbox" checked={selectedFilters.design.includes(design)} onChange={() => handleDesignFilterChange(design)} className="mr-2 h-3 w-3" />
                        {design}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <button onClick={() => toggleSection('gender')} className="w-full flex items-center justify-between text-2xl font-medium mb-3">
                  <span>GENDER</span>
                  {accordion.gender ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {accordion.gender && (
                  <div className="space-y-2">
                    {genderOptions.map((gender) => (
                      <label key={gender} className="flex items-center text-xl font-light">
                        <input type="checkbox" checked={selectedFilters.gender.includes(gender)} onChange={() => handleGenderFilterChange(gender)} className="mr-2 h-3 w-3" />
                        {gender}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="text-2xl text-gray-700 font-light">
                {totalCount === 0 ? 'No products' : `Showing ${startIndex}-${endIndex} of ${totalCount} results`}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 text-sm font-light tracking-widest">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="appearance-none bg-transparent border-none py-1 pl-0 pr-4 text-sm focus:outline-none font-light cursor-pointer">
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-200 mb-6">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-light text-gray-900 mb-3 tracking-widest">NO PRODUCTS FOUND</h3>
                <p className="text-gray-600 text-sm font-light tracking-widest">PLEASE TRY DIFFERENT FILTERS</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                  {paginatedProducts.map((product: Product) => (
                    <Link href={`/products/${category}/${product.id}`} key={product.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden bg-gray-50 aspect-square">
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        {product.isNew && (
                          <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 text-xs font-light">NEW</div>
                        )}
                        {product.isSale && (
                          <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 text-xs font-light">SALE</div>
                        )}
                      </div>
                     
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-8">
                  <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className={`px-4 py-2 text-sm border ${currentPage <= 1 ? 'text-gray-400 border-gray-200' : 'text-gray-900 border-gray-300 hover:border-gray-400'}`}>Prev</button>
                  <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
                  <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className={`px-4 py-2 text-sm border ${currentPage >= totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-900 border-gray-300 hover:border-gray-400'}`}>Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="text-lg font-light tracking-widest">FILTERS</div>
                  <button onClick={() => setShowFilters(false)} className="h-7 flex items-center justify-center">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-2">
                  <div className="mb-6">
                    <div className="text-lg font-light tracking-widest mb-3">METAL</div>
                    <div className="space-y-2">
                      {metalOptions.map((metal) => (
                        <label key={metal} className="flex items-center text-sm font-light">
                          <input type="checkbox" checked={selectedFilters.metal.includes(metal)} onChange={() => handleMetalFilterChange(metal)} className="mr-2 h-3 w-3" />
                          {metal}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-lg font-light tracking-widest mb-3">PURITY</div>
                    <div className="space-y-2">
                      {purityOptions.map((purity) => (
                        <label key={purity} className="flex items-center text-sm font-light">
                          <input type="checkbox" checked={selectedFilters.purity.includes(purity)} onChange={() => handlePurityFilterChange(purity)} className="mr-2 h-3 w-3" />
                          {purity}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-lg font-light tracking-widest mb-3">CATEGORY</div>
                    <div className="space-y-2">
                      {subcategoryOptions.map((sub) => (
                        <label key={sub} className="flex items-center text-sm font-light">
                          <input type="checkbox" checked={selectedFilters.subcategory.includes(sub)} onChange={() => handleSubcategoryFilterChange(sub)} className="mr-2 h-3 w-3" />
                          {sub}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-lg font-light tracking-widest mb-3">DESIGN</div>
                    <div className="space-y-2">
                      {designOptions.map((design) => (
                        <label key={design} className="flex items-center text-sm font-light">
                          <input type="checkbox" checked={selectedFilters.design.includes(design)} onChange={() => handleDesignFilterChange(design)} className="mr-2 h-3 w-3" />
                          {design}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-lg font-light tracking-widest mb-3">GENDER</div>
                    <div className="space-y-2">
                      {genderOptions.map((gender) => (
                        <label key={gender} className="flex items-center text-sm font-light">
                          <input type="checkbox" checked={selectedFilters.gender.includes(gender)} onChange={() => handleGenderFilterChange(gender)} className="mr-2 h-3 w-3" />
                          {gender}
                        </label>
                      ))}
                    </div>
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
