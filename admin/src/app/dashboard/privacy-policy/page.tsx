'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { Save, Eye, EyeOff, Plus, Edit, Trash2, X } from 'lucide-react';

interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PrivacyPolicyPage() {
  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrivacyPolicy, setEditingPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [privacyPolicyForm, setPrivacyPolicyForm] = useState({
    title: 'Privacy Policy',
    content: '',
    isActive: true
  });

  // Fetch privacy policies
  const fetchPrivacyPolicies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/privacy-policy/admin/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrivacyPolicies(data.data || []);
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        console.error('Failed to fetch privacy policies, status:', response.status);
        toast.error('Failed to fetch privacy policy');
      }
    } catch (error) {
      console.error('Error fetching privacy policies:', error);
      toast.error('Failed to fetch privacy policy');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicies();
  }, []);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setPrivacyPolicyForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form when modal opens
  const openModal = () => {
    setPrivacyPolicyForm({
      title: 'Privacy Policy',
      content: '',
      isActive: true
    });
    setEditingPrivacyPolicy(null);
    setIsModalOpen(true);
  };

  // Open edit modal with privacy policy data
  const openEditModal = (privacyPolicy: PrivacyPolicy) => {
    setPrivacyPolicyForm({
      title: privacyPolicy.title,
      content: privacyPolicy.content,
      isActive: privacyPolicy.isActive
    });
    setEditingPrivacyPolicy(privacyPolicy);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyPolicyForm.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const url = editingPrivacyPolicy
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/privacy-policy/admin/${editingPrivacyPolicy.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/privacy-policy/admin`;

      const method = editingPrivacyPolicy ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(privacyPolicyForm)
      });

      if (response.ok) {
        toast.success(editingPrivacyPolicy ? 'Privacy policy updated successfully' : 'Privacy policy created successfully');
        setIsModalOpen(false);
        fetchPrivacyPolicies();
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
        toast.error(errorData.message || 'Failed to save privacy policy');
      }
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      toast.error('Failed to save privacy policy');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this privacy policy?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/privacy-policy/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        toast.success('Privacy policy deleted successfully');
        fetchPrivacyPolicies();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error('Failed to delete privacy policy');
      }
    } catch (error) {
      console.error('Error deleting privacy policy:', error);
      toast.error('Failed to delete privacy policy');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      const privacyPolicy = privacyPolicies.find(p => p.id === id);
      if (!privacyPolicy) return;

      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/privacy-policy/admin/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...privacyPolicy,
          isActive: !privacyPolicy.isActive
        })
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchPrivacyPolicies();
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
    <DashboardLayout title="Privacy Policy">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 mt-1">Manage your privacy policy content</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        {/* Privacy Policies List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading privacy policy...</p>
          </div>
        ) : privacyPolicies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No privacy policy content found</p>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Privacy Policy
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {privacyPolicies.map((privacyPolicy) => (
              <div
                key={privacyPolicy.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{privacyPolicy.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          privacyPolicy.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {privacyPolicy.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Last updated: {new Date(privacyPolicy.updatedAt).toLocaleDateString()}
                      </div>

                      {/* Content Preview */}
                      <div 
                        className="prose prose-sm max-w-none text-gray-700 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: privacyPolicy.content.substring(0, 200) + '...' }}
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(privacyPolicy.id)}
                        className={`p-2 rounded-lg ${
                          privacyPolicy.isActive 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={privacyPolicy.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {privacyPolicy.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(privacyPolicy)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(privacyPolicy.id)}
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
                    {editingPrivacyPolicy ? 'Edit Privacy Policy' : 'Create New Privacy Policy'}
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
                      value={privacyPolicyForm.title}
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
                      value={privacyPolicyForm.content}
                      onChange={(value) => handleFormChange('content', value)}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={privacyPolicyForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active (Only one active privacy policy will be displayed on the frontend)
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
                    {editingPrivacyPolicy ? 'Update' : 'Create'}
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
