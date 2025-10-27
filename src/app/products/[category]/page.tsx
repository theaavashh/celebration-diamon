"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, Grid, List, Search, Heart, ShoppingBag, X, User, MapPin, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

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

const categoryTitles: { [key: string]: string } = {
  necklace: 'Diamond Necklaces',
  bracelet: 'Diamond Bracelets',
  earrings: 'Diamond Earrings',
  ring: 'Diamond Rings',
  rings: 'Diamond Rings',
  pendant: 'Diamond Pendants',
};

const categoryMapping: { [key: string]: string } = {
  rings: 'Ring',
  necklaces: 'Necklace',
  bracelets: 'Bracelet',
  earrings: 'Earring',
  pendants: 'Pendant',
  ring: 'Ring',
  necklace: 'Necklace',
  bracelet: 'Bracelet',
  earring: 'Earring',
  pendant: 'Pendant',
};

const categoryDescriptions: { [key: string]: string } = {
  necklace: 'Discover our stunning collection of diamond necklaces, from delicate pendants to bold statement pieces',
  bracelet: 'Explore our exquisite collection of diamond bracelets, featuring elegant and timeless designs',
  earrings: 'Browse our beautiful collection of diamond earrings, from classic studs to dramatic chandeliers',
  rings: 'Find the perfect diamond ring in our curated collection of elegant and sophisticated designs',
  pendant: 'Discover our collection of stunning diamond pendants, perfect for adding elegance to any outfit',
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const displayName = categoryTitles[category] || `${category.charAt(0).toUpperCase() + category.slice(1)}`;
  const displayDescription = categoryDescriptions[category] || `Browse our collection of ${displayName.toLowerCase()}`;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartStep, setCartStep] = useState<'service' | 'details'>('service');
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Map frontend category to API category
        const apiCategory = categoryMapping[category] || category;
        const response = await fetch(`http://localhost:5000/api/products?category=${apiCategory}`);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success && data.data) {
          console.log('Products fetched:', data.data);
          // Map API data to local Product interface
          const mappedProducts = data.data.map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.category.toLowerCase(),
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.imageUrl?.startsWith('http') 
              ? product.imageUrl 
              : product.imageUrl 
                ? `http://localhost:5000${product.imageUrl}` 
                : `/${category}.jpeg`,
            rating: 4.5,
            reviews: 0,
            description: product.description,
            details: product.description,
            inStock: product.stock > 0,
            isNew: product.isNew || false,
            isSale: product.isSale || false,
            metal: 'Gold',
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
          console.log('Mapped products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.log('No products found in API response:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
    console.log('Service:', selectedService);
    console.log('Product:', selectedProduct);
    console.log('Personal Details:', personalDetails);
    
    setShowCartModal(false);
    alert('Thank you! We will contact you soon to arrange your appointment.');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
       {/* Fixed Header */}
       <div className="relative top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm mt-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
           <div className="flex items-center gap-4 mb-4">
            <Link href="/products" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
               <span className="text-sm sm:text-base">Back to Collections</span>
            </Link>
          </div>
           <div className="text-center space-y-2 sm:space-y-3">
             <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black jimthompson">
              {displayName}
            </h1>
             <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
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

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div 
                className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  setShowImageModal(true);
                }}
              >
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
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 jimthompson">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/products/${category}/${product.id}`}
                    className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-center flex items-center justify-center gap-2"
                  >
                    Explore Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 jimthompson">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-[10000] text-white hover:text-gray-200 transition-all duration-200 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm"
                style={{ zIndex: 10000 }}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-[90vh] flex items-center justify-center">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Product Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                <h2 className="text-3xl font-bold text-white mb-2 jimthompson">{selectedProduct.name}</h2>
                <p className="text-white/80 mb-4">{selectedProduct.description}</p>
                <div className="flex items-center gap-4">
                  <Link 
                    href={`/products/${category}/${selectedProduct.id}`}
                    onClick={() => setShowImageModal(false)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                  >
                    Explore Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
