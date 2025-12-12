'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'react-hot-toast';
import { apiService } from '@/lib/apiClient';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });


  // Memoized filtered FAQs
  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const search = searchTerm.toLowerCase();
      return (
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search)
      );
    });
  }, [faqs, searchTerm]);

  // Fetch FAQs
  const fetchFAQs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get<FAQ[]>('/faqs/admin');
      setFaqs(response.data ?? []);
    } catch (error: unknown) {
      console.error('Error fetching FAQs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch FAQs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = editingFAQ
        ? await apiService.put(`/faqs/${editingFAQ.id}`, formData)
        : await apiService.post('/faqs', formData);

      if (response.success) {
        toast.success(editingFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!');
        setShowForm(false);
        setEditingFAQ(null);
        resetForm();
        fetchFAQs();
      } else {
        throw new Error(response.error || 'Failed to save FAQ');
      }
    } catch (error: unknown) {
      console.error('Error saving FAQ:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save FAQ';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingFAQ, fetchFAQs]);

  // Handle edit
  const handleEdit = useCallback((faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer
    });
    setShowForm(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const response = await apiService.delete(`/faqs/${id}`);
      
      if (response.success) {
        toast.success('FAQ deleted successfully!');
        fetchFAQs();
      } else {
        throw new Error(response.error || 'Failed to delete FAQ');
      }
    } catch (error: unknown) {
      console.error('Error deleting FAQ:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete FAQ';
      toast.error(errorMessage);
    }
  }, [fetchFAQs]);

  

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      question: '',
      answer: ''
    });
  }, []);

  // Handle form cancel
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingFAQ(null);
    resetForm();
  }, [resetForm]);

  if (loading) {
    return (
      <DashboardLayout showBreadcrumb={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading FAQs...</div>
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
            <h1 className="text-2xl font-bold text-black">FAQs</h1>
            <p className="text-gray-600">Manage frequently asked questions</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
            />
          </div>
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-black">
                  {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Question */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black mb-2">
                      Question *
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                      placeholder="Enter FAQ question"
                      required
                    />
                  </div>

                  
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Answer *
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    placeholder="Enter FAQ answer"
                    required
                  />
                </div>

                

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Create FAQ')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-black">FAQs ({filteredFAQs.length})</h3>
          </div>
          
          {filteredFAQs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No FAQs found. {searchTerm ? 'Try adjusting your filters.' : 'Click "Add FAQ" to get started.'}
          </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFAQs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-black">{faq.question}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(faq)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
      </div>
    </DashboardLayout>
  );
}
