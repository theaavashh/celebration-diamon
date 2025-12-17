"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


import { 
  BarChart3, 
  FolderOpen, 
  Package, 
  Percent, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  FileText,
  Star,
  Package2,
  Layers,
  BarChart,
  Mail,
  Gift,
  Target,
  UserCheck,
  MessageSquare,
  FileText as ContentIcon,
  Image as SliderIcon,
  Newspaper as ArticleIcon,
  Info as AboutIcon,
  Video,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Database,
  Utensils,
  Award,
  Heart,
  Key,
  ChevronUp,
  Store,
  FileCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Breadcrumb from "@/components/Breadcrumb";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { fetchCsrfToken } from "@/lib/csrfClient";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBreadcrumb?: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  children?: NavigationItem[];
}

export default function DashboardLayout({ 
  children, 
  title = "Dashboard",
  showBackButton = false,
  showBreadcrumb = true
}: DashboardLayoutProps) {
  
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const desktop = width >= 1024;
        setIsDesktop(desktop);
        setIsMobile(width < 768);
        setSidebarOpen(desktop);
      }
    };

    checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  useEffect(() => {
    fetchCsrfToken().catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  const routePaths: Record<string, string> = {
    dashboard: '/dashboard',
    categories: '/dashboard/categories',
    'attribute-options': '/dashboard/attribute-options',
    products: '/dashboard/products',
    'site-settings': '/dashboard/settings',
    configuration: '/dashboard/settings/configuration',
    users: '/dashboard/users',
    password: '/dashboard/settings/password',
    analytics: '/dashboard/analytics',
    'sales-analytics': '/dashboard/sales-analytics',
    'product-performance': '/dashboard/product-performance',
    discounts: '/dashboard/discounts',
    'all-orders': '/dashboard/orders',
    'shipped-delivered': '/dashboard/orders/shipped-delivered',
    returns: '/dashboard/orders/returns',
    refunds: '/dashboard/orders/refunds',
    cancellations: '/dashboard/orders/cancellations',
    reviews: '/dashboard/reviews',
    'hero-section': '/dashboard/content/hero-section',
    'email-subscriptions': '/dashboard/email-subscriptions',
    testimonials: '/dashboard/content/testimonials',
    services: '/dashboard/content/services',
    videos: '/dashboard/content/videos',
    banners: '/dashboard/content/banners',
    about: '/dashboard/content/about',
  };

  const handleNavigation = (itemId: string, parentId?: string) => {
    const item = navigationItems.find(i => i.id === itemId) || navigationItems.flatMap(i => i.children || []).find(i => i.id === itemId) || navigationItems.flatMap(i => (i.children || []).flatMap(c => c.children || [])).find(i => i.id === itemId) || null;
    const hasChildren = !!item?.children?.length;
    const path = routePaths[itemId] || null;
    if (parentId) {
      if (hasChildren && itemId === 'media') {
        if (path) router.push(path);
        toggleSection(itemId);
      } else if (hasChildren) {
        toggleSection(itemId);
      } else {
        if (path) router.push(path);
      }
    } else {
      if (hasChildren) {
        toggleSection(itemId);
      } else {
        if (path) router.push(path);
      }
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      children: [
        { id: "quick-insights", label: "Quick Insights", icon: TrendingUp }
      ]
    },
    
    {
      id: "categories",
      label: "Categories",
      icon: FolderOpen
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      
    },
    {
      id: "email-subscriptions",
      label: "Email Subscriptions",
      icon: Mail
    },
    {
      id: "orders",
      label: "Inquiry",
      icon: ShoppingCart,
      children: [
        { id: "all-orders", label: "All Orders", icon: FileText }
      ]
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      children: [
        { id: "all-customers", label: "All Customers", icon: UserCheck },
        { id: "reviews", label: "Reviews & Ratings", icon: Star }
      ]
    },
    {
      id: "sales",
      label: "Sales",
      icon: DollarSign,
      children: [
        { id: "discounts", label: "Discounts", icon: Percent },
        { id: "promotions", label: "Promotions", icon: Gift },
        { id: "email-marketing", label: "Email Marketing", icon: Mail },
        { id: "email-subscriptions", label: "Email Subscriptions", icon: Mail }
      ]
    },
    {
      id: "content",
      label: "Content",
      icon: Layers,
      children: [
        { id: "hero-section", label: "Hero Section", icon: SliderIcon },
        { id: "testimonials", label: "Testimonials", icon: Star },
        { id: "services", label: "Services", icon: SliderIcon },
        { id: "videos", label: "Videos", icon: Video },
        { id: "banners", label: "Banners", icon: SliderIcon }
        ,{ id: "about", label: "About", icon: AboutIcon }
      ]
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      children: [
        { id: "analytics", label: "Website Analytics", icon: BarChart3 },
        { id: "sales-analytics", label: "Sales Analytics", icon: TrendingUp },
        { id: "product-performance", label: "Product Performance", icon: BarChart },
        { id: "customer-analytics", label: "Customer Analytics", icon: Users },
        { id: "marketing-performance", label: "Marketing Performance", icon: Target }
      ]
    },
    
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      children: [
        { id: "site-settings", label: "Site Settings", icon: Settings },
        { id: "users", label: "User Configuration", icon: UserCheck },
        { id: "password", label: "Password Management", icon: Key },
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <div className={` min-h-screen bg-gray-50 `}>
        {/* Mobile sidebar overlay */}
        {/* Removed animation wrapper */}
        {sidebarOpen && !isDesktop && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <motion.div 
          className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col ${
            isDesktop ? (isCollapsed ? 'w-16' : 'w-64') : 'w-80'
          } ${
            isDesktop ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
          }`}
          initial={false}
          animate={{ width: isDesktop ? (isCollapsed ? 64 : 256) : 320 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {/* Fixed Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <Image
                src="/celeb.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  className="text-xl font-bold text-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Admin CMS
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsCollapsed(v => !v)}
            className="hidden lg:inline-flex p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-hide" style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}>
            {/* Removed animation wrapper */}
            <div className="space-y-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isExpanded = expandedSections.includes(item.id);
                const children = item.children ?? [];
                const hasChildren = children.length > 0;
                
                return (
                  // Removed animation wrapper
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleSection(item.id);
                        } else {
                          handleNavigation(item.id);
                        }
                      }}
                    className={`w-full flex items-center justify-between px-3 py-3 font-medium text-2xl rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname.includes(item.id)
                          ? 'bg-blue-50 text-black border-r-2 border-blue-700'
                          : 'text-black hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center min-w-0 flex-1 ">
                      <Icon className="w-5 h-5 mr-5 flex-shrink-0" />
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.span
                            className="truncate text-xl text-black"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {!isCollapsed && hasChildren && (
                      <div
                        className="flex-shrink-0 ml-2"
                        style={{ transform: `rotate(${isExpanded ? 90 : 0}deg)` }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                    
                    {/* Children */}
                    {/* Removed animation wrapper */}
                    {hasChildren && isExpanded && !isCollapsed && (
                      <div className="relative ml-6 mt-1 space-y-1">
                        {/* Tree connector line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                        
                        {children.map((child, index) => {
                          const ChildIcon = child.icon;
                          
                          const grandChildren = child.children ?? [];
                          const hasGrandChildren = grandChildren.length > 0;
                          const isChildExpanded = expandedSections.includes(child.id);
                          
                          return (
                            // Removed animation wrapper
                            <div
                              key={child.id}
                              className="relative"
                            >
                              {/* Curved connector - horizontal line with curve */}
                              <div className="absolute left-0 top-1/2 w-6 h-3  transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>
                              
                              <button
                                onClick={() => {
                                  if (hasGrandChildren) {
                                    // For Media item, we want to both navigate and expand
                                    if (child.id === 'media') {
                                      handleNavigation(child.id, item.id);
                                      toggleSection(child.id);
                                    } else {
                                      toggleSection(child.id);
                                    }
                                  } else {
                                    handleNavigation(child.id, item.id);
                                  }
                                }}
                                className={`w-full flex items-center pl-8 pr-3 py-3 font-medium rounded-lg transition-colors relative ${
                                  typeof window !== 'undefined' && window.location.pathname.includes(child.id)
                                    ? 'bg-blue-50 text-black'
                                    : 'text-black hover:bg-gray-50'
                                }`}
                              >
                                <ChildIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                                <span className="truncate text-lg text-black">{child.label}</span>
                                {hasGrandChildren && (
                                  <div
                                    className="flex-shrink-0 ml-2"
                                    style={{ transform: `rotate(${isChildExpanded ? 90 : 0}deg)` }}
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                  </div>
                                )}
                              </button>

                              {/* Grand Children (Nested Submenu) */}
                              {/* Removed animation wrapper */}
                              {hasGrandChildren && isChildExpanded && (
                                <div className="relative ml-6 mt-1 space-y-1">
                                  {/* Tree connector line for nested items */}
                                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                                  
                                  {grandChildren.map((grandChild, grandIndex) => {
                                    const GrandChildIcon = grandChild.icon;
                                    
                                    return (
                                      // Removed animation wrapper
                                      <div
                                        key={grandChild.id}
                                        className="relative"
                                      >
                                        {/* Curved connector for nested items */}
                                        <div className="absolute left-0 top-1/2 w-6 h-3 transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>
                                        
                                        <button
                                          onClick={() => handleNavigation(grandChild.id, child.id)}
                                          className={`w-full flex items-center pl-8 pr-3 py-3 font-medium rounded-lg transition-colors relative ${
                                            typeof window !== 'undefined' && window.location.pathname.includes(grandChild.id)
                                              ? 'bg-blue-50 text-black'
                                              : 'text-black hover:bg-gray-50'
                                          }`}
                                        >
                                          <GrandChildIcon className="w-3 h-3 mr-3 flex-shrink-0" />
                                          <span className="truncate text-base text-black">{grandChild.label}</span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-xl px-3 py-2  text-black hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          className={`w-full`}
          initial={false}
          animate={{ paddingLeft: isDesktop ? (isCollapsed ? 64 : 256) : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {/* Top bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`lg:hidden p-2 rounded-md transition-colors ${
                    sidebarOpen 
                      ? 'text-black bg-blue-50 hover:bg-blue-100' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {showBackButton && (
                  <button
                    onClick={() => router.back()}
                    className="p-2 rounded-md text-black hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {/* Show breadcrumbs instead of title when showBreadcrumb is true */}
                {showBreadcrumb ? (
                  <div className="flex items-center">
                    <Breadcrumb />
                  </div>
                ) : (
                  <h1 className="text-xl sm:text-2xl font-bold text-black truncate">
                    {title}
                  </h1>
                )}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-black hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="hidden sm:inline">Welcome back, {user?.fullname || 'Admin'}</span>
                    <span className="sm:hidden">{user?.fullname || 'Admin'}</span>
                    {userMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  {/* Removed animation wrapper */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          setShowChangePasswordModal(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-base font-medium text-black hover:bg-gray-100 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        <span>Change Password</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-base font-medium text-black hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Click outside to close menu */}
              {userMenuOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
              )}

              {/* Change Password Modal */}
              {showChangePasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <ChangePasswordModal
                    onClose={() => setShowChangePasswordModal(false)}
                    userId={user?.id || ''}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Quick Actions */}
          {isMobile && (
            <div className="bg-white border-b border-gray-200 px-4 py-2">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <button
                  onClick={() => handleNavigation('all-products')}
                  className="flex-shrink-0 px-3 py-2 font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Products
                </button>
                <button
                  onClick={() => handleNavigation('all-orders')}
                  className="flex-shrink-0 px-3 py-2 font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleNavigation('all-customers')}
                  className="flex-shrink-0 px-3 py-2 font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Customers
                </button>
                <button
                  onClick={() => handleNavigation('sales-analytics')}
                  className="flex-shrink-0 px-3 py-2 font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
          )}

          {/* Page content */}
          {/* Removed animation wrapper */}
          <main 
            className="p-4 sm:p-6"
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
