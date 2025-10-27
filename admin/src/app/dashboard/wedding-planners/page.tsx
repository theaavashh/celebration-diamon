"use client";

import { useState, useEffect } from 'react';
import { WeddingPlanner } from '@/types';
import WeddingPlannerForm from '@/components/WeddingPlannerForm';
import DashboardLayout from '@/components/DashboardLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function WeddingPlannersPage() {
  const [weddingPlanners, setWeddingPlanners] = useState<WeddingPlanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWeddingPlanner, setEditingWeddingPlanner] = useState<WeddingPlanner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeddingPlanners();
  }, []);

  const fetchWeddingPlanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/wedding-planners/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wedding planners');
      }

      const data = await response.json();
      setWeddingPlanners(data);
    } catch (error) {
      console.error('Error fetching wedding planners:', error);
      setError('Failed to fetch wedding planners');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (weddingPlannerData: Omit<WeddingPlanner, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = editingWeddingPlanner 
        ? `${API_BASE_URL}/api/wedding-planners/${editingWeddingPlanner.id}`
        : `${API_BASE_URL}/api/wedding-planners`;
      
      const method = editingWeddingPlanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weddingPlannerData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingWeddingPlanner ? 'update' : 'create'} wedding planner`);
      }

      const savedWeddingPlanner = await response.json();
      
      if (editingWeddingPlanner) {
        setWeddingPlanners(prev => prev.map(wp => 
          wp.id === editingWeddingPlanner.id ? savedWeddingPlanner : wp
        ));
      } else {
        setWeddingPlanners(prev => [savedWeddingPlanner, ...prev]);
      }

      setShowForm(false);
      setEditingWeddingPlanner(null);
    } catch (error) {
      console.error('Error saving wedding planner:', error);
      setError(`Failed to ${editingWeddingPlanner ? 'update' : 'create'} wedding planner`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (weddingPlanner: WeddingPlanner) => {
    setEditingWeddingPlanner(weddingPlanner);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wedding planner?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/wedding-planners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete wedding planner');
      }

      setWeddingPlanners(prev => prev.filter(wp => wp.id !== id));
    } catch (error) {
      console.error('Error deleting wedding planner:', error);
      setError('Failed to delete wedding planner');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/wedding-planners/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle wedding planner status');
      }

      const updatedWeddingPlanner = await response.json();
      setWeddingPlanners(prev => prev.map(wp => 
        wp.id === id ? updatedWeddingPlanner : wp
      ));
    } catch (error) {
      console.error('Error toggling wedding planner status:', error);
      setError('Failed to toggle wedding planner status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWeddingPlanner(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Wedding Planners Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Wedding Planners Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wedding Planners Management</h1>
            <p className="text-gray-600">Manage wedding jewelry planner services</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Wedding Planner
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
              <WeddingPlannerForm
                weddingPlanner={editingWeddingPlanner}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Wedding Planners Grid */}
        {weddingPlanners.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No wedding planners yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first wedding jewelry planner service.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Wedding Planner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {weddingPlanners.map((weddingPlanner) => (
              <div
                key={weddingPlanner.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                {weddingPlanner.imageUrl && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={weddingPlanner.imageUrl}
                      alt={weddingPlanner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {weddingPlanner.badgeText && (
                      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {weddingPlanner.badgeText}
                            </div>
                            {weddingPlanner.badgeSubtext && (
                              <div className="text-xs text-gray-600">
                                {weddingPlanner.badgeSubtext}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {weddingPlanner.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {weddingPlanner.description}
                  </p>

                  {/* CTA Button Preview */}
                  <div className="mb-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                      disabled
                    >
                      {weddingPlanner.ctaText}
                    </button>
                  </div>

                  {/* Status and Order */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        weddingPlanner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {weddingPlanner.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {weddingPlanner.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(weddingPlanner)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(weddingPlanner.id)}
                        className={`text-sm font-medium ${
                          weddingPlanner.isActive
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {weddingPlanner.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(weddingPlanner.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(weddingPlanner.createdAt).toLocaleDateString()}
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









