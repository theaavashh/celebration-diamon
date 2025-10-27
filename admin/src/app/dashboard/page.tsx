"use client";

import { useState, useEffect, Suspense } from "react";
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
  Truck,
  RotateCcw,
  XCircle,
  Package2,
  Layers,
  BarChart,
  Mail,
  Gift,
  Target,
  PieChart,
  UserCheck,
  MessageSquare,
  TrendingDown,
  AlertTriangle,
  Clock,
  FileText as ContentIcon,
  Image as SliderIcon,
  Image as ImageIcon,
  Newspaper as ArticleIcon,
  Info as AboutIcon,
  ChevronRight,
  ChevronDown,
  Plus
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [editingBanner, setEditingBanner] = useState<{ id: string; [key: string]: any } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; [key: string]: any } | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    text: '',
    isActive: true,
    priority: 0
  });
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [seoReport, setSeoReport] = useState<any>(null);
  const [isLoadingSeo, setIsLoadingSeo] = useState(false);
  const searchParams = useSearchParams();

  // Read tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch banners when top-banner tab is active
  useEffect(() => {
    if (activeTab === 'top-banner') {
      fetchBanners();
    }
  }, [activeTab]);

  // Fetch dashboard stats when dashboard tab is active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
      fetchSeoReport();
    }
  }, [activeTab]);

  // Function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data.data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Function to fetch SEO report
  const fetchSeoReport = async () => {
    setIsLoadingSeo(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/report`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSeoReport(data.data);
      } else {
        console.error('Failed to fetch SEO report');
      }
    } catch (error) {
      console.error('Error fetching SEO report:', error);
    } finally {
      setIsLoadingSeo(false);
    }
  };

  // Function to fetch banners
  const fetchBanners = async () => {
    setIsLoadingBanners(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners`;
      console.log('Fetching banners from:', apiUrl);
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setBanners(data.data || []);
      } else {
        console.error('Failed to fetch banners, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error: any) {
      console.error('Error fetching banners:', error);
      console.error('Error details:', error.message);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  // Handle form field changes
  const handleFormChange = (field: string, value: any) => {
    setBannerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form when modal opens
  const openModal = () => {
    setBannerForm({
      title: '',
      text: '',
      isActive: true,
      priority: 0
    });
    setEditingBanner(null);
    setIsBannerModalOpen(true);
  };

  // Open edit modal with banner data
  const openEditModal = (banner: any) => {
    setBannerForm({
      title: banner.title || '',
      text: banner.title || '', // Set text same as title for editing
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      priority: banner.priority || 0
    });
    setEditingBanner(banner);
    setIsBannerModalOpen(true);
  };

  // Handle edit banner
  const handleEditBanner = async () => {
    if (!editingBanner) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${editingBanner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bannerForm),
      });

      if (response.ok) {
        toast.success('Banner updated successfully!');
        setIsBannerModalOpen(false);
        setEditingBanner(null);
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Error updating banner');
    }
  };

  // Handle delete confirmation
  const openDeleteConfirm = (banner: any) => {
    setBannerToDelete(banner);
    setShowDeleteConfirm(true);
  };

  // Handle delete banner
  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${bannerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Banner deleted successfully!');
        setShowDeleteConfirm(false);
        setBannerToDelete(null);
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Error deleting banner');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            
            {isLoadingStats ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading dashboard data...</span>
              </div>
            ) : (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.totalProducts || 0}</p>
                    <p className="text-sm text-blue-600">Active products</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Quote Requests</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.totalQuoteRequests || 0}</p>
                    <p className={`text-sm ${dashboardStats?.growth?.quoteRequests?.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dashboardStats?.growth?.quoteRequests?.percentage >= 0 ? '+' : ''}{dashboardStats?.growth?.quoteRequests?.percentage || 0}% from last month
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Collections</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.totalCollections || 0}</p>
                    <p className="text-sm text-blue-600">Product collections</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Visitors</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.totalVisitors || 0}</p>
                    <p className="text-sm text-green-600">Website visitors</p>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Galleries</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.activeGalleries || 0}</p>
                    <p className="text-sm text-blue-600">Active galleries</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Testimonials</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.activeTestimonials || 0}</p>
                    <p className="text-sm text-green-600">Active testimonials</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Recent Quotes</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.recentQuoteRequests || 0}</p>
                    <p className="text-sm text-orange-600">Last 30 days</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Galleries</h3>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats?.overview?.totalGalleries || 0}</p>
                    <p className="text-sm text-purple-600">All galleries</p>
                  </div>
                </div>

                {/* Quick Insights */}
                {dashboardStats && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Product Categories
                      </h3>
                      <div className="space-y-3">
                        {dashboardStats.categories && dashboardStats.categories.length > 0 ? (
                          dashboardStats.categories.slice(0, 5).map((category: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 capitalize">{category.name}</span>
                              <span className="text-sm font-medium text-gray-900">{category.count} products</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No categories found</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                        Recent Quote Requests
                      </h3>
                      <div className="space-y-3">
                        {dashboardStats.recentQuotes && dashboardStats.recentQuotes.length > 0 ? (
                          dashboardStats.recentQuotes.slice(0, 5).map((quote: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-600">{quote.name}</span>
                                <span className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span className="text-sm font-medium text-blue-600">{quote.status || 'New'}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No recent quotes</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                        Growth Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Quote Requests</span>
                          <span className={`text-sm font-medium ${dashboardStats.growth?.quoteRequests?.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardStats.growth?.quoteRequests?.percentage >= 0 ? '+' : ''}{dashboardStats.growth?.quoteRequests?.percentage || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">This Month</span>
                          <span className="text-sm font-medium text-blue-600">{dashboardStats.growth?.quoteRequests?.current || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Last Month</span>
                          <span className="text-sm font-medium text-gray-600">{dashboardStats.growth?.quoteRequests?.previous || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Report Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
                    SEO Report
                  </h3>
                  
                  {isLoadingSeo ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      <span className="ml-2 text-gray-600">Loading SEO report...</span>
                    </div>
                  ) : seoReport ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* SEO Score */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-blue-600" />
                          SEO Score
                        </h4>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            {seoReport.overview?.seoScore || 0}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (seoReport.overview?.seoScore || 0) >= 80 ? 'bg-green-500' :
                                (seoReport.overview?.seoScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${seoReport.overview?.seoScore || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {seoReport.overview?.missingSeoItems || 0} items need attention
                          </p>
                        </div>
                      </div>

                      {/* Content Freshness */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-orange-600" />
                          Content Freshness
                        </h4>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            {seoReport.overview?.freshnessScore || 0}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (seoReport.overview?.freshnessScore || 0) >= 50 ? 'bg-green-500' :
                                (seoReport.overview?.freshnessScore || 0) >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${seoReport.overview?.freshnessScore || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Recent content activity
                          </p>
                        </div>
                      </div>

                      {/* Content Overview */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-purple-600" />
                          Content Overview
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Products</span>
                            <span className="text-sm font-medium text-gray-900">
                              {seoReport.content?.products?.active || 0} / {seoReport.content?.products?.total || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Galleries</span>
                            <span className="text-sm font-medium text-gray-900">
                              {seoReport.content?.galleries?.active || 0} / {seoReport.content?.galleries?.total || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Testimonials</span>
                            <span className="text-sm font-medium text-gray-900">
                              {seoReport.content?.testimonials?.active || 0} / {seoReport.content?.testimonials?.total || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">FAQs</span>
                            <span className="text-sm font-medium text-gray-900">
                              {seoReport.content?.faqs?.active || 0} / {seoReport.content?.faqs?.total || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-center text-gray-500">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Unable to load SEO report</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case "quick-insights":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Insights</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Detailed insights and analytics will be displayed here...</p>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Order management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "products":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Product management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "customers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Customer management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "sales":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Sales management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Analytics and reports content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "content-management":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Content management dashboard will be displayed here...</p>
              </div>
            </div>
          </div>
        );
      case "top-banner":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Top Banner Management</h2>
              <button
                onClick={openModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </button>
            </div>
            
            {isLoadingBanners ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading banners...</p>
                  </div>
                </div>
              </div>
            ) : banners.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No banners created yet</h3>
                    <p className="text-gray-500 mb-4">Create your first promotional banner to get started.</p>
                    <button 
                      onClick={openModal}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Create Banner
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner: any) => (
                  <div key={banner.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      {/* Banner Content */}
                      <div className="mb-4">
                        <div 
                          className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: banner.title }}
                        />
                      </div>

                      {/* Status and Date */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${banner.id}/toggle`, {
                                method: 'PATCH',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                              });
                              if (response.ok) {
                                toast.success(banner.isActive ? 'Banner deactivated' : 'Banner activated');
                                fetchBanners(); // Refresh the list
                              } else {
                                toast.error('Failed to toggle banner status');
                              }
                            } catch (error) {
                              console.error('Error toggling banner:', error);
                              toast.error('Error toggling banner status');
                            }
                          }}
                          className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 ${
                            banner.isActive 
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' 
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          }`}
                        >
                          {banner.isActive ? (
                            <>
                              <Clock className="w-3 h-3" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Star className="w-3 h-3" />
                              Activate
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => openEditModal(banner)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(banner)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "sliders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sliders Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Manage homepage sliders and banners here...</p>
              </div>
            </div>
          </div>
        );
      case "articles":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Articles Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Create and manage blog articles and news posts here...</p>
              </div>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">About Page Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Edit and manage the about page content here...</p>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Settings content will go here...</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Content for {activeTab} will be displayed here...</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardLayout title="Dashboard" showBreadcrumb={true}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Banner Creation Modal */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsBannerModalOpen(false);
                      setEditingBanner(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Title *
                      </label>
                      <RichTextEditor
                        value={bannerForm.title}
                        onChange={(value) => {
                          handleFormChange('title', value);
                          handleFormChange('text', value); // Set text same as title
                        }}
                        placeholder="e.g., Free Delivery on orders over NPR.10000. Don't miss discount."
                        className="border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Use the rich text editor to format your banner content with custom styling</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={bannerForm.priority || 0}
                        onChange={(e) => handleFormChange('priority', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        style={{ color: '#000000' }}
                      />
                      <p className="text-xs text-black mt-1">Higher numbers appear first</p>
                    </div>
                  </div>




                  {/* Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={bannerForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active (visible on website)
                    </label>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-white">
                      <div className="text-center">
                        <div 
                          className="text-sm font-medium text-gray-900"
                          dangerouslySetInnerHTML={{ __html: bannerForm.title || 'Banner content will appear here' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBanner ? handleEditBanner : async () => {
                      try {
                        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners`;
                        const token = localStorage.getItem('token');
                        console.log('Creating banner at:', apiUrl);
                        console.log('Token available:', !!token);
                        console.log('Banner form data:', bannerForm);
                        
                        const response = await fetch(apiUrl, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify(bannerForm)
                        });

                        if (response.ok) {
                          const result = await response.json();
                          console.log('Banner created:', result);
                          toast.success('Banner created successfully!');
                          setIsBannerModalOpen(false);
                          // Reset form
                          setBannerForm({
                            title: '',
                            text: '',
                            isActive: true,
                            priority: 0
                          });
                          // Refresh banner list
                          fetchBanners();
                        } else {
                          const errorText = await response.text();
                          console.error('Error creating banner, status:', response.status);
                          console.error('Error response text:', errorText);
                          let errorMessage = 'Failed to create banner';
                          try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.message || errorMessage;
                            console.error('Error creating banner:', errorJson);
                          } catch (e) {
                            console.error('Could not parse error response as JSON');
                          }
                          toast.error(errorMessage);
                        }
                      } catch (error) {
                        console.error('Error creating banner:', error);
                        toast.error('Failed to create banner');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    {editingBanner ? (
                      <>
                        <Package className="w-4 h-4" />
                        Update Banner
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Banner
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Delete Banner</h2>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this banner? This action cannot be undone.
                  </p>
                  {bannerToDelete && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: bannerToDelete.title }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBanner}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Delete Banner
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </DashboardLayout>
      <Toaster position="top-right" />
    </>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}