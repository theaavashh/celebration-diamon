"use client";

import { useState, useEffect } from 'react';
import { DiamondCertification } from '@/types';
import DiamondCertificationForm from '@/components/DiamondCertificationForm';
import DashboardLayout from '@/components/DashboardLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function DiamondCertificationsPage() {
  const [diamondCertifications, setDiamondCertifications] = useState<DiamondCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiamondCertification, setEditingDiamondCertification] = useState<DiamondCertification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiamondCertifications();
  }, []);

  const fetchDiamondCertifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/diamond-certifications/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch diamond certifications');
      }

      const data = await response.json();
      setDiamondCertifications(data);
    } catch (error) {
      console.error('Error fetching diamond certifications:', error);
      setError('Failed to fetch diamond certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (diamondCertificationData: Omit<DiamondCertification, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = editingDiamondCertification 
        ? `${API_BASE_URL}/diamond-certifications/${editingDiamondCertification.id}`
        : `${API_BASE_URL}/diamond-certifications`;
      
      const method = editingDiamondCertification ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diamondCertificationData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingDiamondCertification ? 'update' : 'create'} diamond certification`);
      }

      const savedDiamondCertification = await response.json();
      
      if (editingDiamondCertification) {
        setDiamondCertifications(prev => prev.map(dc => 
          dc.id === editingDiamondCertification.id ? savedDiamondCertification : dc
        ));
      } else {
        setDiamondCertifications(prev => [savedDiamondCertification, ...prev]);
      }

      setShowForm(false);
      setEditingDiamondCertification(null);
    } catch (error) {
      console.error('Error saving diamond certification:', error);
      setError(`Failed to ${editingDiamondCertification ? 'update' : 'create'} diamond certification`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (diamondCertification: DiamondCertification) => {
    setEditingDiamondCertification(diamondCertification);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diamond certification?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/diamond-certifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete diamond certification');
      }

      setDiamondCertifications(prev => prev.filter(dc => dc.id !== id));
    } catch (error) {
      console.error('Error deleting diamond certification:', error);
      setError('Failed to delete diamond certification');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/diamond-certifications/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle diamond certification status');
      }

      const updatedDiamondCertification = await response.json();
      setDiamondCertifications(prev => prev.map(dc => 
        dc.id === id ? updatedDiamondCertification : dc
      ));
    } catch (error) {
      console.error('Error toggling diamond certification status:', error);
      setError('Failed to toggle diamond certification status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDiamondCertification(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Diamond Certification Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Diamond Certification Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diamond Certification Management</h1>
            <p className="text-gray-600">Manage diamond certification services and information</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Diamond Certification
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
            <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <DiamondCertificationForm
                diamondCertification={editingDiamondCertification}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Diamond Certifications Grid */}
        {diamondCertifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No diamond certifications yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first diamond certification service.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Diamond Certification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {diamondCertifications.map((diamondCertification) => (
              <div
                key={diamondCertification.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Diamond Image Preview */}
                {diamondCertification.imageUrl && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={diamondCertification.imageUrl}
                      alt="Diamond certification"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{diamondCertification.title}</h3>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {diamondCertification.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-4">
                      {diamondCertification.description}
                    </p>
                  </div>

                  {/* CTA Button Preview */}
                  <div className="mb-4">
                    <button
                      className="text-orange-600 hover:text-orange-800 font-medium underline"
                      disabled
                    >
                      {diamondCertification.ctaText}
                    </button>
                  </div>

                  {/* Status and Order */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        diamondCertification.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {diamondCertification.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {diamondCertification.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(diamondCertification)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(diamondCertification.id)}
                        className={`text-sm font-medium ${
                          diamondCertification.isActive
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {diamondCertification.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(diamondCertification.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(diamondCertification.createdAt).toLocaleDateString()}
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









