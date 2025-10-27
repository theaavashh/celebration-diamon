"use client";

import { useState, useEffect } from 'react';
import { Culture } from '@/types';
import CultureForm from '@/components/CultureForm';
import DashboardLayout from '@/components/DashboardLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function CulturesPage() {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCulture, setEditingCulture] = useState<Culture | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchCultures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/cultures/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cultures');
      }

      const data = await response.json();
      setCultures(data);
    } catch (error) {
      console.error('Error fetching cultures:', error);
      setError('Failed to fetch cultures');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (cultureData: Omit<Culture, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = editingCulture 
        ? `${API_BASE_URL}/api/cultures/${editingCulture.id}`
        : `${API_BASE_URL}/api/cultures`;
      
      const method = editingCulture ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cultureData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCulture ? 'update' : 'create'} culture`);
      }

      const savedCulture = await response.json();
      
      if (editingCulture) {
        setCultures(prev => prev.map(culture => 
          culture.id === editingCulture.id ? savedCulture : culture
        ));
      } else {
        setCultures(prev => [savedCulture, ...prev]);
      }

      setShowForm(false);
      setEditingCulture(null);
    } catch (error) {
      console.error('Error saving culture:', error);
      setError(`Failed to ${editingCulture ? 'update' : 'create'} culture`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (culture: Culture) => {
    setEditingCulture(culture);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this culture?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/cultures/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete culture');
      }

      setCultures(prev => prev.filter(culture => culture.id !== id));
    } catch (error) {
      console.error('Error deleting culture:', error);
      setError('Failed to delete culture');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/cultures/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle culture status');
      }

      const updatedCulture = await response.json();
      setCultures(prev => prev.map(culture => 
        culture.id === id ? updatedCulture : culture
      ));
    } catch (error) {
      console.error('Error toggling culture status:', error);
      setError('Failed to toggle culture status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCulture(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Culture Collection Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Culture Collection Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Culture Collection Management</h1>
            <p className="text-gray-600">Manage Himalayan culture showcases and collections</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Culture
          </button>
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
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <CultureForm
                culture={editingCulture}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Cultures Grid */}
        {cultures.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No cultures yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first culture showcase.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Culture
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cultures.map((culture) => (
              <div
                key={culture.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                {culture.imageUrl && (
                  <div className="h-64 bg-gray-200 relative">
                    <img
                      src={culture.imageUrl}
                      alt={culture.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Culture name overlay */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">{culture.name}</h3>
                      <p className="text-sm opacity-90">{culture.description}</p>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Title and Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {culture.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {culture.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {culture.description}
                  </p>

                  {/* CTA Button Preview */}
                  <div className="mb-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                      disabled
                    >
                      {culture.ctaText}
                    </button>
                  </div>

                  {/* Status and Order */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        culture.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {culture.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {culture.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(culture)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(culture.id)}
                        className={`text-sm font-medium ${
                          culture.isActive
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {culture.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(culture.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(culture.createdAt).toLocaleDateString()}
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









