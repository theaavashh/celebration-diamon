"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { HelpCenter } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete, handleAuthError } from '@/lib/apiClient';

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

  const fetchHelpCenters = async () => {
    setIsLoading(true);
    try {
      const result = await apiGet<HelpCenter[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/all`);
      
      if (result.success) {
        setHelpCenters(result.data || []);
      } else {
        if (result.message === 'Access denied. No token provided.' || result.message?.includes('Session expired')) {
          toast.error('Session expired. Please log in again.');
          // Redirect to home page - the AuthContext will handle this
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } else {
          toast.error(result.message || 'Failed to fetch help center');
        }
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
      const url = editingHelpCenter
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/${editingHelpCenter.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin`;

      const result = editingHelpCenter 
        ? await apiPut(url, helpCenterForm)
        : await apiPost(url, helpCenterForm);

      if (result.success) {
        toast.success(editingHelpCenter ? 'Help center updated successfully' : 'Help center created successfully');
        setIsModalOpen(false);
        fetchHelpCenters();
      } else {
        if (result.message === 'Access denied. No token provided.' || result.message?.includes('Session expired')) {
          toast.error('Session expired. Please log in again.');
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } else {
          toast.error(result.message || 'Failed to save help center');
        }
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
      const result = await apiDelete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/${id}`);

      if (result.success) {
        toast.success('Help center deleted successfully');
        fetchHelpCenters();
      } else {
        if (result.message === 'Access denied. No token provided.' || result.message?.includes('Session expired')) {
          toast.error('Session expired. Please log in again.');
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } else {
          toast.error(result.message || 'Failed to delete help center');
        }
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

      const result = await apiPut(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/help-center/admin/${id}`, {
        ...helpCenter,
        isActive: !helpCenter.isActive
      });

      if (result.success) {
        toast.success('Status updated successfully');
        fetchHelpCenters();
      } else {
        if (result.message === 'Access denied. No token provided.' || result.message?.includes('Session expired')) {
          toast.error('Session expired. Please log in again.');
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } else {
          toast.error(result.message || 'Failed to update status');
        }
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
            <p className="mt-1 text-sm text-gray-500">
              Manage your help center content
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Help Center
          </button>
        </div>

        {/* Help Centers Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : helpCenters.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No help centers</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new help center.
              </p>
              <div className="mt-6">
                <button
                  onClick={openModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Help Center
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {helpCenters.map((helpCenter) => (
                <li key={helpCenter.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {helpCenter.title}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpCenter.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {helpCenter.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="truncate">{helpCenter.content.substring(0, 100)}...</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleToggleStatus(helpCenter.id)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full ${helpCenter.isActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {helpCenter.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => openEditModal(helpCenter)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(helpCenter.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingHelpCenter ? 'Edit Help Center' : 'Add Help Center'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={helpCenterForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      rows={6}
                      value={helpCenterForm.content}
                      onChange={(e) => handleFormChange('content', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={helpCenterForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    >
                      {editingHelpCenter ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}