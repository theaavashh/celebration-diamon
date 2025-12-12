'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { getApiBaseUrl } from '@/lib/api';
import { Save, Eye, EyeOff, Plus, Edit, Trash2, X } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, handleAuthError } from '@/lib/apiClient';

interface TermsAndConditions {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TermsPage() {
  const [terms, setTerms] = useState<TermsAndConditions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerms, setEditingTerms] = useState<TermsAndConditions | null>(null);
  const [termsForm, setTermsForm] = useState({
    title: 'Terms & Conditions',
    content: '',
    isActive: true
  });

  // Fetch terms
  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const res = await apiGet<TermsAndConditions[]>(`${getApiBaseUrl()}/terms/admin/all`);
      if (res.success) {
        setTerms(res.data || []);
      } else {
        if (!handleAuthError(res.message)) {
          toast.error('Failed to fetch terms and conditions');
        }
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      toast.error('Failed to fetch terms and conditions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setTermsForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form when modal opens
  const openModal = () => {
    setTermsForm({
      title: 'Terms & Conditions',
      content: '',
      isActive: true
    });
    setEditingTerms(null);
    setIsModalOpen(true);
  };

  // Open edit modal with terms data
  const openEditModal = (termsItem: TermsAndConditions) => {
    setTermsForm({
      title: termsItem.title,
      content: termsItem.content,
      isActive: termsItem.isActive
    });
    setEditingTerms(termsItem);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsForm.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      const apiBaseUrl = getApiBaseUrl();
      const url = editingTerms
        ? `${apiBaseUrl}/terms/admin/${editingTerms.id}`
        : `${apiBaseUrl}/terms/admin`;

      const res = editingTerms ? await apiPut(url, termsForm) : await apiPost(url, termsForm);
      if (res.success) {
        toast.success(editingTerms ? 'Terms updated successfully' : 'Terms created successfully');
        setIsModalOpen(false);
        fetchTerms();
      } else {
        if (!handleAuthError(res.message)) {
          toast.error(res.message || 'Failed to save terms');
        }
      }
    } catch (error) {
      console.error('Error saving terms:', error);
      toast.error('Failed to save terms and conditions');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this terms and conditions?')) {
      return;
    }

    try {
      const res = await apiDelete(`${getApiBaseUrl()}/terms/admin/${id}`);
      if (res.success) {
        toast.success('Terms deleted successfully');
        fetchTerms();
      } else {
        if (!handleAuthError(res.message)) {
          toast.error('Failed to delete terms');
        }
      }
    } catch (error) {
      console.error('Error deleting terms:', error);
      toast.error('Failed to delete terms and conditions');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      const termsItem = terms.find(t => t.id === id);
      if (!termsItem) return;

      const res = await apiPut(`${getApiBaseUrl()}/terms/admin/${id}`, {
        ...termsItem,
        isActive: !termsItem.isActive
      });
      if (res.success) {
        toast.success('Status updated successfully');
        fetchTerms();
      } else {
        if (!handleAuthError(res.message)) {
          toast.error('Failed to update status');
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout title="Terms & Conditions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
            <p className="text-gray-600 mt-1">Manage your terms and conditions content</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        {/* Terms List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading terms...</p>
          </div>
        ) : terms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No terms and conditions found</p>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Terms & Conditions
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {terms.map((termsItem) => (
              <div
                key={termsItem.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{termsItem.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          termsItem.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {termsItem.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Last updated: {new Date(termsItem.updatedAt).toLocaleDateString()}
                      </div>

                      {/* Content Preview */}
                      <div 
                        className="prose prose-sm max-w-none text-gray-700 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: termsItem.content.substring(0, 200) + '...' }}
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(termsItem.id)}
                        className={`p-2 rounded-lg ${
                          termsItem.isActive 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={termsItem.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {termsItem.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(termsItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(termsItem.id)}
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
                    {editingTerms ? 'Edit Terms & Conditions' : 'Create New Terms & Conditions'}
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
                      value={termsForm.title}
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
                      value={termsForm.content}
                      onChange={(value) => handleFormChange('content', value)}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={termsForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active (Only one active terms will be displayed on the frontend)
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
                    {editingTerms ? 'Update' : 'Create'}
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
