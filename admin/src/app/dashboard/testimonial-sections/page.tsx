'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { apiService } from '@/lib/apiClient';
import DashboardLayout from '@/components/DashboardLayout';

interface TestimonialSettings {
  id: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialSettingsFormData {
  title: string;
  subtitle: string;
  isActive: boolean;
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
    heading: '',
    subHeading: '',
    isActive: true,
    sortOrder: 0
  });

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      heading: '',
      subHeading: '',
      isActive: true,
      sortOrder: 0
    });
  }, []);

  // Fetch testimonial sections
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get('/testimonial-sections/admin/all');
      
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
        const response = await apiService.put(`/testimonial-sections/${editingSection.id}`, formData);
        
        if (response.success) {
          setSections(prev => prev.map(section => 
            section.id === editingSection.id ? response.data : section
          ));
          setShowForm(false);
          setEditingSection(null);
          resetForm();
        } else {
          throw new Error(response.error || 'Failed to update testimonial section');
        }
      } else {
        // Create new section
        const response = await apiService.post('/testimonial-sections', formData);
        
        if (response.success) {
          setSections(prev => [...prev, response.data]);
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

      const response = await apiService.delete(`/testimonial-sections/${id}`);
      
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

      const response = await apiService.patch(`/testimonial-sections/${id}/toggle-status`);
      
      if (response.success) {
        setSections(prev => prev.map(section => 
          section.id === id ? response.data : section
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
      heading: section.heading,
      subHeading: section.subHeading || '',
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
    const matchesSearch = section.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (section.subHeading && section.subHeading.toLowerCase().includes(searchTerm.toLowerCase()));
    
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

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search sections..."
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-black mb-4">
                {editingSection ? 'Edit Testimonial Section' : 'Add New Testimonial Section'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Heading *
                  </label>
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    placeholder="Section heading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sub-heading
                  </label>
                  <input
                    type="text"
                    value={formData.subHeading}
                    onChange={(e) => setFormData(prev => ({ ...prev, subHeading: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    placeholder="Section sub-heading"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-black">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : (editingSection ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sections Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heading
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-heading
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testimonials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sort Order
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
              {filteredSections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No testimonial sections found
                  </td>
                </tr>
              ) : (
                filteredSections.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{section.heading}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{section.subHeading || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{section._count?.testimonials || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{section.sortOrder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        section.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {section.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(section.id)}
                        className={section.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                      >
                        {section.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestimonialSectionsPage;