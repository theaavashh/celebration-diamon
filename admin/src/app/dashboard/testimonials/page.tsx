"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiService } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { Star, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialSettings, setTestimonialSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [formData, setFormData] = useState({
    clientName: '',
    clientTitle: '',
    company: '',
    content: '',
    rating: '',
    imageUrl: '',
    sortOrder: 0,
    isActive: true
  });

  // Settings form state
  const [settingsFormData, setSettingsFormData] = useState({
    title: '',
    subtitle: '',
    isActive: true
  });

  // Memoized filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(testimonial => {
      const matchesSearch = 
        testimonial.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (testimonial.clientTitle && testimonial.clientTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (testimonial.company && testimonial.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && testimonial.isActive) ||
                           (statusFilter === 'inactive' && !testimonial.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchTerm, statusFilter]);

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get('/testimonials/admin/all');
      
      if (response.success && response.data) {
        setTestimonials(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch testimonials');
      }
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch testimonials';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch testimonial settings
  const fetchTestimonialSettings = useCallback(async () => {
    try {
      const response = await apiService.get('/testimonial-settings/admin');
      
      if (response.success && response.data) {
        setTestimonialSettings(response.data);
        setSettingsFormData({
          title: response.data.title || '',
          subtitle: response.data.subtitle || '',
          isActive: response.data.isActive
        });
      }
    } catch (error) {
      console.error('Error fetching testimonial settings:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTestimonials();
    fetchTestimonialSettings();
  }, [fetchTestimonials, fetchTestimonialSettings]);

  // Handle settings form submission
  const handleSettingsSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settingsFormData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await apiService.put('/testimonial-settings/admin', settingsFormData);
      
      if (response.success) {
        setTestimonialSettings(response.data);
        toast.success('Testimonial settings updated successfully!');
      } else {
        throw new Error(response.error || 'Failed to update testimonial settings');
      }
    } catch (error: any) {
      console.error('Error saving testimonial settings:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save testimonial settings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [settingsFormData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName.trim() || !formData.content.trim()) {
      toast.error('Client name and content are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const testimonialData = {
        clientName: formData.clientName.trim(),
        clientTitle: formData.clientTitle.trim() || null,
        company: formData.company.trim() || null,
        content: formData.content.trim(),
        rating: formData.rating ? parseInt(formData.rating) : null,
        imageUrl: formData.imageUrl.trim() || null,
        sortOrder: parseInt(formData.sortOrder.toString()) || 0,
        isActive: formData.isActive
      };

      let response;
      if (editingTestimonial) {
        response = await apiService.put(`/testimonials/${editingTestimonial.id}`, testimonialData);
        toast.success('Testimonial updated successfully');
      } else {
        response = await apiService.post('/testimonials', testimonialData);
        toast.success('Testimonial created successfully');
      }

      if (response.success) {
        await fetchTestimonials();
        setShowForm(false);
        setEditingTestimonial(null);
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to save testimonial');
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save testimonial';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingTestimonial, fetchTestimonials]);

  // Handle edit
  const handleEdit = useCallback((testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName,
      clientTitle: testimonial.clientTitle || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating?.toString() || '',
      imageUrl: testimonial.imageUrl || '',
      sortOrder: testimonial.sortOrder,
      isActive: testimonial.isActive
    });
    setShowForm(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await apiService.delete(`/testimonials/${id}`);
      
      if (response.success) {
        toast.success('Testimonial deleted successfully');
        await fetchTestimonials();
      } else {
        throw new Error(response.error || 'Failed to delete testimonial');
      }
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete testimonial';
      toast.error(errorMessage);
    }
  }, [fetchTestimonials]);

  // Handle toggle status
  const handleToggleStatus = useCallback(async (id: string) => {
    try {
      const response = await apiService.patch(`/testimonials/${id}/toggle-status`);
      
      if (response.success) {
        toast.success(`Testimonial ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
        await fetchTestimonials();
      } else {
        throw new Error(response.error || 'Failed to toggle testimonial status');
      }
    } catch (error: any) {
      console.error('Error toggling testimonial status:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to toggle testimonial status';
      toast.error(errorMessage);
    }
  }, [fetchTestimonials]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      clientName: '',
      clientTitle: '',
      company: '',
      content: '',
      rating: '',
      imageUrl: '',
      sortOrder: 0,
      isActive: true
    });
  }, []);

  // Handle form cancel
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingTestimonial(null);
    resetForm();
  }, [resetForm]);

  // Render star rating
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Testimonials</h1>
            <p className="text-gray-600">Manage client testimonials</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Testimonial Settings Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Testimonial Section Settings</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={settingsFormData.title}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                  placeholder="Enter testimonial section title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={settingsFormData.subtitle}
                  onChange={(e) => setSettingsFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                  placeholder="Enter testimonial section subtitle"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="settingsIsActive"
                checked={settingsFormData.isActive}
                onChange={(e) => setSettingsFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="settingsIsActive" className="ml-2 block text-sm text-black">
                Show testimonials section on frontend
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
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
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                      placeholder="Enter client name"
                      required
                    />
                  </div>

                  {/* Client Title */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Client Title
                    </label>
                    <input
                      type="text"
                      value={formData.clientTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                      placeholder="e.g., CEO, Manager"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                      placeholder="Company name"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Rating (1-5)
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    >
                      <option value="">No rating</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Testimonial Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    placeholder="Enter testimonial content..."
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                      min="0"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-black">
                      Active (visible to users)
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingTestimonial ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading testimonials...</p>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm || statusFilter !== 'all' ? 'No testimonials found' : 'No testimonials yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first testimonial.'
              }
            </p>
          </div>
        ) : (
          !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Testimonial Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {testimonial.clientName}
                        </h3>
                        {testimonial.clientTitle && (
                          <p className="text-sm text-gray-600 mb-1">
                            {testimonial.clientTitle}
                          </p>
                        )}
                        {testimonial.company && (
                          <p className="text-sm text-gray-500 mb-2">
                            {testimonial.company}
                          </p>
                        )}
                        {renderStars(testimonial.rating)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleStatus(testimonial.id)}
                          className={`p-1 rounded ${
                            testimonial.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          } transition-colors`}
                          title={testimonial.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {testimonial.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm line-clamp-4">
                        "{testimonial.content}"
                      </p>
                    </div>

                    {/* Testimonial Image */}
                    {testimonial.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={testimonial.imageUrl.startsWith('http') ? testimonial.imageUrl : `http://localhost:5000${testimonial.imageUrl}`}
                          alt={testimonial.clientName}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span>Order: {testimonial.sortOrder}</span>
                        <span>
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
