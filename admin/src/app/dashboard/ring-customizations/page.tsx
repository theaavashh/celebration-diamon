"use client";

import { useState, useEffect } from 'react';
import { RingCustomization } from '@/types';
import RingCustomizationForm from '@/components/RingCustomizationForm';
import DashboardLayout from '@/components/DashboardLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function RingCustomizationsPage() {
  const [ringCustomizations, setRingCustomizations] = useState<RingCustomization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRingCustomization, setEditingRingCustomization] = useState<RingCustomization | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRingCustomizations();
  }, []);

  const fetchRingCustomizations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ring-customizations/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ring customizations');
      }

      const data = await response.json();
      setRingCustomizations(data);
    } catch (error) {
      console.error('Error fetching ring customizations:', error);
      setError('Failed to fetch ring customizations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (ringCustomizationData: Omit<RingCustomization, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = editingRingCustomization 
        ? `${API_BASE_URL}/api/ring-customizations/${editingRingCustomization.id}`
        : `${API_BASE_URL}/api/ring-customizations`;
      
      const method = editingRingCustomization ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ringCustomizationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || errorData.message || `Failed to ${editingRingCustomization ? 'update' : 'create'} ring customization`);
      }

      const savedRingCustomization = await response.json();
      
      if (editingRingCustomization) {
        setRingCustomizations(prev => prev.map(rc => 
          rc.id === editingRingCustomization.id ? savedRingCustomization : rc
        ));
      } else {
        setRingCustomizations(prev => [savedRingCustomization, ...prev]);
      }

      setShowForm(false);
      setEditingRingCustomization(null);
    } catch (error) {
      console.error('Error saving ring customization:', error);
      setError(`Failed to ${editingRingCustomization ? 'update' : 'create'} ring customization`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ringCustomization: RingCustomization) => {
    setEditingRingCustomization(ringCustomization);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ring customization?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/ring-customizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete ring customization');
      }

      setRingCustomizations(prev => prev.filter(rc => rc.id !== id));
    } catch (error) {
      console.error('Error deleting ring customization:', error);
      setError('Failed to delete ring customization');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/ring-customizations/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle ring customization status');
      }

      const updatedRingCustomization = await response.json();
      setRingCustomizations(prev => prev.map(rc => 
        rc.id === id ? updatedRingCustomization : rc
      ));
    } catch (error) {
      console.error('Error toggling ring customization status:', error);
      setError('Failed to toggle ring customization status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRingCustomization(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Ring Customization Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Ring Customization Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ring Customization Management</h1>
            <p className="text-gray-600">Manage online ring customization services and examples</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Ring Customization
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
            <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
              <RingCustomizationForm
                ringCustomization={editingRingCustomization}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Ring Customizations Grid */}
        {ringCustomizations.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No ring customizations yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first ring customization service.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Ring Customization
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ringCustomizations.map((ringCustomization) => (
              <div
                key={ringCustomization.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Process Image Preview */}
                {ringCustomization.processImageUrl && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={ringCustomization.processImageUrl}
                      alt="Process diagram"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">Design Your Own Dream Ring!</h3>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {ringCustomization.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {ringCustomization.description}
                    </p>
                  </div>

                  {/* CTA Button Preview */}
                  <div className="mb-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                      disabled
                    >
                      {ringCustomization.ctaText}
                    </button>
                  </div>

                  {/* Examples Preview */}
                  {(ringCustomization.example1Title || ringCustomization.example2Title) && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Examples:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {ringCustomization.example1Title && (
                          <div className="text-xs text-gray-600">
                            <div className="font-medium">{ringCustomization.example1Title}</div>
                            {ringCustomization.example1Desc && (
                              <div className="text-gray-500">{ringCustomization.example1Desc}</div>
                            )}
                          </div>
                        )}
                        {ringCustomization.example2Title && (
                          <div className="text-xs text-gray-600">
                            <div className="font-medium">{ringCustomization.example2Title}</div>
                            {ringCustomization.example2Desc && (
                              <div className="text-gray-500">{ringCustomization.example2Desc}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status and Order */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ringCustomization.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ringCustomization.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {ringCustomization.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(ringCustomization)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(ringCustomization.id)}
                        className={`text-sm font-medium ${
                          ringCustomization.isActive
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {ringCustomization.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(ringCustomization.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(ringCustomization.createdAt).toLocaleDateString()}
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









