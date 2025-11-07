'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { Save, Eye, EyeOff, Plus, Edit, Trash2, X } from 'lucide-react';

interface HelpCenter {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HelpCenterPage() {
  const [helpCenters, setHelpCenters] = useState<HelpCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHelpCenter, setEditingHelpCenter] = useState<HelpCenter | null>(null);
  const [helpCenterForm, setHelpCenterForm] = useState({
    title: 'Help Center',
    content: '',
    isActive: true
  });

  // Fetch help centers
  const fetchHelpCenters = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHelpCenters(data.data || []);
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        console.error('Failed to fetch help centers, status:', response.status);
        toast.error('Failed to fetch help center');
      }
    } catch (error) {
      console.error('Error fetching help centers:', error);
      toast.error('Failed to fetch help center');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpCenters();
  }, []);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setHelpCenterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form when modal opens
  const openModal = () => {
    setHelpCenterForm({
      title: 'Help Center',
      content: '',
      isActive: true
    });
    setEditingHelpCenter(null);
    setIsModalOpen(true);
  };

  // Open edit modal with help center data
  const openEditModal = (helpCenter: HelpCenter) => {
    setHelpCenterForm({
      title: helpCenter.title,
      content: helpCenter.content,
      isActive: helpCenter.isActive
    });
    setEditingHelpCenter(helpCenter);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!helpCenterForm.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const url = editingHelpCenter
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/${editingHelpCenter.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin`;

      const method = editingHelpCenter ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(helpCenterForm)
      });

      if (response.ok) {
        toast.success(editingHelpCenter ? 'Help center updated successfully' : 'Help center created successfully');
        setIsModalOpen(false);
        fetchHelpCenters();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to save help center');
      }
    } catch (error) {
      console.error('Error saving help center:', error);
      toast.error('Failed to save help center');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this help center?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        toast.success('Help center deleted successfully');
        fetchHelpCenters();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error('Failed to delete help center');
      }
    } catch (error) {
      console.error('Error deleting help center:', error);
      toast.error('Failed to delete help center');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      const helpCenter = helpCenters.find(h => h.id === id);
      if (!helpCenter) return;

      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...helpCenter,
          isActive: !helpCenter.isActive
        })
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchHelpCenters();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout title="Help Center">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            <p className="text-gray-600 mt-1">Manage your help center content</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        {/* Help Centers List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading help center...</p>
          </div>
        ) : helpCenters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No help center content found</p>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Help Center
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {helpCenters.map((helpCenter) => (
              <div
                key={helpCenter.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{helpCenter.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          helpCenter.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {helpCenter.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Last updated: {new Date(helpCenter.updatedAt).toLocaleDateString()}
                      </div>

                      {/* Content Preview */}
                      <div 
                        className="prose prose-sm max-w-none text-gray-700 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: helpCenter.content.substring(0, 200) + '...' }}
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(helpCenter.id)}
                        className={`p-2 rounded-lg ${
                          helpCenter.isActive 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={helpCenter.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {helpCenter.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(helpCenter)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(helpCenter.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingHelpCenter ? 'Edit Help Center' : 'Create New Help Center'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={helpCenterForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <RichTextEditor
                      value={helpCenterForm.content}
                      onChange={(value) => handleFormChange('content', value)}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={helpCenterForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active (Only one active help center will be displayed on the frontend)
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {editingHelpCenter ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
