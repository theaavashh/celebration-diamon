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

interface PromotionalBanner {
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
}

export default function PromotionalBannersPage() {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromotionalBanner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<PromotionalBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    text: '',
    linkText: '',
    linkUrl: '',
    backgroundColor: '#ff6b35', // Default orange color
    textColor: '#ffffff',
    isActive: true,
    priority: 0,
    startDate: '',
    endDate: ''
  });

  // Fetch banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<PromotionalBanner[]>('/api/banners/admin/all');
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
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
      backgroundColor: '#ff6b35',
      textColor: '#ffffff',
      isActive: true,
      priority: 0,
      startDate: '',
      endDate: ''
    });
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  // Open modal for editing banner
  const openEditModal = (banner: PromotionalBanner) => {
    setBannerForm({
      title: banner.title,
      description: banner.description || '',
      text: banner.text,
      linkText: banner.linkText || '',
      linkUrl: banner.linkUrl || '',
      backgroundColor: banner.backgroundColor || '#ff6b35',
      textColor: banner.textColor || '#ffffff',
      isActive: banner.isActive,
      priority: banner.priority,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : ''
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
        priority: Number(bannerForm.priority) || 0
      };

      if (editingBanner) {
        await apiService.put<PromotionalBanner>(`/api/banners/${editingBanner.id}`, formData);
        toast.success('Banner updated successfully!');
      } else {
        await apiService.post<PromotionalBanner>('/api/banners', formData);
        toast.success('Banner created successfully!');
      }

      fetchBanners();
      setIsModalOpen(false);
      setEditingBanner(null);
    } catch (error: any) {
      console.error('Error saving banner:', error);
      
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
        toast.error('Failed to save banner');
      }
    }
  };

  // Handle delete
  const handleDeleteClick = (banner: PromotionalBanner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await apiService.delete(`/api/banners/${bannerToDelete.id}`);
      toast.success('Banner deleted successfully!');
      fetchBanners();
      setShowDeleteModal(false);
      setBannerToDelete(null);
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await apiService.patch<PromotionalBanner>(`/api/banners/${id}/toggle`);
      toast.success('Banner status updated!');
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Promotional Banners</h1>
            <p className="text-black">Manage promotional banners and advertisements</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Banner
          </button>
        </div>

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center text-black">
              <p>No banners found. Create your first promotional banner!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Colors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                        <div className="text-sm font-medium text-black">{banner.title}</div>
                        <div className="text-sm text-gray-500">{banner.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black max-w-xs truncate">{banner.text}</div>
                        {banner.linkText && (
                          <div className="text-sm text-blue-600 flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            {banner.linkText}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: banner.backgroundColor || '#ff6b35' }}
                            title={`Background: ${banner.backgroundColor || '#ff6b35'}`}
                          ></div>
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: banner.textColor || '#ffffff' }}
                            title={`Text: ${banner.textColor || '#ffffff'}`}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">{banner.priority}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(banner.id)}
                            className={`p-1 rounded ${
                              banner.isActive 
                                ? 'text-red-600 hover:bg-red-100' 
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={banner.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditModal(banner)}
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(banner)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  {editingBanner ? 'Edit Banner' : 'Create Banner'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="e.g., Summer Sale"
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
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                    <p className="text-xs text-black mt-1">Higher numbers appear first</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    value={bannerForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Optional description for internal use"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Banner Text *
                  </label>
                  <input
                    type="text"
                    value={bannerForm.text}
                    onChange={(e) => handleFormChange('text', e.target.value)}
                    placeholder="e.g., 30% off on all diamonds products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                {/* Link Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={bannerForm.linkText}
                      onChange={(e) => handleFormChange('linkText', e.target.value)}
                      placeholder="e.g., Shop Now"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Link URL
                    </label>
                    <input
                      type="url"
                      value={bannerForm.linkUrl}
                      onChange={(e) => handleFormChange('linkUrl', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>

                {/* Color Settings */}
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
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bannerForm.backgroundColor}
                        onChange={(e) => handleFormChange('backgroundColor', e.target.value)}
                        placeholder="#ff6b35"
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
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bannerForm.textColor}
                        onChange={(e) => handleFormChange('textColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Settings */}
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

                {/* Active Status */}
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

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Preview
                  </label>
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      backgroundColor: bannerForm.backgroundColor,
                      color: bannerForm.textColor
                    }}
                  >
                    <div className="text-lg font-semibold">{bannerForm.text}</div>
                    {bannerForm.linkText && (
                      <div className="mt-2 text-sm underline">{bannerForm.linkText}</div>
                    )}
                  </div>
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
                  disabled={!bannerForm.title.trim() || !bannerForm.text.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && bannerToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Delete Banner</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-black">
                  Are you sure you want to delete the banner <strong>"{bannerToDelete.title}"</strong>?
                </p>
              </div>
              
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
                >
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