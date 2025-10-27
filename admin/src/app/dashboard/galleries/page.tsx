"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Gallery } from '@/types';
import GalleryForm from '@/components/GalleryForm';
import DashboardLayout from '@/components/DashboardLayout';
import { galleryApi, type ApiResponse } from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Memoized filtered galleries
  const filteredGalleries = useMemo(() => {
    return galleries.filter(gallery => {
      const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gallery.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && gallery.isActive) ||
                           (statusFilter === 'inactive' && !gallery.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [galleries, searchTerm, statusFilter]);

  // Fetch galleries with error handling
  const fetchGalleries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse<Gallery[]> = await galleryApi.getGalleriesAdmin();
      
      if (response.success && response.data) {
        setGalleries(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch galleries');
      }
    } catch (error: any) {
      console.error('Error fetching galleries:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch galleries';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // Handle save with optimistic updates
  const handleSave = useCallback(async (galleryData: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let response: ApiResponse<Gallery>;
      
      if (editingGallery) {
        // Update existing gallery
        response = await galleryApi.updateGallery(editingGallery.id, galleryData);
      } else {
        // Create new gallery
        response = await galleryApi.createGallery(galleryData);
      }

      if (response.success && response.data) {
        const updatedGallery = response.data;
        
        if (editingGallery) {
          // Update existing gallery in state
          setGalleries(prev => prev.map(gallery => 
            gallery.id === editingGallery.id ? updatedGallery : gallery
          ));
          toast.success('Gallery updated successfully');
        } else {
          // Add new gallery to state
          setGalleries(prev => [updatedGallery, ...prev]);
          toast.success('Gallery created successfully');
        }

        setShowForm(false);
        setEditingGallery(null);
      } else {
        throw new Error(response.error || `Failed to ${editingGallery ? 'update' : 'create'} gallery`);
      }
    } catch (error: any) {
      console.error('Error saving gallery:', error);
      const errorMessage = error.response?.data?.error || error.message || `Failed to ${editingGallery ? 'update' : 'create'} gallery`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingGallery]);

  // Handle edit
  const handleEdit = useCallback((gallery: Gallery) => {
    setEditingGallery(gallery);
    setShowForm(true);
  }, []);

  // Handle delete with confirmation
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      
      const response: ApiResponse<void> = await galleryApi.deleteGallery(id);
      
      if (response.success) {
        setGalleries(prev => prev.filter(gallery => gallery.id !== id));
        toast.success('Gallery deleted successfully');
      } else {
        throw new Error(response.error || 'Failed to delete gallery');
      }
    } catch (error: any) {
      console.error('Error deleting gallery:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete gallery';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Handle toggle status
  const handleToggleStatus = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const response: ApiResponse<Gallery> = await galleryApi.toggleGalleryStatus(id);
      
      if (response.success && response.data) {
        const updatedGallery = response.data;
        setGalleries(prev => prev.map(gallery => 
          gallery.id === id ? updatedGallery : gallery
        ));
        
        toast.success(`Gallery ${updatedGallery.isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error(response.error || 'Failed to toggle gallery status');
      }
    } catch (error: any) {
      console.error('Error toggling gallery status:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to toggle gallery status';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingGallery(null);
  }, []);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Gallery Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gallery Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600">Manage gallery collections and items</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Gallery
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
              <GalleryForm
                gallery={editingGallery}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Galleries Grid */}
        {filteredGalleries.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm || statusFilter !== 'all' ? 'No galleries found' : 'No galleries yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first gallery collection.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Gallery
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Title and Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {gallery.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {gallery.subtitle}
                    </p>
                  </div>

                  {/* Gallery Items Preview */}
                  {gallery.galleryItems && gallery.galleryItems.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Gallery Items:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {gallery.galleryItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 text-sm">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Gallery item image failed to load:', item.imageUrl);
                                  console.error('Constructed URL:', item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`);
                                  // Show a simple placeholder div instead of trying another image
                                  const img = e.target as HTMLImageElement;
                                  img.style.display = 'none';
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs';
                                  placeholder.textContent = 'No Image';
                                  img.parentNode?.appendChild(placeholder);
                                }}
                                onLoad={() => console.log('Gallery item image loaded successfully:', item.imageUrl)}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{item.title}</div>
                              {item.description && (
                                <div className="text-gray-500 text-xs line-clamp-1">{item.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                        {gallery.galleryItems.length > 3 && (
                          <div className="text-xs text-gray-500 ml-15">
                            +{gallery.galleryItems.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status and Order */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        gallery.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {gallery.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {gallery.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(gallery)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(gallery.id)}
                        className={`text-sm font-medium ${
                          gallery.isActive
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {gallery.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(gallery.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(gallery.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}






