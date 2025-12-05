'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService } from '@/lib/apiClient';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Link,
  Palette,
  Type,
  Settings,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Hash,
  Percent
} from 'lucide-react';

interface MidBanner {
  id: string;
  title: string;
  description: string | null;
  text: string;
  linkText: string | null;
  linkUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  // Mid banner specific fields
  leftImage: string | null;
  rightImage: string | null;
  leftImageHeight: number;
  rightImageHeight: number;
}

export default function MidBannersPage() {
  const [banners, setBanners] = useState<MidBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<MidBanner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<MidBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    text: '',
    linkText: '',
    linkUrl: '',
    backgroundColor: '#f4f4f9', // Default light gray color
    textColor: '#000000',
    isActive: true,
    priority: 0,
    startDate: '',
    endDate: '',
    leftImage: '',
    rightImage: '',
    leftImageHeight: 200,
    rightImageHeight: 300
  });

  // Fetch banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<MidBanner[]>('/api/mid-banners/admin/all');
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching mid banners:', error);
      toast.error('Failed to fetch mid banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setBannerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open modal for creating new banner
  const openCreateModal = () => {
    setBannerForm({
      title: '',
      description: '',
      text: '',
      linkText: '',
      linkUrl: '',
      backgroundColor: '#f4f4f9',
      textColor: '#000000',
      isActive: true,
      priority: 0,
      startDate: '',
      endDate: '',
      leftImage: '',
      rightImage: '',
      leftImageHeight: 200,
      rightImageHeight: 300
    });
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  // Open modal for editing banner
  const openEditModal = (banner: MidBanner) => {
    setBannerForm({
      title: banner.title,
      description: banner.description || '',
      text: banner.text,
      linkText: banner.linkText || '',
      linkUrl: banner.linkUrl || '',
      backgroundColor: banner.backgroundColor || '#f4f4f9',
      textColor: banner.textColor || '#000000',
      isActive: banner.isActive,
      priority: banner.priority,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      leftImage: banner.leftImage || '',
      rightImage: banner.rightImage || '',
      leftImageHeight: banner.leftImageHeight || 200,
      rightImageHeight: banner.rightImageHeight || 300
    });
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const formData = {
        ...bannerForm,
        startDate: bannerForm.startDate ? new Date(bannerForm.startDate).toISOString() : null,
        endDate: bannerForm.endDate ? new Date(bannerForm.endDate).toISOString() : null,
        isActive: Boolean(bannerForm.isActive),
        priority: Number(bannerForm.priority) || 0,
        leftImageHeight: Number(bannerForm.leftImageHeight) || 200,
        rightImageHeight: Number(bannerForm.rightImageHeight) || 300
      };

      if (editingBanner) {
        await apiService.put<MidBanner>(`/api/mid-banners/${editingBanner.id}`, formData);
        toast.success('Mid banner updated successfully!');
      } else {
        await apiService.post<MidBanner>('/api/mid-banners', formData);
        toast.success('Mid banner created successfully!');
      }

      fetchBanners();
      setIsModalOpen(false);
      setEditingBanner(null);
    } catch (error: any) {
      console.error('Error saving mid banner:', error);
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) => err.msg).join(', ');
          toast.error(`Validation error: ${errorMessages}`);
        } else {
          toast.error(errorData.message || 'Validation failed');
        }
      } else {
        toast.error('Failed to save mid banner');
      }
    }
  };

  // Handle delete
  const handleDeleteClick = (banner: MidBanner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await apiService.delete(`/api/mid-banners/${bannerToDelete.id}`);
      toast.success('Mid banner deleted successfully!');
      fetchBanners();
      setShowDeleteModal(false);
      setBannerToDelete(null);
    } catch (error) {
      console.error('Error deleting mid banner:', error);
      toast.error('Failed to delete mid banner');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await apiService.patch<MidBanner>(`/api/mid-banners/${id}/toggle`);
      toast.success('Mid banner status updated!');
      fetchBanners();
    } catch (error) {
      console.error('Error toggling mid banner status:', error);
      toast.error('Failed to update mid banner status');
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString();
  };

  // Check if banner is active based on dates
  const isBannerCurrentlyActive = (banner: MidBanner) => {
    if (!banner.isActive) return false;
    
    const now = new Date();
    const start = banner.startDate ? new Date(banner.startDate) : null;
    const end = banner.endDate ? new Date(banner.endDate) : null;
    
    if (start && now < start) return false;
    if (end && now > end) return false;
    
    return true;
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Mid Banners</h1>
            <p className="text-black">Manage your website's mid-section promotional banners</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Banner
          </button>
        </div>

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading mid banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center text-black">
              <p>No mid banners found. Create your first mid banner to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {banner.title}
                        </div>
                        {banner.description && (
                          <div className="text-sm text-gray-500">
                            {banner.description.length > 30 ? `${banner.description.substring(0, 30)}...` : banner.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {banner.text}
                        </div>
                        {banner.linkText && (
                          <div className="text-sm text-blue-600 flex items-center gap-1">
                            <Link className="w-4 h-4" />
                            {banner.linkText}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {banner.leftImage && (
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={banner.leftImage} 
                                alt="Left" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.png';
                                }}
                              />
                            </div>
                          )}
                          {banner.rightImage && (
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={banner.rightImage} 
                                alt="Right" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.png';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isBannerCurrentlyActive(banner) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {isBannerCurrentlyActive(banner) ? 'Active' : 'Inactive'}
                          </span>
                          {!banner.isActive && (
                            <span className="text-xs text-gray-500">Manually disabled</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {banner.startDate ? formatDate(banner.startDate) : 'No start date'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {banner.endDate ? formatDate(banner.endDate) : 'No end date'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {banner.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleStatus(banner.id)}
                            className={`p-2 rounded-full ${
                              banner.isActive 
                                ? 'text-green-600 hover:bg-green-100' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={banner.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditModal(banner)}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(banner)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  {editingBanner ? 'Edit Mid Banner' : 'Create Mid Banner'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        placeholder="Enter banner title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={bannerForm.priority}
                        onChange={(e) => handleFormChange('priority', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Text */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Banner Content</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Main Text *
                      </label>
                      <textarea
                        value={bannerForm.text}
                        onChange={(e) => handleFormChange('text', e.target.value)}
                        placeholder="Enter main banner text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Description
                      </label>
                      <textarea
                        value={bannerForm.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        placeholder="Enter banner description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Left Image URL
                      </label>
                      <input
                        type="text"
                        value={bannerForm.leftImage}
                        onChange={(e) => handleFormChange('leftImage', e.target.value)}
                        placeholder="Enter left image URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-black mb-2">
                          Left Image Height (px)
                        </label>
                        <input
                          type="number"
                          value={bannerForm.leftImageHeight}
                          onChange={(e) => handleFormChange('leftImageHeight', parseInt(e.target.value) || 200)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          min="50"
                          max="1000"
                        />
                      </div>
                      {bannerForm.leftImage && (
                        <div className="mt-3">
                          <img 
                            src={bannerForm.leftImage} 
                            alt="Left preview" 
                            className="w-full h-32 object-cover rounded border border-gray-300"
                            style={{ height: `${bannerForm.leftImageHeight}px` }}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.png';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Right Image URL
                      </label>
                      <input
                        type="text"
                        value={bannerForm.rightImage}
                        onChange={(e) => handleFormChange('rightImage', e.target.value)}
                        placeholder="Enter right image URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-black mb-2">
                          Right Image Height (px)
                        </label>
                        <input
                          type="number"
                          value={bannerForm.rightImageHeight}
                          onChange={(e) => handleFormChange('rightImageHeight', parseInt(e.target.value) || 300)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          min="50"
                          max="1000"
                        />
                      </div>
                      {bannerForm.rightImage && (
                        <div className="mt-3">
                          <img 
                            src={bannerForm.rightImage} 
                            alt="Right preview" 
                            className="w-full h-32 object-cover rounded border border-gray-300"
                            style={{ height: `${bannerForm.rightImageHeight}px` }}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.png';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Link */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Link</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Link Text
                      </label>
                      <input
                        type="text"
                        value={bannerForm.linkText}
                        onChange={(e) => handleFormChange('linkText', e.target.value)}
                        placeholder="e.g., Shop Now, Learn More"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={bannerForm.linkUrl}
                        onChange={(e) => handleFormChange('linkUrl', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bannerForm.backgroundColor}
                          onChange={(e) => handleFormChange('backgroundColor', e.target.value)}
                          className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={bannerForm.backgroundColor}
                          onChange={(e) => handleFormChange('backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bannerForm.textColor}
                          onChange={(e) => handleFormChange('textColor', e.target.value)}
                          className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={bannerForm.textColor}
                          onChange={(e) => handleFormChange('textColor', e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={bannerForm.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={bannerForm.endDate}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
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
                  <label htmlFor="isActive" className="ml-2 block text-sm text-black">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-black">Confirm Deletion</h2>
              </div>

              <p className="text-black mb-6">
                Are you sure you want to delete the mid banner "{bannerToDelete?.title}"? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBannerToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}