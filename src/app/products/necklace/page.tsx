"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, Grid, List, Search, Heart, ShoppingBag, X, User, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';
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

// Necklace products data
const necklaceProducts: Product[] = [
  {
    id: "2",
    name: "Emerald Cut Diamond Necklace",
    category: "necklaces",
    subcategory: "pendants",
    price: 1800,
    image: "/necklace.jpeg",
    rating: 4.9,
    reviews: 89,
    description: "Elegant emerald-cut diamond pendant on 18k gold chain",
    details: "A sophisticated pendant featuring an emerald-cut diamond suspended from a delicate 18k gold chain. Perfect for both everyday wear and special occasions.",
    inStock: true,
    metal: "White Gold",
    purity: "18K",
    caratWeight: "1.25 CTW",
    clarity: "VS1",
    color: "F",
    cut: "Emerald",
    length: "18 inches",
    width: "8mm",
    height: "2mm",
    weight: "3.2g",
    certification: "GIA",
    warranty: "Lifetime"
  },
  {
    id: "6",
    name: "Diamond Choker Necklace",
    category: "necklaces",
    subcategory: "chokers",
    price: 2800,
    originalPrice: 3500,
    image: "/necklace.jpeg",
    rating: 4.8,
    reviews: 78,
    description: "Luxurious diamond choker with adjustable length",
    details: "This sophisticated choker features a line of diamonds set in 18k white gold with an adjustable chain for the perfect fit. The design is both modern and timeless.",
    inStock: true,
    isSale: true,
    metal: "White Gold",
    purity: "18K",
    caratWeight: "2.15 CTW",
    clarity: "VS2",
    color: "G",
    cut: "Round Brilliant",
    length: "16 inches",
    width: "12mm",
    height: "3mm",
    weight: "5.8g",
    certification: "IGI",
    warranty: "Lifetime"
  },
  {
    id: "9",
    name: "Layered Diamond Necklace Set",
    category: "necklaces",
    subcategory: "layered",
    price: 2200,
    image: "/necklace.jpeg",
    rating: 4.7,
    reviews: 112,
    description: "Elegant layered necklace set with multiple diamond accents",
    details: "This stunning layered necklace set features three delicate chains with diamond accents at varying lengths. The design creates a sophisticated, multi-dimensional look.",
    inStock: true,
    isNew: true,
    metal: "Yellow Gold",
    purity: "14K",
    caratWeight: "1.85 CTW",
    clarity: "SI1",
    color: "H",
    cut: "Princess",
    length: "16-20 inches",
    width: "6mm",
    height: "2.5mm",
    weight: "4.2g",
    certification: "GIA",
    warranty: "2 Years"
  },
  {
    id: "10",
    name: "Statement Diamond Collar",
    category: "necklaces",
    subcategory: "statement",
    price: 4500,
    image: "/necklace.jpeg",
    rating: 4.9,
    reviews: 67,
    description: "Bold statement collar with dramatic diamond arrangement",
    details: "This dramatic statement collar features a bold arrangement of diamonds set in an architectural design. Perfect for making a powerful impression at special events.",
    inStock: true,
    metal: "Platinum",
    purity: "950",
    caratWeight: "3.45 CTW",
    clarity: "VVS2",
    color: "D",
    cut: "Oval",
    length: "15 inches",
    width: "15mm",
    height: "4mm",
    weight: "8.5g",
    certification: "GIA",
    warranty: "Lifetime"
  },
  {
    id: "11",
    name: "Minimalist Diamond Bar Necklace",
    category: "necklaces",
    subcategory: "minimalist",
    price: 950,
    image: "/necklace.jpeg",
    rating: 4.6,
    reviews: 145,
    description: "Clean and simple diamond bar pendant",
    details: "This minimalist design features a single diamond set in a sleek bar pendant. The clean lines and simple elegance make it perfect for everyday wear.",
    inStock: true,
    metal: "White Gold",
    purity: "14K",
    caratWeight: "0.75 CTW",
    clarity: "SI2",
    color: "I",
    cut: "Round Brilliant",
    length: "18 inches",
    width: "4mm",
    height: "1.5mm",
    weight: "2.1g",
    certification: "IGI",
    warranty: "1 Year"
  }
];

const subcategories = ["pendants", "chokers", "layered", "statement", "minimalist"];

export default function NecklacesPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
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



  const filteredProducts = necklaceProducts.filter(product => {
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
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
             <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
              Diamond Necklaces
            </h1>
             <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover our stunning collection of diamond necklaces, from delicate pendants to bold statement pieces
            </p>
          </div>
        </div>
      </div>

      

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filter Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:bg-amber-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

                 <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Filters Sidebar */}
           <AnimatePresence>
             {showFilters && (
               <motion.div 
                 className="w-full lg:w-80 space-y-4 sm:space-y-6 order-2 lg:order-1"
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
               >
                                 {/* Filter Header */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                     <button
                       onClick={() => setShowFilters(false)}
                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                     >
                       <X className="w-5 h-5 text-gray-500" />
                     </button>
                   </div>
                 </div>

            {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search necklaces..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Necklace Types */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Necklace Types</h3>
              <div className="space-y-2">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                        onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? 'all' : sub)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
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
           <div className="flex-1 order-1 lg:order-2 w-full">
            {/* Toolbar */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
               <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                 <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
                   <span className="text-xs sm:text-sm text-gray-600">
                    {sortedProducts.length} necklaces
                  </span>
                   <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                       className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        viewMode === "grid" ? "bg-amber-50 text-amber-700" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                       <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                       className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        viewMode === "list" ? "bg-amber-50 text-amber-700" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                       <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                   className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {viewMode === "grid" ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard 
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
            ) : (
              <div className="space-y-3 sm:space-y-4">
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

            {sortedProducts.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No necklaces found</h3>
                <p className="text-sm sm:text-base text-gray-600">Try adjusting your filters or search terms</p>
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

// Product Card Component
 function ProductCard({ product, onSelect, onImageModal, onAddToCart }: { product: Product; onSelect: (product: Product) => void; onImageModal: () => void; onAddToCart: (product: Product) => void }) {
  return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group h-full">
       <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
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
                 <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 opacity-0 sm:group-hover:opacity-100 transition-all duration-300 p-2">
          <button
            onClick={() => onSelect(product)}
             className="bg-white text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm w-full sm:w-auto"
          >
            Quick View
          </button>
           <button
             onClick={onImageModal}
             className="bg-amber-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm w-full sm:w-auto"
           >
             View Image
           </button>
           <button
             onClick={() => onAddToCart(product)}
             className="bg-amber-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm w-full sm:w-auto"
           >
             Add to Cart
           </button>
        </div>
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
               onClick={() => onSelect(product)}
               className="flex-1 bg-white text-gray-900 px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95 border border-gray-200"
             >
               Quick View
             </button>
             <button
               onClick={onImageModal}
               className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
             >
               View Image
             </button>
             <button
               onClick={() => onAddToCart(product)}
               className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
             >
               Add to Cart
             </button>
          </div>
           <button className="bg-amber-600 text-white p-1.5 sm:p-2 rounded-lg hover:bg-amber-700 transition-colors w-full sm:w-auto flex justify-center">
             <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Product List Card Component
function ProductListCard({ product, onSelect, onImageModal, onAddToCart }: { product: Product; onSelect: (product: Product) => void; onImageModal: () => void; onAddToCart: (product: Product) => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow group">
      <div className="flex gap-4 sm:gap-6">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.style.backgroundColor = '#f3f4f6';
            }}
          />
          {product.isNew && (
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-amber-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
              New
            </div>
          )}
                     <div className="absolute inset-0 flex items-center justify-center gap-1 sm:gap-2 opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
             <button
               onClick={() => onSelect(product)}
               className="bg-white text-gray-900 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 text-xs hover:scale-105 active:scale-95"
             >
               Quick View
             </button>
             <button
               onClick={onImageModal}
               className="bg-amber-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 text-xs hover:scale-105 active:scale-95"
             >
               View Image
             </button>
             <button
               onClick={() => onAddToCart(product)}
               className="bg-amber-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 text-xs hover:scale-105 active:scale-95"
             >
               Add to Cart
             </button>
            </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
          
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
             <div className="flex gap-2 sm:hidden">
              <button
                onClick={() => onSelect(product)}
                 className="flex-1 bg-white text-gray-900 px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95 border border-gray-200"
              >
                Quick View
              </button>
               <button
                 onClick={onImageModal}
                 className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
               >
                 View Image
               </button>
               <button
                 onClick={() => onAddToCart(product)}
                 className="flex-1 bg-amber-600 text-white px-2 py-1.5 rounded-full font-medium shadow-lg text-xs hover:scale-105 active:scale-95"
               >
                Add to Cart
              </button>
            </div>
             <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base w-full sm:w-auto flex justify-center">
               Add to Cart
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({ product, onClose, onImageModal, onAddToCart }: { product: Product; onClose: () => void; onImageModal: () => void; onAddToCart: (product: Product) => void }) {
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
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
              </div>
              
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