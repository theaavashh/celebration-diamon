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
  PieChart,
  UserCheck,
  MessageSquare,
  TrendingDown,
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
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

type SectionTitleProps = { children: React.ReactNode; className?: string };
const SectionTitle = ({ children, className }: SectionTitleProps) => (
  <h2 className={`text-3xl font-bold  text-black ${className ?? ''}`}>{children}</h2>
);

type MetricCardProps = {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
};
const MetricCard = ({ title, value, subtitle, subtitleClassName }: MetricCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-base md:text-2xl font-bold text-gray-600">{title}</h3>
    <p className="text-4xl md:text-5xl font-bold text-gray-900">{value}</p>
    {subtitle && (
      <p className={`text-base ${subtitleClassName ?? 'text-gray-600'}`}>{subtitle}</p>
    )}
  </div>
);

type ChartBarDatum = { label: string; value: number };
type ChartBarProps = { data: ChartBarDatum[] };
const ChartBar = ({ data }: ChartBarProps) => {
  const barCount = data.length;
  const width = 400;
  const height = 160;
  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const barW = innerW / Math.max(1, barCount);
  const values = data.map(d => {
    const n = Number(d.value);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  });
  const max = Math.max(1, ...values);
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <rect x={padding} y={padding} width={innerW} height={innerH} fill="transparent" />
        {data.map((d, i) => {
          const v = values[i] ?? 0;
          const h = innerH * (v / max);
          const x = padding + i * barW + barW * 0.15;
          const y = padding + innerH - h;
          const w = barW * 0.7;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx={6} className="fill-blue-500" />
              <text x={x + w / 2} y={height - 6} textAnchor="middle" className="fill-gray-600 text-[10px]">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

type ChartLineProps = { points: number[] };
const ChartLine = ({ points }: ChartLineProps) => {
  const width = 400;
  const height = 160;
  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const values = points.map(p => {
    const n = Number(p);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  });
  const max = Math.max(1, ...values);
  const step = innerW / Math.max(1, values.length - 1);
  const coords = values.map((v, i) => {
    const x = padding + i * step;
    const y = padding + innerH - innerH * (v / max);
    return `${x},${y}`;
  }).join(" ");
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <polyline points={coords} className="fill-none stroke-purple-600" strokeWidth={3} />
        {values.map((v, i) => {
          const x = padding + i * step;
          const y = padding + innerH - innerH * (v / max);
          return <circle key={i} cx={x} cy={y} r={4} className="fill-purple-600" />;
        })}
      </svg>
    </div>
  );
};

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
    }
  }, [activeTab]);

  // Function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/dashboard/stats`, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data.data);
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        console.error('Failed to fetch dashboard stats, status:', response.status);
        toast.error(`Failed to fetch dashboard stats: ${response.status === 403 ? 'Access denied' : 'Server error'}`);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsLoadingStats(false);
    }
  };



  // Function to fetch banners
  const fetchBanners = async () => {
    setIsLoadingBanners(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const apiUrl = `${base}/api/banners`;
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
    } catch (error: unknown) {
      console.error('Error fetching banners:', error);
      const err = error as { message?: string };
      console.error('Error details:', err?.message);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  // Helper function to strip HTML and get text content
  const stripHtml = (html: string): string => {
    if (!html) return '';
    // Create a temporary element to extract text content
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').trim();
  };

  // Helper function to check if content is empty after stripping HTML
  const stripHtmlAndCheckEmpty = (html: string): boolean => {
    return stripHtml(html).length === 0;
  };

  // Helper function to validate title length (1-100 characters)
  // We strip HTML before sending, so validate the plain text length
  const validateTitle = (html: string): string | null => {
    const text = stripHtml(html);
    if (text.length === 0) {
      return 'Banner Title is required';
    }
    if (text.length > 100) {
      return 'Title must be between 1 and 100 characters';
    }
    return null;
  };

  // Helper function to validate text length (1-200 characters)
  // We strip HTML before sending, so validate the plain text length
  const validateText = (html: string): string | null => {
    const text = stripHtml(html);
    if (text.length === 0) {
      return 'Banner text is required';
    }
    if (text.length > 200) {
      return 'Banner text must be between 1 and 200 characters';
    }
    return null;
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

    // Validate form before submission
    const titleError = validateTitle(bannerForm.title);
    if (titleError) {
      toast.error(titleError);
      return;
    }
    const textError = validateText(bannerForm.text);
    if (textError) {
      toast.error(textError);
      return;
    }

    try {
      // Strip HTML from title and text before sending to backend
      // This ensures validation works correctly and we store plain text
      const bannerDataToSend = {
        ...bannerForm,
        title: stripHtml(bannerForm.title),
        text: stripHtml(bannerForm.text)
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${editingBanner.id}`, {
        method: 'PUT',
        credentials: 'include', // Use cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bannerDataToSend),
      });

      if (response.ok) {
        toast.success('Banner updated successfully!');
        setIsBannerModalOpen(false);
        setEditingBanner(null);
        fetchBanners(); // Refresh the list
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to update banner';
        try {
          const errorJson = JSON.parse(errorText);
          // Show specific validation errors if available
          if (errorJson.errors && Array.isArray(errorJson.errors) && errorJson.errors.length > 0) {
            const validationErrors = errorJson.errors.map((err: any) => err.msg || err.message).join(', ');
            errorMessage = validationErrors;
          } else {
            errorMessage = errorJson.message || errorMessage;
          }
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        toast.error(errorMessage);
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
      console.log('Deleting banner:', { id: bannerToDelete.id });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${bannerToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include', // Use cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        toast.success('Banner deleted successfully!');
        setShowDeleteConfirm(false);
        setBannerToDelete(null);
        fetchBanners(); // Refresh the list
      } else if (response.status === 401) {
        const responseText = await response.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText || 'Invalid token' };
        }
        console.error('Authentication failed:', { status: response.status, errorData, responseText });
        toast.error('Session expired. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        const responseText = await response.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText || 'Failed to delete banner' };
        }
        const errorMessage = errorData.message || errorData.error || `Failed to delete banner: ${response.status} ${response.statusText}`;
        console.error('Failed to delete banner:', { 
          status: response.status, 
          statusText: response.statusText,
          errorData, 
          responseText,
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${bannerToDelete.id}`,
          bannerId: bannerToDelete.id
        });
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error or unexpected error occurred';
      console.error('Error deleting banner:', { 
        error, 
        message: errorMessage,
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${bannerToDelete?.id}`,
        bannerId: bannerToDelete?.id
      });
      toast.error(`Failed to delete banner: ${errorMessage}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <SectionTitle className="pt-4 italic font-bold">Dashboard Overview</SectionTitle>
            {isLoadingStats ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading dashboard data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 col-span-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    <MetricCard title="Total Products" value={dashboardStats?.overview?.totalProducts || 0} subtitle="Active products" subtitleClassName="text-blue-600" />
                    <MetricCard title="Quote Requests" value={dashboardStats?.overview?.totalQuoteRequests || 0} subtitle={`${(dashboardStats?.growth?.quoteRequests?.percentage ?? 0) >= 0 ? '+' : ''}${dashboardStats?.growth?.quoteRequests?.percentage ?? 0}% from last month`} subtitleClassName={(dashboardStats?.growth?.quoteRequests?.percentage ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'} />
                    <MetricCard title="Collections" value={dashboardStats?.overview?.totalCollections || 0} subtitle="Product collections" subtitleClassName="text-blue-600" />
                    <MetricCard title="Total Visitors" value={dashboardStats?.overview?.totalVisitors || 0} subtitle="Website visitors" subtitleClassName="text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 xl:col-span-4 col-span-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Top Categories</h3>
                  <ChartBar data={(dashboardStats?.categories || []).slice(0, 5).map((c: any) => ({ label: c.name, value: c.count }))} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 xl:col-span-4 col-span-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-600" />Product Categories</h3>
                  <div className="space-y-3">
                    {dashboardStats?.categories && dashboardStats.categories.length > 0 ? (
                      dashboardStats.categories.slice(0, 5).map((category: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-base text-gray-700 capitalize">{category.name}</span>
                          <span className="text-base font-medium text-gray-900">{category.count} products</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-base text-gray-500">No categories found</div>
                    )}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 xl:col-span-4 col-span-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-blue-600" />Recent Quote Requests</h3>
                  <div className="space-y-3">
                    {dashboardStats?.recentQuotes && dashboardStats.recentQuotes.length > 0 ? (
                      dashboardStats.recentQuotes.slice(0, 5).map((quote: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-base text-gray-700">{quote.name}</span>
                            <span className="text-sm text-gray-500">{new Date(quote.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-base font-medium text-blue-600">{quote.status || 'New'}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-base text-gray-500">No recent quotes</div>
                    )}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 xl:col-span-4 col-span-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-purple-600" />Growth Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-700">Quote Requests</span>
                      <span className={`text-base font-medium ${(dashboardStats?.growth?.quoteRequests?.percentage ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(dashboardStats?.growth?.quoteRequests?.percentage ?? 0) >= 0 ? '+' : ''}{dashboardStats?.growth?.quoteRequests?.percentage ?? 0}%</span>
                    </div>
                    <ChartLine points={[dashboardStats?.growth?.quoteRequests?.previous || 0, dashboardStats?.growth?.quoteRequests?.current || 0]} />
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-700">This Month</span>
                      <span className="text-lg font-medium text-blue-600">{dashboardStats?.growth?.quoteRequests?.current || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-700">Last Month</span>
                      <span className="text-lg font-medium text-gray-700">{dashboardStats?.growth?.quoteRequests?.previous || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "quick-insights":
        return (
          <div className="space-y-6">
            <SectionTitle>Quick Insights</SectionTitle>
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
            <SectionTitle>Orders Management</SectionTitle>
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
            <SectionTitle>Products Management</SectionTitle>
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
            <SectionTitle>Customer Management</SectionTitle>
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
            <SectionTitle>Sales Management</SectionTitle>
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
            <SectionTitle>Analytics & Reports</SectionTitle>
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
            <SectionTitle>Content Management</SectionTitle>
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
              <SectionTitle>Top Banner Management</SectionTitle>
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
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No banners created yet</h3>
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
                          onClick={() => toggleBannerStatus(banner.id, banner.isActive)}
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
      {/* Removed animation wrapper */}
      <div>
        {renderContent()}
      </div>

      {/* Banner Creation Modal */}
      {/* Removed animation wrapper */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
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
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Banner Title *
                    </label>
                    <RichTextEditor
                      value={bannerForm.title}
                      onChange={(value) => {
                        handleFormChange('title', value);
                        handleFormChange('text', value); // Set text same as title
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">Use the rich text editor to format your banner content with custom styling</p>
                  </div>
                  
                  <div>
                    <label className="block text-base font-medium text-black mb-2">
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
                    <p className="text-sm text-black mt-1">Higher numbers appear first</p>
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
                  <label htmlFor="isActive" className="ml-2 block text-base text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-white">
                    <div className="text-center">
                      <div 
                        className="text-base font-medium text-gray-900"
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
                    // Validate form before submission
                    const titleError = validateTitle(bannerForm.title);
                    if (titleError) {
                      toast.error(titleError);
                      return;
                    }
                    const textError = validateText(bannerForm.text);
                    if (textError) {
                      toast.error(textError);
                      return;
                    }

                    try {
                      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners`;
                      // Using cookie-based authentication instead of localStorage
                            // const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                      
                      // Strip HTML from title and text before sending to backend
                      // This ensures validation works correctly and we store plain text
                      const bannerDataToSend = {
                        ...bannerForm,
                        title: stripHtml(bannerForm.title),
                        text: stripHtml(bannerForm.text)
                      };
                      
                      console.log('Creating banner at:', apiUrl);
                      console.log('Banner form data:', bannerDataToSend);
                      
                      const response = await fetch(apiUrl, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bannerDataToSend)
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
                        // fetchBanners(); // This function is not in scope here
                      } else if (response.status === 401) {
                        const errorText = await response.text();
                        let errorJson: any = {};
                        try {
                          errorJson = JSON.parse(errorText);
                        } catch (e) {
                          errorJson = { message: errorText || 'Invalid token' };
                        }
                        
                        console.error('Authentication failed:', { status: response.status, errorJson, errorText });
                        
                        // Using cookie-based authentication, no need to clear localStorage tokens
                        
                        // Show error and redirect
                        const errorMsg = errorJson.message || 'Invalid token';
                        if (errorMsg.includes('Invalid token') || errorMsg.includes('expired')) {
                          toast.error('Your session has expired. Please log in again.');
                        } else {
                          toast.error(errorMsg);
                        }
                        
                        setTimeout(() => {
                          if (typeof window !== 'undefined') {
                            window.location.href = '/';
                          }
                        }, 1500);
                      } else {
                        const errorText = await response.text();
                        console.error('Error creating banner, status:', response.status);
                        console.error('Error response text:', errorText);
                        let errorMessage = 'Failed to create banner';
                        try {
                          const errorJson = JSON.parse(errorText);
                          // Show specific validation errors if available
                          if (errorJson.errors && Array.isArray(errorJson.errors) && errorJson.errors.length > 0) {
                            const validationErrors = errorJson.errors.map((err: any) => err.msg || err.message).join(', ');
                            errorMessage = validationErrors;
                          } else {
                            errorMessage = errorJson.message || errorMessage;
                          }
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
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {/* Removed animation wrapper */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Delete Banner</h2>
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
                      className="text-base text-gray-700"
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
          </div>
        </div>
      )}
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

// Toggle banner status
const toggleBannerStatus = async (bannerId: string, currentStatus: boolean) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/${bannerId}/toggle`, {
      method: 'PATCH',
      credentials: 'include', // Use cookies for authentication
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      toast.success(currentStatus ? 'Banner deactivated' : 'Banner activated');
      // Refresh the list
      // fetchBanners(); // This function is not in scope here
    } else {
      toast.error('Failed to toggle banner status');
    }
  } catch (error) {
    console.error('Error toggling banner:', error);
    toast.error('Error toggling banner status');
  }
};
