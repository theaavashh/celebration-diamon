'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { 
  FaArrowLeft, 
  FaHeart, 
  FaShoppingCart,
  FaGem,
  FaWeight,
  FaRuler,
  FaPalette,
  FaCertificate,
  FaCheckCircle,
  FaStar,
  FaFingerprint,
  FaMobile,
  FaTimes,
  FaCheck,
  FaSearch
} from 'react-icons/fa';
import {
  Home,
  Grid3x3,
  Plus,
  Bell,
  MessageCircle,
  User,
  Box,
  Check,
  ChevronDown,
  LogOut
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface JewelryDetails {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  price?: string;
  specifications?: {
    productId?: string;
    category?: string;
    subCategory?: string;
    description?: string;
    goldWeight?: string;
    diamondQuantity?: string;
    diamondSize?: string;
    diamondWeight?: string;
    diamondQuality?: string;
    otherGemstones?: string;
    orderDuration?: string;
  };
  features?: string[];
  rating?: number;
  reviews?: number;
}

// Hardcoded jewelry details data
const jewelryDatabase: { [key: string]: JewelryDetails } = {
  '1': {
    id: '1',
    title: 'Diamond Engagement Rings',
    description: 'Classic solitaire designs featuring premium diamonds in elegant settings. Perfect for expressing your eternal love and commitment.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
    type: 'product',
    specifications: {
      productId: 'CD-001',
      category: 'Ring',
      subCategory: 'Ladies/Casual',
      description: '14k/18k Ring without Stones',
      goldWeight: '4 gms approx',
      diamondQuantity: '',
      diamondSize: '',
      diamondWeight: 'None',
      otherGemstones: 'None',
      orderDuration: '7 days to make'
    },
    rating: 4.8,
    reviews: 124
  },
  '2': {
    id: '2',
    title: 'Recent Orders',
    description: 'Track your latest customer orders and shipments',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
    type: 'order'
  },
  '3': {
    id: '3',
    title: 'Sales Analytics Dashboard',
    description: 'Monthly performance metrics and revenue trends',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    type: 'analytics'
  },
  '4': {
    id: '4',
    title: 'Product Categories',
    description: 'Manage your inventory',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200',
    type: 'category'
  },
  '5': {
    id: '5',
    title: 'Featured Collection',
    description: 'Best-selling diamond jewelry pieces',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200',
    type: 'product',
    price: '$1,800 - $12,000'
  },
  '6': {
    id: '6',
    title: 'Customer Reviews',
    description: 'See what customers are saying about our products',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    type: 'order'
  },
  '7': {
    id: '7',
    title: 'Wedding Bands',
    description: 'Elegant wedding ring collections crafted with precision and love. Symbolize your union with timeless designs.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200',
    type: 'product',
    specifications: {
      productId: 'CD-007',
      category: 'Ring',
      subCategory: 'Wedding',
      description: 'Platinum Wedding Bands',
      goldWeight: '3g - 8g',
      diamondQuantity: '',
      diamondSize: '',
      diamondWeight: 'None',
      otherGemstones: 'None',
      orderDuration: '10 days to make'
    },
    rating: 4.7,
    reviews: 89
  },
  '8': {
    id: '8',
    title: 'Inventory Management',
    description: 'Stock levels and warehouse management',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    type: 'category'
  },
  '9': {
    id: '9',
    title: 'Revenue Reports',
    description: 'Detailed financial reports and analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    type: 'analytics'
  },
  '10': {
    id: '10',
    title: 'New Arrivals',
    description: 'Latest products added to catalog',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
    type: 'product'
  },
  '11': {
    id: '11',
    title: 'Order Processing',
    description: 'Manage and process customer orders efficiently',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
    type: 'order'
  },
  '12': {
    id: '12',
    title: 'Customer Analytics',
    description: 'Customer behavior and engagement metrics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    type: 'analytics'
  }
};

export default function JewelryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<JewelryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'otp' | null>(null);
  const [otp, setOtp] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [quotePrice, setQuotePrice] = useState<{
    quoteId: string;
    productId: string;
    productTitle: string;
    productImage: string;
    price: number;
    timestamp: Date;
  } | null>(null);
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);
  
  // Create multiple images for thumbnail gallery (using the same image for demo)
  const productImages = item ? [
    item.image,
    item.image,
    item.image,
    item.image,
  ] : [];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');

    if (!token || !adminData) {
      router.push('/');
      return;
    }

    try {
      setAdmin(JSON.parse(adminData));
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.push('/');
    }

    const itemId = params.id as string;
    const jewelryItem = jewelryDatabase[itemId];
    
    if (jewelryItem) {
      setItem(jewelryItem);
    } else {
      toast.error('Item not found');
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, [params.id, router]);

  // Setup WebSocket connection
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socketConnection = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    socketConnection.on('connect', () => {
      console.log('WebSocket connected');
      const adminData = localStorage.getItem('admin');
      const userId = adminData ? JSON.parse(adminData).id || socketConnection.id : socketConnection.id;
      socketConnection.emit('client:connect', { userId });
    });

    socketConnection.on('client:quote-requested', (data: { success: boolean; quoteId: string; message: string }) => {
      console.log('Quote requested:', data);
      setIsRequestingQuote(false);
      toast.success(data.message || 'Quote request submitted successfully!');
      setShowQuoteModal(false);
    });

    socketConnection.on('client:quote-received', (data: {
      quoteId: string;
      productId: string;
      productTitle: string;
      productImage: string;
      price: number;
      timestamp: Date;
    }) => {
      console.log('Quote received:', data);
      setQuotePrice(data);
      setShowPriceModal(true);
    });

    socketConnection.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleRequestQuote = () => {
    if (!item || !socket) {
      toast.error('Unable to connect. Please try again.');
      return;
    }

    setShowQuoteModal(true);
    setIsRequestingQuote(true);

    // Send quote request via WebSocket
    socket.emit('client:request-quote', {
      productId: item.id,
      productTitle: item.title,
      productImage: item.image,
      userId: admin?.id || socket.id
    });
  };

  const handleFingerprintAuth = async () => {
    setIsAuthenticating(true);
    setAuthMethod('fingerprint');
    
    // Simulate fingerprint scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAuthenticating(false);
    setIsAuthenticated(true);
    toast.success('Fingerprint verified successfully!');
    
    // Auto-submit after authentication
    setTimeout(() => {
      submitQuoteRequest();
    }, 500);
  };

  const handleOTPAuth = () => {
    setAuthMethod('otp');
    setIsAuthenticated(false);
    setOtp('');
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsAuthenticating(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsAuthenticating(false);
    setIsAuthenticated(true);
    toast.success('OTP verified successfully!');
    
    // Auto-submit after authentication
    setTimeout(() => {
      submitQuoteRequest();
    }, 500);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('rememberMe');
    router.push('/');
  };

  if (isLoading || !item || !admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Box className="text-white w-5 h-5" />
        </div>

        <div className="flex flex-col space-y-6 flex-1">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <User className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pinterest-style Header */}
        <motion.header 
          className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Retailer Portal</span>
          </div>

          {/* Search Bar (Pinterest-style) */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-gray-300 transition-all"
              />
            </div>
          </div>
          
          {/* Profile */}
          <div className="flex items-center space-x-3 relative" ref={profileRef}>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
            >
              <span className="text-gray-700 font-medium text-sm">
                {(admin.fullname || admin.username || admin.email)[0].toUpperCase()}
              </span>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Currently in Section */}
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase">Currently in</p>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {(admin.fullname || admin.username || admin.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-base truncate">
                            {admin.fullname || admin.username || 'User'}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">Personal</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <p className="text-sm text-gray-600 truncate">{admin.email}</p>
                          <Check className="w-4 h-4 text-black flex-shrink-0" />
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-2">
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Change Password
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Back Button */}
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ x: -5 }}
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </motion.button>

            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-8"
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                ref={imageRef}
                className="bg-white rounded-2xl overflow-hidden shadow-lg relative group cursor-crosshair aspect-square"
                onMouseEnter={() => setZoomVisible(true)}
                onMouseLeave={() => setZoomVisible(false)}
                onMouseMove={(e) => {
                  if (!imageRef.current) return;
                  const rect = imageRef.current.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
              >
                <img
                  src={productImages[selectedImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Strip */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} view ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Details Section / Zoom Preview - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Zoom Preview - Shows when hovering over image */}
            {zoomVisible ? (
              <motion.div
                className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square sticky top-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${productImages[selectedImageIndex]})`,
                    backgroundSize: '200%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </motion.div>
            ) : (
              <>
                {/* Title and Rating */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  {item.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(item.rating!) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {item.rating} ({item.reviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Specifications */}
            {item.specifications && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.specifications.productId && (
                      <div className="flex items-start space-x-3">
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Product ID</p>
                          <p className="text-gray-600">{item.specifications.productId}</p>
                        </div>
                      </div>
                    )}
                    {item.specifications.category && (
                      <div className="flex items-start space-x-3">
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Category</p>
                          <p className="text-gray-600">{item.specifications.category}</p>
                        </div>
                      </div>
                    )}
                    {item.specifications.subCategory && (
                      <div className="flex items-start space-x-3">
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Sub Category</p>
                          <p className="text-gray-600">{item.specifications.subCategory}</p>
                        </div>
                      </div>
                    )}
                    {item.specifications.description && (
                      <div className="flex items-start space-x-3">
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Description</p>
                          <p className="text-gray-600">{item.specifications.description}</p>
                        </div>
                      </div>
                    )}
                    {item.specifications.goldWeight && (
                      <div className="flex items-start space-x-3">
                        <FaWeight className="text-blue-600 mt-1 flex-shrink-0" />
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Gold weight</p>
                          <p className="text-gray-600">{item.specifications.goldWeight}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <FaGem className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="w-full">
                        <p className="font-medium text-gray-900">Diamond quantity</p>
                        <p className="text-gray-600">{item.specifications.diamondQuantity || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FaRuler className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="w-full">
                        <p className="font-medium text-gray-900">Diamond size</p>
                        <p className="text-gray-600">{item.specifications.diamondSize || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FaWeight className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="w-full">
                        <p className="font-medium text-gray-900">Diamond weight</p>
                        <p className="text-gray-600">{item.specifications.diamondWeight || 'None'}</p>
                      </div>
                    </div>
                    {item.specifications.diamondQuality && (
                      <div className="flex items-start space-x-3">
                        <FaCertificate className="text-blue-600 mt-1 flex-shrink-0" />
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Diamond quality</p>
                          <p className="text-gray-600">{item.specifications.diamondQuality}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <FaGem className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="w-full">
                        <p className="font-medium text-gray-900">Other Gemstones</p>
                        <p className="text-gray-600">{item.specifications.otherGemstones || 'None'}</p>
                      </div>
                    </div>
                    {item.specifications.orderDuration && (
                      <div className="flex items-start space-x-3">
                        <div className="w-full">
                          <p className="font-medium text-gray-900">Order Duration</p>
                          <p className="text-gray-600">{item.specifications.orderDuration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    onClick={handleRequestQuote}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaShoppingCart />
                    <span>Request Quote</span>
                  </motion.button>
                  <motion.button
                    className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
            </div>

            {/* Recommendations Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.values(jewelryDatabase)
                  .filter(product => product.id !== item?.id && product.type === 'product')
                  .slice(0, 10)
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                      whileHover={{ y: -5 }}
                      onClick={() => router.push(`/dashboard/item/${product.id}`)}
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                          {product.title}
                        </h3>
                        {product.rating && (
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isAuthenticating && setShowQuoteModal(false)}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request Quote</h2>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Quote Request Confirmation */}
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {isRequestingQuote ? (
                <>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Requesting Quote</h3>
                  <p className="text-gray-600">Submitting your quote request...</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-green-600 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quote Requested</h3>
                  <p className="text-gray-600">Your quote request has been submitted. We will notify you when the price is available.</p>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Price Received Modal */}
      <AnimatePresence>
        {showPriceModal && quotePrice && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPriceModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quote Received</h2>
                <button
                  onClick={() => setShowPriceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={quotePrice.productImage}
                    alt={quotePrice.productTitle}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{quotePrice.productTitle}</h3>
                    <p className="text-sm text-gray-600">Product ID: {quotePrice.productId}</p>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Quote Price</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${quotePrice.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setShowPriceModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    toast.success('Order placed successfully!');
                    setShowPriceModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Accept & Order
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}

