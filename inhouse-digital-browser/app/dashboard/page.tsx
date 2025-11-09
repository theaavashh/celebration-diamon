'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSearch,
  FaHeart,
  FaStore,
  FaGem,
  FaDollarSign,
  FaStar,
  FaCircle
} from 'react-icons/fa';
import { GiDiamondRing, GiPearlNecklace, GiDropEarrings } from 'react-icons/gi';
import {
  Home,
  Grid3x3,
  Plus,
  Bell,
  MessageCircle,
  User,
  Box,
  Package,
  ShoppingCart,
  BarChart3,
  Tag,
  Gem,
  Sparkles,
  Check,
  ChevronDown,
  LogOut,
  X,
  FolderPlus,
  Edit,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'rings' | 'necklace' | 'bracelet' | 'earings' | 'pendant';
  stats?: {
    value: string;
    label: string;
  };
}

interface Board {
  id: string;
  name: string;
  items: string[];
  type: 'personal' | 'customer';
  customerName?: string;
  customerContact?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DashboardCard | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showBoardsView, setShowBoardsView] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editBoardName, setEditBoardName] = useState('');
  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null);
  const [boardType, setBoardType] = useState<'personal' | 'customer' | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [showBoardTypeSelection, setShowBoardTypeSelection] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!mounted) return;

    // Ensure loading animation shows for at least 1000ms
    const minLoadTime = 1000;
    const startTime = Date.now();

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');

    const loadData = () => {
      if (!token || !adminData) {
        // If not authenticated, set a default admin object to allow viewing
        // You can modify this to show a login prompt or redirect if needed
        setAdmin({ fullname: 'Guest', username: 'guest', email: 'guest@example.com' });
      } else {
        try {
          setAdmin(JSON.parse(adminData));
        } catch (error) {
          console.error('Error parsing admin data:', error);
          // Set default admin on error instead of redirecting
          setAdmin({ fullname: 'Guest', username: 'guest', email: 'guest@example.com' });
        }
      }

      // Load boards from localStorage
      const savedBoards = localStorage.getItem('boards');
      if (savedBoards) {
        try {
          setBoards(JSON.parse(savedBoards));
        } catch (error) {
          console.error('Error parsing boards:', error);
        }
      } else {
        // Create default board
        const defaultBoard: Board = {
          id: 'default',
          name: 'All Pins',
          items: [],
          type: 'personal'
        };
        setBoards([defaultBoard]);
        localStorage.setItem('boards', JSON.stringify([defaultBoard]));
      }

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    loadData();
  }, [router, mounted]);

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

  // Pinterest-style cards - aspect ratios will be randomly assigned
  const dashboardCards: DashboardCard[] = [
    {
      id: '1',
      title: 'Diamond Engagement Rings',
      description: 'Classic solitaire designs',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      type: 'rings',
      stats: { value: '24', label: 'New Items' }
    },
    {
      id: '2',
      title: 'Pearl Necklace Collection',
      description: 'Elegant pearl necklaces for special occasions',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      type: 'necklace',
      stats: { value: '12', label: 'Available' }
    },
    {
      id: '3',
      title: 'Gold Bracelet Set',
      description: 'Premium gold bracelets with intricate designs',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      type: 'bracelet',
      stats: { value: '18', label: 'In Stock' }
    },
    {
      id: '4',
      title: 'Diamond Earrings',
      description: 'Stunning diamond earrings in various styles',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      type: 'earings',
      stats: { value: '30', label: 'New Arrivals' }
    },
    {
      id: '5',
      title: 'Heart Pendant Necklace',
      description: 'Romantic heart-shaped pendants',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
      type: 'pendant',
      stats: { value: '15', label: 'Featured' }
    },
    {
      id: '6',
      title: 'Platinum Wedding Rings',
      description: 'Classic platinum wedding bands',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      type: 'rings',
      stats: { value: '4.8', label: 'Rating' }
    },
    {
      id: '7',
      title: 'Choker Necklace',
      description: 'Modern choker necklaces with diamonds',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
      type: 'necklace',
    },
    {
      id: '8',
      title: 'Bangle Bracelets',
      description: 'Traditional bangle bracelets',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600',
      type: 'bracelet',
    },
    {
      id: '9',
      title: 'Stud Earrings',
      description: 'Classic diamond stud earrings',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      type: 'earings',
    },
    {
      id: '10',
      title: 'Cross Pendant',
      description: 'Elegant cross pendant designs',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      type: 'pendant',
    },
    {
      id: '11',
      title: 'Vintage Rings',
      description: 'Antique and vintage ring collection',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
      type: 'rings',
    },
    {
      id: '12',
      title: 'Layered Necklace',
      description: 'Trendy layered necklace sets',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      type: 'necklace',
    },
  ];

  const filteredCards = dashboardCards.filter(card => {
    // If a board is selected, show only items from that board
    if (selectedBoardId) {
      const selectedBoard = boards.find(b => b.id === selectedBoardId);
      if (!selectedBoard || !selectedBoard.items.includes(card.id)) {
        return false;
      }
    }
    
    if (activeTab !== 'all' && card.type !== activeTab) return false;
    if (searchQuery) {
      return card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             card.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('rememberMe');
    router.push('/');
  };

  const handleSaveClick = (e: React.MouseEvent, card: DashboardCard) => {
    e.stopPropagation(); // Prevent card click navigation
    setSelectedCard(card);
    // Reload boards from localStorage to ensure we have latest data
    const savedBoards = localStorage.getItem('boards');
    if (savedBoards) {
      try {
        setBoards(JSON.parse(savedBoards));
      } catch (error) {
        console.error('Error parsing boards:', error);
      }
    }
    setShowBoardTypeSelection(false);
    setShowSaveModal(true);
    setShowCreateBoard(false);
    setNewBoardName('');
    setBoardType(null);
    setCustomerName('');
    setCustomerContact('');
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim() && boardType) {
      const newBoard: Board = {
        id: Date.now().toString(),
        name: newBoardName.trim(),
        items: [],
        type: boardType,
        ...(boardType === 'customer' && {
          customerName: customerName.trim(),
          customerContact: customerContact.trim()
        })
      };
      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      setNewBoardName('');
      setShowCreateBoard(false);
      setBoardType(null);
      setCustomerName('');
      setCustomerContact('');
      setShowBoardTypeSelection(false);
    }
  };

  const handleSaveToBoard = (boardId: string) => {
    if (!selectedCard) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        // Only add if not already in the board
        if (!board.items.includes(selectedCard.id)) {
          const newItems = [...board.items, selectedCard.id];
          return { ...board, items: newItems };
        }
      }
      return board;
    });
    
    // Update state and localStorage
    setBoards(updatedBoards);
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
    
    // Show success toast
    toast.success('Saved to board!');
    
    // Close modal after a short delay
    setTimeout(() => {
      setShowSaveModal(false);
      setSelectedCard(null);
      setShowBoardTypeSelection(false);
      setBoardType(null);
      setCustomerName('');
      setCustomerContact('');
    }, 500);
  };

  const handleBoardTypeSelect = (type: 'personal' | 'customer') => {
    setBoardType(type);
    setShowBoardTypeSelection(false);
    setShowCreateBoard(true);
  };

  const handleCreateBoardClick = () => {
    setShowBoardTypeSelection(true);
    setShowCreateBoard(false);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setSelectedCard(null);
    setShowBoardTypeSelection(false);
    setBoardType(null);
    setCustomerName('');
    setCustomerContact('');
    setShowCreateBoard(false);
    setNewBoardName('');
  };

  const handleCancelCreateBoard = () => {
    setShowBoardTypeSelection(false);
    setShowCreateBoard(false);
    setBoardType(null);
    setNewBoardName('');
    setCustomerName('');
    setCustomerContact('');
  };

  const isCardSaved = (cardId: string, boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    return board?.items.includes(cardId) || false;
  };

  const handleEditBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setEditingBoardId(boardId);
      setEditBoardName(board.name);
    }
  };

  const handleSaveEdit = () => {
    if (editingBoardId && editBoardName.trim()) {
      const updatedBoards = boards.map(board => {
        if (board.id === editingBoardId) {
          return { ...board, name: editBoardName.trim() };
        }
        return board;
      });
      setBoards(updatedBoards);
      localStorage.setItem('boards', JSON.stringify(updatedBoards));
      setEditingBoardId(null);
      setEditBoardName('');
      toast.success('Board updated!');
    }
  };

  const handleCancelEdit = () => {
    setEditingBoardId(null);
    setEditBoardName('');
  };

  const handleDeleteBoard = (boardId: string) => {
    setDeletingBoardId(boardId);
  };

  const confirmDeleteBoard = () => {
    if (!deletingBoardId) return;
    
    const updatedBoards = boards.filter(board => board.id !== deletingBoardId);
    setBoards(updatedBoards);
    localStorage.setItem('boards', JSON.stringify(updatedBoards));
    
    // If deleted board was selected, clear selection
    if (selectedBoardId === deletingBoardId) {
      setSelectedBoardId(null);
    }
    
    toast.success('Board deleted!');
    setDeletingBoardId(null);
  };

  const cancelDeleteBoard = () => {
    setDeletingBoardId(null);
  };

  // Show loading screen immediately - before any content renders
  if (!mounted || isLoading || !admin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 fixed inset-0 z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
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
            onClick={() => {
              setShowBoardsView(false);
              setSelectedBoardId(null);
            }}
            className={`p-3 rounded-lg transition-colors ${
              !showBoardsView && !selectedBoardId
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setShowBoardsView(true);
              setSelectedBoardId(null);
            }}
            className={`p-3 rounded-lg transition-colors ${
              showBoardsView && !selectedBoardId
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
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

        {/* Pinterest-style Tabs */}
        <div className="px-4">
          <div className="flex space-x-1">
            {[
              { id: 'all', label: 'All Jewellery', icon: FaStore },
              { id: 'necklace', label: 'Necklace', icon: GiPearlNecklace },
              { id: 'bracelet', label: 'Bracelet', icon: FaDollarSign },
              { id: 'earings', label: 'Earrings', icon: GiDropEarrings },
              { id: 'rings', label: 'Rings', icon: GiDiamondRing },
              { id: 'pendant', label: 'Pendant', icon: FaGem },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 transition-colors ${
                  activeTab === tab.id
                    ? 'text-black font-semibold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-lg font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pinterest-style Masonry Grid or Boards View */}
        <div className="flex-1 overflow-y-auto p-6">
          {showBoardsView ? (
            /* Boards View */
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Your Boards</h1>
                {selectedBoardId && (
                  <button
                    onClick={() => {
                      setSelectedBoardId(null);
                      setShowBoardsView(true);
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Back to Boards</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {boards.map((board) => {
                  const boardItems = dashboardCards.filter(card => board.items.includes(card.id));
                  
                  return (
                    <motion.div
                      key={board.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group relative flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (!editingBoardId) {
                          setSelectedBoardId(board.id);
                          setShowBoardsView(false);
                          setActiveTab('all');
                        }
                      }}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {/* Edit/Delete Buttons - Show on hover */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBoard(board.id);
                            }}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBoard(board.id);
                            }}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>

                        {/* Board Cover - Show first 4 items in a grid */}
                        {boardItems.length > 0 ? (
                          <div className="grid grid-cols-2 h-full">
                            {boardItems.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {boardItems.length < 4 && (
                              <div className="col-span-2 bg-gray-200 flex items-center justify-center">
                                <Tag className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Tag className="w-16 h-16 text-gray-300" />
                          </div>
                        )}
                      </div>
                      
                      {/* Text Container - Below Image */}
                      <div className="p-4 bg-white">
                        {editingBoardId === board.id ? (
                          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editBoardName}
                              onChange={(e) => setEditBoardName(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-200 text-lg font-bold text-black"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveEdit();
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveEdit();
                                }}
                                className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelEdit();
                                }}
                                className="px-3 py-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{board.name}</h3>
                            <p className="text-sm text-gray-600">{boardItems.length} {boardItems.length === 1 ? 'pin' : 'pins'}</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Empty State */}
              {boards.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No boards yet. Save items to create boards!</p>
                </div>
              )}
            </div>
          ) : (
            /* Main Dashboard Cards */
            <>
              {selectedBoardId && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setSelectedBoardId(null);
                      setShowBoardsView(true);
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                  >
                    <X className="w-4 h-4" />
                    <span>Back to Boards</span>
                  </button>
                  {(() => {
                    const selectedBoard = boards.find(b => b.id === selectedBoardId);
                    return selectedBoard && (
                      <h1 className="text-3xl font-bold text-gray-900">{selectedBoard.name}</h1>
                    );
                  })()}
                </div>
              )}
              <div 
                className="columns-2 md:columns-3 lg:columns-4 gap-4"
                style={{ columnGap: '1rem' }}
              >
                {filteredCards.map((card, index) => {
                  // Assign consistent aspect ratio based on card ID (deterministic random)
                  const aspectRatios = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-square', 'aspect-[16/9]', 'aspect-[9/16]', 'aspect-[5/4]', 'aspect-[4/5]'];
                  const cardIndex = parseInt(card.id) || index;
                  const randomAspectRatio = aspectRatios[cardIndex % aspectRatios.length];
                  
                      return (
                        <div className="mb-4 break-inside-avoid">
                          <motion.div
                            key={card.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer group mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => router.push(`/dashboard/item/${card.id}`)}
                          >
                            {/* Image Container with natural/random aspect ratio */}
                            <div className={`relative w-full overflow-hidden ${randomAspectRatio}`}>
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              
                              {/* Pinterest-style Save Button (shown on hover) */}
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <button
                                  onClick={(e) => handleSaveClick(e, card)}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full text-sm shadow-lg transition-colors"
                                >
                                  Save
                                </button>
                              </div>
                              
                              {/* Favorite Icon */}
                              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                  <FaHeart className="text-gray-400 hover:text-red-500 transition-colors" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Text Content - Separate div below image */}
                          <div className="px-2">
                            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{card.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">
                              {card.description.length > 30 ? card.description.substring(0, 30) + '...' : card.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                {card.type}
                              </span>
                             
                            </div>
                          </div>
                        </div>
                      );
                })}
              </div>

              {filteredCards.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items found matching your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Save to Board Modal */}
      <AnimatePresence>
        {showSaveModal && selectedCard && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseSaveModal}
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
                <h2 className="text-2xl font-bold text-gray-900">Save to board</h2>
                <button
                  onClick={handleCloseSaveModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Board Type Selection - Only show when creating new board */}
              {showBoardTypeSelection && (
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600 mb-4">Select board type:</p>
                  <button
                    onClick={() => handleBoardTypeSelect('personal')}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">For Me</div>
                    <div className="text-sm text-gray-600 mt-1">Save to your personal board</div>
                  </button>
                  <button
                    onClick={() => handleBoardTypeSelect('customer')}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-900">For Customer</div>
                    <div className="text-sm text-gray-600 mt-1">Save to a customer board</div>
                  </button>
                </div>
              )}

              {/* Board List - Show all existing boards */}
              {!showBoardTypeSelection && !showCreateBoard && (
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {boards.length > 0 ? (
                    boards.map((board) => {
                      // Get the actual count of saved items in this board
                      const actualPinCount = board.items.length;
                      
                      return (
                        <button
                          key={board.id}
                          onClick={() => handleSaveToBoard(board.id)}
                          disabled={isCardSaved(selectedCard.id, board.id)}
                          className={`w-full p-4 rounded-lg text-left transition-colors ${
                            isCardSaved(selectedCard.id, board.id)
                              ? 'bg-green-50 border-2 border-green-200 cursor-not-allowed'
                              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Tag className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{board.name}</p>
                                <p className="text-sm text-gray-500">{actualPinCount} {actualPinCount === 1 ? 'pin' : 'pins'}</p>
                                {board.type === 'customer' && board.customerName && (
                                  <p className="text-xs text-gray-400 mt-1">Customer: {board.customerName}</p>
                                )}
                              </div>
                            </div>
                            {isCardSaved(selectedCard.id, board.id) && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-4">No boards yet. Create one to get started!</p>
                  )}
                </div>
              )}

              {/* Create New Board Form - Show after type selection */}
              {!showBoardTypeSelection && showCreateBoard && boardType && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Board name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-black"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateBoard();
                      } else if (e.key === 'Escape') {
                        handleCancelCreateBoard();
                      }
                    }}
                  />
                  {boardType === 'customer' && (
                    <>
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-black"
                      />
                      <input
                        type="text"
                        placeholder="Contact Details (Phone/Email)"
                        value={customerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-black"
                      />
                    </>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateBoard}
                      disabled={!newBoardName.trim() || (boardType === 'customer' && (!customerName.trim() || !customerContact.trim()))}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={handleCancelCreateBoard}
                      className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Create New Board Button - Show when not in type selection or create form */}
              {!showBoardTypeSelection && !showCreateBoard && (
                <button
                  onClick={handleCreateBoardClick}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <FolderPlus className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Create board</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Board Confirmation Modal */}
      <AnimatePresence>
        {deletingBoardId && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelDeleteBoard}
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
                <h2 className="text-2xl font-bold text-gray-900">Delete board?</h2>
                <button
                  onClick={cancelDeleteBoard}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete this board? All pins in this board will be removed.
                </p>
                {(() => {
                  const boardToDelete = boards.find(b => b.id === deletingBoardId);
                  return boardToDelete && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="font-semibold text-gray-900 mb-1">{boardToDelete.name}</p>
                      <p className="text-sm text-gray-600">{boardToDelete.items.length} {boardToDelete.items.length === 1 ? 'pin' : 'pins'}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteBoard}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteBoard}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}

