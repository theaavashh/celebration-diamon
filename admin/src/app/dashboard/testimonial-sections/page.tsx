'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw, Plus } from 'lucide-react';
import { apiService, type ApiResponse } from '@/lib/apiClient';
import DashboardLayout from '@/components/DashboardLayout';

interface TestimonialSection {
  id: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialSectionFormData {
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
}

const TestimonialSectionsPage: React.FC = () => {
  const [sections, setSections] = useState<TestimonialSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<TestimonialSection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState<TestimonialSectionFormData>({
    title: '',
    subtitle: '',
    isActive: true,
    sortOrder: 0
  });

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      subtitle: '',
      isActive: true,
      sortOrder: 0
    });
  }, []);

  // Fetch testimonial sections
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse<TestimonialSection[]> = await apiService.get('/testimonial-sections/admin/all');
      
      if (response.success && response.data) {
        setSections(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch testimonial sections');
      }
    } catch (error) {
      console.error('Error fetching testimonial sections:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch testimonial sections');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (editingSection) {
        // Update existing section
        const response: ApiResponse<TestimonialSection> = await apiService.put(`/testimonial-sections/${editingSection.id}`, formData);
        
        if (response.success && response.data) {
          setSections(prev => prev.map(section => 
            section.id === editingSection.id ? response.data as TestimonialSection : section
          ));
          setShowForm(false);
          setEditingSection(null);
          resetForm();
        } else {
          throw new Error(response.error || 'Failed to update testimonial section');
        }
      } else {
        // Create new section
        const response: ApiResponse<TestimonialSection> = await apiService.post('/testimonial-sections', formData);
        
        if (response.success && response.data) {
          setSections(prev => [...prev, response.data as TestimonialSection]);
          setShowForm(false);
          resetForm();
        } else {
          throw new Error(response.error || 'Failed to create testimonial section');
        }
      }
    } catch (error) {
      console.error('Error saving testimonial section:', error);
      setError(error instanceof Error ? error.message : 'Failed to save testimonial section');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial section?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<void> = await apiService.delete(`/testimonial-sections/${id}`);
      
      if (response.success) {
        setSections(prev => prev.filter(section => section.id !== id));
      } else {
        throw new Error(response.error || 'Failed to delete testimonial section');
      }
    } catch (error) {
      console.error('Error deleting testimonial section:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete testimonial section');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<TestimonialSection> = await apiService.patch(`/testimonial-sections/${id}/toggle-status`);
      
      if (response.success && response.data) {
        setSections(prev => prev.map(section => 
          section.id === id ? response.data as TestimonialSection : section
        ));
      } else {
        throw new Error(response.error || 'Failed to toggle testimonial section status');
      }
    } catch (error) {
      console.error('Error toggling testimonial section status:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle testimonial section status');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (section: TestimonialSection) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      subtitle: section.subtitle || '',
      isActive: section.isActive,
      sortOrder: section.sortOrder
    });
    setShowForm(true);
  };

  // Handle form cancel
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingSection(null);
    resetForm();
  }, [resetForm]);

  // Filter sections
  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (section.subtitle && section.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && section.isActive) ||
                         (statusFilter === 'inactive' && !section.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Load data on component mount
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  if (loading && sections.length === 0) {
    return (
      <DashboardLayout showBreadcrumb={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading testimonial sections...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Testimonial Sections</h1>
            <p className="text-gray-600">Manage testimonial sections with headings and sub-headings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search sections..."
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

        {/* Sections Grid */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm || statusFilter !== 'all' ? 'No sections found' : 'No testimonial sections yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first testimonial section.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Section
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map((section) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{section.title}</h3>
                      {section.subtitle && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{section.subtitle}</p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        section.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {section.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>Order: {section.sortOrder}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(section.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(section.id)}
                      className={`text-sm font-medium ${
                        section.isActive
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-green-600 hover:text-green-700'
                      }`}
                    >
                      {section.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter section title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter section subtitle (optional)"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingSection ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TestimonialSectionsPage;