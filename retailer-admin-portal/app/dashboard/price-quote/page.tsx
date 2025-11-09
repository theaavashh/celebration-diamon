'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import {
  Search,
  Plus,
  Bell,
  MessageCircle,
  User,
  LogOut,
  Check,
  ChevronDown,
  Edit,
  Trash2,
  X,
  Shield,
  FileText,
  Send,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Store,
  Mail,
  Phone,
  ArrowLeft
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface QuoteRequest {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  userId?: string;
  timestamp: Date | string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  price?: number;
  // Legacy fields for compatibility
  retailerId?: string;
  retailerName?: string;
  retailerEmail?: string;
  retailerPhone?: string;
  productName?: string;
  productDescription?: string;
  specifications?: {
    productId?: string;
    category?: string;
    subCategory?: string;
    description?: string;
    goldWeight?: string;
    diamondQuantity?: string;
    diamondSize?: string;
    diamondWeight?: string;
    otherGemstones?: string;
    orderDuration?: string;
  };
  requestedDate?: string;
  quotedPrice?: number;
  quotedDate?: string;
  notes?: string;
}

export default function PriceQuotePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'quoted' | 'accepted' | 'rejected'>('all');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Quote requests from WebSocket
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([
    {
      id: '1',
      productId: '1',
      productTitle: 'Diamond Engagement Rings',
      productName: 'Diamond Engagement Rings',
      productImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      timestamp: new Date(),
      retailerId: '1',
      retailerName: 'ABC Jewelry Store',
      retailerEmail: 'abc@jewelry.com',
      retailerPhone: '+1 234-567-8900',
      productDescription: 'Classic solitaire designs featuring premium diamonds',
      specifications: {
        productId: 'CD-001',
        category: 'Ring',
        subCategory: 'Ladies/Casual',
        description: '14k/18k Ring without Stones',
        goldWeight: '4 gms approx',
        diamondQuantity: '1',
        diamondSize: '0.5 carat',
        diamondWeight: '0.5 carat',
        otherGemstones: 'None',
        orderDuration: '7 days to make'
      },
      requestedDate: '2024-12-20 10:30 AM',
      status: 'pending'
    },
    {
      id: '2',
      productId: '7',
      productTitle: 'Wedding Bands',
      productName: 'Wedding Bands',
      timestamp: new Date(),
      retailerId: '2',
      retailerName: 'Diamond World',
      retailerEmail: 'diamond@world.com',
      retailerPhone: '+1 234-567-8901',
      productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      productDescription: 'Elegant wedding ring collections',
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
      requestedDate: '2024-12-19 3:45 PM',
      status: 'quoted',
      quotedPrice: 2500,
      quotedDate: '2024-12-19 4:15 PM',
      notes: 'Price includes all specifications as requested.'
    },
    {
      id: '3',
      productId: '1',
      productTitle: 'Diamond Engagement Rings',
      productName: 'Diamond Engagement Rings',
      timestamp: new Date(),
      retailerId: '5',
      retailerName: 'Royal Gems',
      retailerEmail: 'royal@gems.com',
      retailerPhone: '+1 234-567-8904',
      productImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      productDescription: 'Classic solitaire designs featuring premium diamonds',
      specifications: {
        productId: 'CD-001',
        category: 'Ring',
        subCategory: 'Ladies/Casual',
        description: '14k/18k Ring without Stones',
        goldWeight: '4 gms approx',
        diamondQuantity: '1',
        diamondSize: '1 carat',
        diamondWeight: '1 carat',
        otherGemstones: 'None',
        orderDuration: '7 days to make'
      },
      requestedDate: '2024-12-18 2:20 PM',
      status: 'pending'
    },
    {
      id: '4',
      productId: '5',
      productTitle: 'Featured Collection',
      productName: 'Featured Collection',
      timestamp: new Date(),
      retailerId: '1',
      retailerName: 'ABC Jewelry Store',
      retailerEmail: 'abc@jewelry.com',
      retailerPhone: '+1 234-567-8900',
      productImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      productDescription: 'Best-selling diamond jewelry pieces',
      specifications: {
        productId: 'CD-005',
        category: 'Necklace',
        subCategory: 'Diamond',
        description: 'Diamond Necklace Collection',
        goldWeight: '8 gms',
        diamondQuantity: '15',
        diamondSize: '0.1 carat each',
        diamondWeight: '1.5 carat total',
        otherGemstones: 'None',
        orderDuration: '14 days to make'
      },
      requestedDate: '2024-12-17 11:15 AM',
      status: 'accepted',
      quotedPrice: 3500,
      quotedDate: '2024-12-17 2:30 PM',
      notes: 'Bulk order discount applied.'
    }
  ]);

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
  }, [router]);

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

  // Setup WebSocket connection
  useEffect(() => {
    if (!admin) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socketConnection = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    socketConnection.on('connect', () => {
      console.log('WebSocket connected as admin');
      socketConnection.emit('admin:connect');
    });

    socketConnection.on('admin:quotes', (quotes: QuoteRequest[]) => {
      console.log('Received quotes:', quotes);
      // Convert WebSocket quotes to our format
      const formattedQuotes = quotes.map(quote => ({
        ...quote,
        productName: quote.productTitle || quote.productName,
        requestedDate: quote.timestamp ? new Date(quote.timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : quote.requestedDate
      }));
      setQuoteRequests(formattedQuotes);
    });

    socketConnection.on('admin:new-quote', (quote: QuoteRequest) => {
      console.log('New quote received:', quote);
      const formattedQuote = {
        ...quote,
        productName: quote.productTitle || quote.productName,
        requestedDate: quote.timestamp ? new Date(quote.timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : quote.requestedDate
      };
      setQuoteRequests(prev => [formattedQuote, ...prev]);
      toast.success('New quote request received!');
    });

    socketConnection.on('admin:quote-updated', (quote: QuoteRequest) => {
      console.log('Quote updated:', quote);
      setQuoteRequests(prev => prev.map(q => q.id === quote.id ? {
        ...q,
        ...quote,
        productName: quote.productTitle || quote.productName
      } : q));
    });

    socketConnection.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [admin]);

  const filteredQuotes = quoteRequests.filter(quote => {
    const productName = quote.productName || quote.productTitle || '';
    const retailerName = quote.retailerName || '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.productId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('rememberMe');
    router.push('/');
  };

  const handleSendQuote = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setQuotePrice('');
    setQuoteNotes('');
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = () => {
    if (!selectedQuote || !quotePrice) {
      toast.error('Please enter a price');
      return;
    }

    const price = parseFloat(quotePrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!socket) {
      toast.error('WebSocket connection not available');
      return;
    }

    // Send price via WebSocket
    socket.emit('admin:set-price', {
      quoteId: selectedQuote.id,
      price: price
    });

    // Update quote status locally
    setQuoteRequests(quoteRequests.map(quote => {
      if (quote.id === selectedQuote.id) {
        return {
          ...quote,
          status: 'quoted' as const,
          price: price,
          quotedPrice: price,
          quotedDate: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          notes: quoteNotes
        };
      }
      return quote;
    }));

    toast.success('Quote sent successfully!');
    setShowQuoteModal(false);
    setSelectedQuote(null);
    setQuotePrice('');
    setQuoteNotes('');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      quoted: { color: 'bg-blue-100 text-blue-800', icon: FileText },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: X },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: quoteRequests.length,
    pending: quoteRequests.filter(q => q.status === 'pending').length,
    quoted: quoteRequests.filter(q => q.status === 'quoted').length,
    accepted: quoteRequests.filter(q => q.status === 'accepted').length,
  };

  if (!admin) {
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
        className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 space-y-6"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col space-y-2 flex-1 px-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Price Quote</span>
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Store className="w-5 h-5" />
            <span className="font-medium">Retailer Management</span>
          </button>
        </div>

        <div className="px-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors w-full"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Admin Portal</span>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search quote requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-gray-300 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 relative" ref={profileRef}>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
            >
              <span className="text-gray-700 font-medium text-sm">
                {(admin.fullname || admin.username || admin.email)[0].toUpperCase()}
              </span>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase">Currently in</p>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {(admin.fullname || admin.username || admin.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {admin.fullname || admin.username || 'Admin'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">Administrator</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <p className="text-sm text-gray-600 truncate">{admin.email}</p>
                          <Check className="w-4 h-4 text-black flex-shrink-0" />
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>

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
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Quoted</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.quoted}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quote Requests Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quote Requests</h2>
                <p className="text-sm text-gray-600 mt-1">Manage price quote requests from retailers</p>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quoted Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => (
                    <motion.tr
                      key={quote.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={quote.productImage}
                            alt={quote.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{quote.productName}</div>
                            <div className="text-xs text-gray-500">ID: {quote.specifications?.productId || quote.productId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{quote.retailerName}</div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{quote.retailerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(quote.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {quote.requestedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.quotedPrice ? `$${quote.quotedPrice.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {quote.status === 'pending' && (
                            <button
                              onClick={() => handleSendQuote(quote)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Send Quote</span>
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowQuoteModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No quote requests found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <AnimatePresence>
        {showQuoteModal && selectedQuote && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuoteModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedQuote.status === 'pending' ? 'Send Price Quote' : 'Quote Details'}
                  </h2>
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedQuote.productImage}
                      alt={selectedQuote.productName}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedQuote.productName}</h3>
                    <p className="text-gray-600 mb-4">{selectedQuote.productDescription}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedQuote.retailerName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedQuote.retailerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedQuote.retailerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedQuote.specifications && Object.entries(selectedQuote.specifications).map(([key, value]) => (
                        value && (
                          <div key={key}>
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm text-gray-900">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote Form */}
                {selectedQuote.status === 'pending' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={quotePrice}
                          onChange={(e) => setQuotePrice(e.target.value)}
                          placeholder="Enter price"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        placeholder="Add any additional notes or comments..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-black"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Quoted Price</span>
                        <span className="text-2xl font-bold text-blue-600">${selectedQuote.quotedPrice?.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-600">Quoted on: {selectedQuote.quotedDate}</p>
                    </div>
                    {selectedQuote.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedQuote.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  {selectedQuote.status === 'pending' ? 'Cancel' : 'Close'}
                </button>
                {selectedQuote.status === 'pending' && (
                  <button
                    onClick={handleSubmitQuote}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Quote</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}


