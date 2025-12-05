'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import ProductForm from '@/components/ProductForm';
import ProductPreviewModal from '@/components/ProductPreviewModal';
import { ChevronLeft, ChevronRight, Edit, Eye, EyeOff, Trash2, ChevronDown, ChevronUp, Star, MessageSquare, Info, ExternalLink, X } from 'lucide-react';

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  imageUrl?: string;
  images?: ProductImage[];
  stock: number;
  isActive: boolean;
  status: string; // "draft", "active", "inactive"
  // Gold Fields
  goldWeight?: string;
  goldPurity?: string;
  goldType?: string;
  goldCraftsmanship?: string;
  goldDesignDescription?: string;
  goldFinishedType?: string;
  goldStones?: string;
  goldStoneQuality?: string;
  // Diamond Fields
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  // Other Fields
  stoneWeight?: string;
  caret?: string;
  otherGemstones?: string;
  orderDuration?: string;
  metalType?: string;
  stoneType?: string;
  settingType?: string;
  size?: string;
  color?: string;
  finish?: string;
  digitalBrowser?: boolean;
  website?: boolean;
  distributor?: boolean;
  culture?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSlug?: string;
  briefDescription?: string;
  fullDescription?: string;
  // Silver Fields
  silverWeight?: string;
  silverPurity?: string;
  createdAt: string;
  updatedAt: string;
}

// Add interface for Category (matching the backend model)
interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Add interface for Subcategory
interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();
  
  // Helper function to get correct API URL
  const getApiUrl = (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    // Remove trailing /api if present to avoid duplication
    const cleanUrl = baseUrl.replace(/\/api$/, '');
    return `${cleanUrl}/api${endpoint}`;
  };
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // Add status filter state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [productReviews, setProductReviews] = useState<Record<string, any[]>>({});
  const [showReviewsFor, setShowReviewsFor] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    // This will be handled by the ProductForm component
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This will be handled by the ProductForm component
  };

  // Reset form when modal opens
  const openModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open edit modal with product data
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Handle create/edit product
  const handleSubmit = async () => {
    // This will be handled by the ProductForm component
  };

  // Handle delete product
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(getApiUrl(`/products/${id}`), {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Product deleted successfully!');
        fetchProducts();
        setDeleteConfirm({ isOpen: false, product: null }); // Close modal
      } else if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Using cookie-based authentication, no need to clear localStorage tokens
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (product: Product) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteConfirm({ isOpen: false, product: null });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirm.product) {
      if (deleteConfirm.product.id === '' && selectedProducts.size > 0) {
        // Bulk delete
        confirmBulkDelete();
      } else {
        // Single delete
        handleDelete(deleteConfirm.product.id);
      }
    }
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Toggle all products on current page
  const toggleSelectAll = () => {
    if (selectedProducts.size === currentProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(currentProducts.map(p => p.id)));
    }
  };

  // Bulk delete selected products
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      toast.error('No products selected');
      return;
    }
    
    setDeleteConfirm({ 
      isOpen: true, 
      product: { 
        id: '', 
        name: `${selectedProducts.size} product${selectedProducts.size > 1 ? 's' : ''}`,
        productCode: '',
        description: '',
        category: '',
        price: 0,
        stock: 0,
        isActive: false,
        status: 'draft', // Add status property
        createdAt: '',
        updatedAt: ''
      } 
    });
  };

  // Handle bulk delete confirmation
  const confirmBulkDelete = async () => {
    try {
      for (const id of selectedProducts) {
        await fetch(getApiUrl(`/products/${id}`), {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      toast.success(`${selectedProducts.size} product(s) deleted successfully!`);
      setSelectedProducts(new Set());
      fetchProducts();
      setDeleteConfirm({ isOpen: false, product: null });
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(getApiUrl(`/products/${id}/toggle`), {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Product status updated!');
        fetchProducts();
      } else if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Using cookie-based authentication, no need to clear localStorage tokens
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        toast.error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status');
    }
  };

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when search, category, or status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.error('User is not authenticated');
        toast.error('Authentication required. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        setIsLoading(false);
        return;
      }

      // Try to get token from localStorage as fallback (for API calls that need Bearer token)
      const authToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (selectedCategory) queryParams.append('category', selectedCategory);
      if (selectedStatus && selectedStatus !== 'all') queryParams.append('status', selectedStatus);
      
      const url = queryParams.toString() 
        ? `${getApiUrl('/products/admin/all')}?${queryParams.toString()}`
        : getApiUrl('/products/admin/all');
      
      const response = await fetch(url, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data.data);
        setAllProducts(data.data || []);
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        // Clear tokens and redirect to home page
        // Using cookie-based authentication, no need to clear localStorage tokens
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        console.error('Failed to fetch products, status:', response.status);
        toast.error(`Failed to fetch products: ${response.status === 403 ? 'Access denied' : 'Server error'}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('/products/categories'));
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/subcategories/admin/all`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fetch product reviews
  const fetchProductReviews = async (productId: string) => {
    try {
      const response = await fetch(getApiUrl(`/reviews/product/${productId}`));
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProductReviews(prev => ({
            ...prev,
            [productId]: data.data || []
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Toggle product details expansion
  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
      // Fetch reviews when expanding
      fetchProductReviews(productId);
    }
    setExpandedProducts(newExpanded);
  };

  // Open preview modal with product data
  const openPreviewModal = (product: Product) => {
    console.log('Opening preview for product:', product);
    setPreviewProduct(product);
    setIsPreviewOpen(true);
    console.log('Preview state set:', { previewProduct: product, isPreviewOpen: true });
  };

  // Close preview modal
  const closePreviewModal = () => {
    console.log('Closing preview modal');
    setIsPreviewOpen(false);
    setPreviewProduct(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Preview Modal Component
  const PreviewModal = () => {
    console.log('Rendering PreviewModal:', { isPreviewOpen, previewProduct });
    if (!isPreviewOpen || !previewProduct) return null;
    console.log('PreviewModal content rendering');

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]" onClick={() => {
        console.log('PreviewModal background clicked, closing modal');
        closePreviewModal();
      }}>
        <div 
          className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
          onClick={(e) => {
            console.log('PreviewModal content clicked, stopping propagation');
            e.stopPropagation();
          }}
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-bold text-black">{previewProduct!.name}</h2>
              <button
                onClick={() => {
                  console.log('PreviewModal close button clicked');
                  closePreviewModal();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Product Image */}
              <div className="relative aspect-square bg-gray-100 rounded-xl">
                {previewProduct.images && previewProduct.images.length > 0 ? (
                  <img
                    src={previewProduct!.images[0].url.startsWith('http') ? previewProduct!.images[0].url : `http://localhost:5000${previewProduct!.images[0].url}`}
                    alt={previewProduct!.name}
                    className="object-cover w-full h-full rounded-xl shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                ) : previewProduct.imageUrl ? (
                  <img
                    src={previewProduct!.imageUrl.startsWith('http') ? previewProduct!.imageUrl : `http://localhost:5000${previewProduct!.imageUrl}`}
                    alt={previewProduct!.name}
                    className="object-cover w-full h-full rounded-xl shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {(previewProduct!.isActive) && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                )}
              </div>
              
              {/* Right side - Product Details */}
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Description</h3>
                  <p className="text-black leading-relaxed text-lg">{previewProduct!.description}</p>
                </div>

                {/* Full Description */}
                {previewProduct!.fullDescription && (
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-4">Full Description</h3>
                    <div className="text-black leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: previewProduct!.fullDescription }} />
                  </div>
                )}

                {/* Product Information */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Product Code:</span>
                      <span className="font-medium text-black">{previewProduct!.productCode}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Category:</span>
                      <span className="font-medium text-black">
                        {categories.find((c: Category) => c.id === previewProduct!.category)?.title || previewProduct!.category}
                      </span>
                    </div>
                    {previewProduct.subCategory && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Sub Category:</span>
                        <span className="font-medium text-black">
                          {subcategories.find((s: Subcategory) => s.id === previewProduct!.subCategory)?.name || previewProduct!.subCategory}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Price:</span>
                      <span className="font-medium text-black">NPR {previewProduct!.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Stock:</span>
                      <span className="font-medium text-black">{previewProduct!.stock}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Status:</span>
                      <span className="font-medium text-black">
                        {previewProduct!.status.charAt(0).toUpperCase() + previewProduct!.status.slice(1)}
                      </span>
                    </div>
                    {previewProduct.metalType && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Metal Type:</span>
                        <span className="font-medium text-black">{previewProduct!.metalType}</span>
                      </div>
                    )}
                    {previewProduct.goldWeight && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Gold Weight:</span>
                        <span className="font-medium text-black">{previewProduct!.goldWeight}</span>
                      </div>
                    )}
                    {previewProduct.otherGemstones && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Other Gemstones:</span>
                        <span className="font-medium text-black">{previewProduct!.otherGemstones}</span>
                      </div>
                    )}
                    {previewProduct.orderDuration && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Order Duration:</span>
                        <span className="font-medium text-black">{previewProduct!.orderDuration}</span>
                      </div>
                    )}
                    {previewProduct.culture && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Culture:</span>
                        <span className="font-medium text-black">{previewProduct!.culture}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gold Details */}
                {(previewProduct.goldWeight || 
                  previewProduct.goldPurity || 
                  previewProduct.goldType || 
                  previewProduct.goldCraftsmanship ||
                  previewProduct.goldDesignDescription ||
                  previewProduct.goldFinishedType ||
                  previewProduct.goldStones ||
                  previewProduct.goldStoneQuality) && (
                  <div className="border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 space-y-3">
                      <h3 className="text-xl font-semibold text-black mb-4">Gold Details</h3>
                      {previewProduct.goldWeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Gold Weight:</span>
                          <span className="font-medium text-black">{previewProduct!.goldWeight}</span>
                        </div>
                      )}
                      {previewProduct.goldPurity && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Gold Purity:</span>
                          <span className="font-medium text-black">{previewProduct!.goldPurity}</span>
                        </div>
                      )}
                      {previewProduct.goldType && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Gold Type:</span>
                          <span className="font-medium text-black">{previewProduct!.goldType}</span>
                        </div>
                      )}
                      {previewProduct.goldCraftsmanship && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Craftsmanship:</span>
                          <span className="font-medium text-black">{previewProduct!.goldCraftsmanship}</span>
                        </div>
                      )}
                      {previewProduct.goldDesignDescription && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Design Description:</span>
                          <span className="font-medium text-black">{previewProduct!.goldDesignDescription}</span>
                        </div>
                      )}
                      {previewProduct.goldFinishedType && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Finished Type:</span>
                          <span className="font-medium text-black">{previewProduct!.goldFinishedType}</span>
                        </div>
                      )}
                      {previewProduct.goldStones && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Stones:</span>
                          <span className="font-medium text-black">{previewProduct!.goldStones}</span>
                        </div>
                      )}
                      {previewProduct.goldStoneQuality && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Stone Quality:</span>
                          <span className="font-medium text-black">{previewProduct!.goldStoneQuality}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Diamond Details */}
                {(previewProduct.diamondDetails || 
                  previewProduct.diamondQuantity !== undefined || 
                  previewProduct.diamondSize || 
                  previewProduct.diamondWeight || 
                  previewProduct.diamondQuality ||
                  previewProduct.stoneWeight ||
                  previewProduct.caret) && (
                  <div className="border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 space-y-3">
                      <h3 className="text-xl font-semibold text-black mb-4">Diamond Details</h3>
                      {previewProduct.diamondDetails && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Diamond Details:</span>
                          <span className="font-medium text-black">{previewProduct!.diamondDetails}</span>
                        </div>
                      )}
                      {previewProduct.diamondQuantity !== undefined && previewProduct.diamondQuantity !== null && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Diamond Quantity:</span>
                          <span className="font-medium text-black">{previewProduct!.diamondQuantity}</span>
                        </div>
                      )}
                      {previewProduct.diamondSize && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Diamond Size:</span>
                          <span className="font-medium text-black">{previewProduct!.diamondSize}</span>
                        </div>
                      )}
                      {previewProduct.diamondWeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Diamond Weight:</span>
                          <span className="font-medium text-black">{previewProduct!.diamondWeight}</span>
                        </div>
                      )}
                      {previewProduct.diamondQuality && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Diamond Quality:</span>
                          <span className="font-medium text-black">{previewProduct!.diamondQuality}</span>
                        </div>
                      )}
                      {previewProduct.stoneWeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Stone Weight:</span>
                          <span className="font-medium text-black">{previewProduct!.stoneWeight}</span>
                        </div>
                      )}
                      {previewProduct.caret && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-black">Caret:</span>
                          <span className="font-medium text-black">{previewProduct!.caret}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Distribution Channels */}
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Distribution Channels</h3>
                  <div className="flex flex-wrap gap-2">
                    {previewProduct!.digitalBrowser && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-black">
                        Digital Browser
                      </span>
                    )}
                    {previewProduct!.website && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-black">
                        Website
                      </span>
                    )}
                    {previewProduct!.distributor && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-black">
                        Distributor
                      </span>
                    )}
                    {!previewProduct.digitalBrowser && !previewProduct.website && !previewProduct.distributor && (
                      <span className="text-sm text-black">No distribution channels selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Product Management</h1>
            <p className="text-black">Manage your jewelry products</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Cards
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Add New Product
            </button>
          </div>
        </div>
          
        {/* Search and Filter */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
                <input
                  type="text"
              placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                />
            </div>
                <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
                </select>
                {/* Status Filter */}
                <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
                </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('all'); // Reset status filter
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
              </div>

        {/* Products List */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-black">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-black">
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
        </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Create your first product to get started</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create First Product
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Bulk Actions Toolbar */}
            {selectedProducts.size > 0 && (
              <div className="bg-purple-50 border-b border-purple-200 px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedProducts(new Set())}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === currentProducts.length && currentProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <React.Fragment key={product.id}>
                      {/* Main Info Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:5000${product.images[0].url}`}
                                  alt={product.name}
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                  }}
                                />
                              ) : product.imageUrl ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                                  alt={product.name}
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">{product.productCode}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {categories.find((c: Category) => c.id === product.category)?.title || product.category}
                          </div>
                          {product.subCategory && (
                            <div className="text-sm text-gray-500">
                              {subcategories.find((s: Subcategory) => s.id === product.subCategory)?.name || product.subCategory}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : product.status === 'inactive' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                      {/* Secondary Info Row */}
                      <tr className="hover:bg-gray-50 bg-gray-50">
                        <td colSpan={3} className="px-6 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {/* Distribution */}
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500">Distribution:</span>
                                <div className="flex space-x-1">
                                  {product.digitalBrowser && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Digital
                                    </span>
                                  )}
                                  {product.website && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Website
                                    </span>
                                  )}
                                  {product.distributor && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      Distributor
                                    </span>
                                  )}
                                  {!product.digitalBrowser && !product.website && !product.distributor && (
                                    <span className="text-xs text-gray-400">None</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Status */}
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-500">Status:</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  product.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : product.status === 'inactive' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleProductExpansion(product.id)}
                                className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                              >
                                <Info className="w-3.5 h-3.5" />
                                {expandedProducts.has(product.id) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                Details
                              </button>
                              <button
                                onClick={() => openPreviewModal(product)}
                                className="flex items-center gap-1 px-3 py-1 text-xs text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                title="Preview Product"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowReviewsFor(showReviewsFor === product.id ? null : product.id);
                                  if (!productReviews[product.id]) {
                                    fetchProductReviews(product.id);
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-xs text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded transition-colors"
                                title="View Reviews"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <Star className="w-3.5 h-3.5" />
                                <span>{productReviews[product.id]?.length || 0}</span>
                              </button>
                              <button
                                onClick={() => openEditModal(product)}
                                className="flex items-center gap-1 px-3 py-1 text-xs text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleToggleStatus(product.id)}
                                className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
                                  product.status === 'active'
                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={product.status === 'active' ? 'Deactivate Product' : 'Activate Product'}
                              >
                                {product.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span>{product.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                              </button>
                              <button
                                onClick={() => openDeleteModal(product)}
                                className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedProducts.has(product.id) && (
                      <tr key={`${product.id}-details`} className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">Product Details</h4>
                              <div className="text-sm text-gray-500">
                                <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                                <span className="mx-2">|</span>
                                <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Basic Information */}
                              <div className="space-y-4">
                                <h5 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Information</h5>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="font-medium text-gray-700">Product Code:</span>
                                    <span className="ml-2 text-gray-900">{product.productCode}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                      product.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : product.status === 'inactive' 
                                          ? 'bg-red-100 text-red-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Price:</span>
                                    <span className="ml-2 text-gray-900">NPR {product.price.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Stock:</span>
                                    <span className="ml-2 text-gray-900">{product.stock}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium text-gray-700">Category:</span>
                                    <span className="ml-2 text-gray-900">
                                      {categories.find((c: Category) => c.id === product.category)?.title || product.category}
                                    </span>
                                    {product.subCategory && (
                                      <span className="ml-2 text-gray-900">
                                        / {subcategories.find((s: Subcategory) => s.id === product.subCategory)?.name || product.subCategory}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Description:</span>
                                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{product.description}</p>
                                </div>
                              </div>
                              
                              {/* Jewelry Details */}
                              <div className="space-y-4">
                                <h5 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Jewelry Details</h5>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  {product.goldWeight && (
                                    <div>
                                      <span className="font-medium text-gray-700">Gold Weight:</span>
                                      <span className="ml-2 text-gray-900">{product.goldWeight}</span>
                                    </div>
                                  )}
                                  {product.diamondDetails && (
                                    <div>
                                      <span className="font-medium text-gray-700">Diamond Details:</span>
                                      <span className="ml-2 text-gray-900">{product.diamondDetails}</span>
                                    </div>
                                  )}
                                  {product.diamondQuantity !== undefined && product.diamondQuantity !== null && (
                                    <div>
                                      <span className="font-medium text-gray-700">Diamond Quantity:</span>
                                      <span className="ml-2 text-gray-900">{product.diamondQuantity}</span>
                                    </div>
                                  )}
                                  {product.diamondSize && (
                                    <div>
                                      <span className="font-medium text-gray-700">Diamond Size:</span>
                                      <span className="ml-2 text-gray-900">{product.diamondSize}</span>
                                    </div>
                                  )}
                                  {product.diamondWeight && (
                                    <div>
                                      <span className="font-medium text-gray-700">Diamond Weight:</span>
                                      <span className="ml-2 text-gray-900">{product.diamondWeight}</span>
                                    </div>
                                  )}
                                  {product.diamondQuality && (
                                    <div>
                                      <span className="font-medium text-gray-700">Diamond Quality:</span>
                                      <span className="ml-2 text-gray-900">{product.diamondQuality}</span>
                                    </div>
                                  )}
                                  {product.otherGemstones && (
                                    <div>
                                      <span className="font-medium text-gray-700">Other Gemstones:</span>
                                      <span className="ml-2 text-gray-900">{product.otherGemstones}</span>
                                    </div>
                                  )}
                                  {product.metalType && (
                                    <div>
                                      <span className="font-medium text-gray-700">Metal Type:</span>
                                      <span className="ml-2 text-gray-900">{product.metalType}</span>
                                    </div>
                                  )}
                                  {product.stoneType && (
                                    <div>
                                      <span className="font-medium text-gray-700">Stone Type:</span>
                                      <span className="ml-2 text-gray-900">{product.stoneType}</span>
                                    </div>
                                  )}
                                  {product.settingType && (
                                    <div>
                                      <span className="font-medium text-gray-700">Setting Type:</span>
                                      <span className="ml-2 text-gray-900">{product.settingType}</span>
                                    </div>
                                  )}
                                  {product.size && (
                                    <div>
                                      <span className="font-medium text-gray-700">Size:</span>
                                      <span className="ml-2 text-gray-900">{product.size}</span>
                                    </div>
                                  )}
                                  {product.color && (
                                    <div>
                                      <span className="font-medium text-gray-700">Color:</span>
                                      <span className="ml-2 text-gray-900">{product.color}</span>
                                    </div>
                                  )}
                                  {product.finish && (
                                    <div>
                                      <span className="font-medium text-gray-700">Finish:</span>
                                      <span className="ml-2 text-gray-900">{product.finish}</span>
                                    </div>
                                  )}
                                  {product.orderDuration && (
                                    <div>
                                      <span className="font-medium text-gray-700">Order Duration:</span>
                                      <span className="ml-2 text-gray-900">{product.orderDuration}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Distribution Channels */}
                              <div className="space-y-4">
                                <h5 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Distribution Channels</h5>
                                
                                <div className="flex flex-wrap gap-2">
                                  {product.digitalBrowser && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                      Digital Browser
                                    </span>
                                  )}
                                  {product.website && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                      Website
                                    </span>
                                  )}
                                  {product.distributor && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                      Distributor
                                    </span>
                                  )}
                                  {!product.digitalBrowser && !product.website && !product.distributor && (
                                    <span className="text-sm text-gray-500">No distribution channels selected</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* SEO Information */}
                              <div className="space-y-4">
                                <h5 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">SEO Information</h5>
                                
                                <div className="space-y-3">
                                  {product.seoTitle && (
                                    <div>
                                      <span className="font-medium text-gray-700">SEO Title:</span>
                                      <p className="mt-1 text-gray-900">{product.seoTitle}</p>
                                    </div>
                                  )}
                                  {product.seoDescription && (
                                    <div>
                                      <span className="font-medium text-gray-700">SEO Description:</span>
                                      <p className="mt-1 text-gray-900">{product.seoDescription}</p>
                                    </div>
                                  )}
                                  {product.seoKeywords && (
                                    <div>
                                      <span className="font-medium text-gray-700">SEO Keywords:</span>
                                      <p className="mt-1 text-gray-900">{product.seoKeywords}</p>
                                    </div>
                                  )}
                                  {product.seoSlug && (
                                    <div>
                                      <span className="font-medium text-gray-700">SEO Slug:</span>
                                      <p className="mt-1 text-gray-900">{product.seoSlug}</p>
                                    </div>
                                  )}
                                  {!product.seoTitle && !product.seoDescription && !product.seoKeywords && !product.seoSlug && (
                                    <p className="text-sm text-gray-500">No SEO information available</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Reviews Dropdown Row */}
                    {showReviewsFor === product.id && (
                      <tr key={`${product.id}-reviews`} className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-gray-900">Product Reviews ({productReviews[product.id]?.length || 0})</h4>
                              <button
                                onClick={() => setShowReviewsFor(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                ×
                              </button>
                            </div>
                            {productReviews[product.id] && productReviews[product.id].length > 0 ? (
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {productReviews[product.id].map((review: any) => (
                                  <div key={review.id} className="border-b border-gray-200 pb-3 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{review.customerName}</span>
                                        <div className="flex items-center gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{review.comment || 'No comment provided'}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No reviews yet</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:5000${product.images[0].url}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : product.imageUrl ? (
                    <img
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : product.status === 'inactive' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.productCode}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-1 mb-4 text-xs text-gray-500">
                    <div><span className="font-medium">Category:</span> {categories.find((c: Category) => c.id === product.category)?.title || product.category}</div>
                    {product.subCategory && (
                      <div><span className="font-medium">Sub Category:</span> {subcategories.find((s: Subcategory) => s.id === product.subCategory)?.name || product.subCategory}</div>
                    )}
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : product.status === 'inactive' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                    <div><span className="font-medium">Price:</span> <span className="text-green-600 font-semibold">${product.price}</span></div>
                    <div><span className="font-medium">Stock:</span> {product.stock}</div>
                    {/* Distribution Channels */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.digitalBrowser && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Digital
                        </span>
                      )}
                      {product.website && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Website
                        </span>
                      )}
                      {product.distributor && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Distributor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openPreviewModal(product)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`text-sm font-medium transition-colors ${
                          product.status === 'active'
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {product.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
        )}

        {/* Pagination Controls */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Product Form Modal */}
        <ProductForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          editingProduct={editingProduct}
          onSuccess={fetchProducts}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirm.isOpen && deleteConfirm.product && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={closeDeleteModal}></div>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-50">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Product{selectedProducts.size > 0 && selectedProducts.size > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Are you sure you want to delete <strong>{deleteConfirm.product.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isPreviewOpen && previewProduct && <ProductPreviewModal isOpen={isPreviewOpen} onClose={() => { setIsPreviewOpen(false); setPreviewProduct(null); }} product={previewProduct} categories={categories} subcategories={subcategories} />}
      </div>
    </DashboardLayout>
  );
}