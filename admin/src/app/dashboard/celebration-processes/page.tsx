"use client";

import { useState, useEffect } from 'react';
import { CelebrationProcess } from '@/types';
import CelebrationProcessForm from '@/components/CelebrationProcessForm';
import DashboardLayout from '@/components/DashboardLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const ICON_MAP: Record<string, string> = {
  diamond: '💎',
  star: '⭐',
  shield: '🛡️',
  heart: '❤️',
  calendar: '📅',
  'shopping-bag': '🛍️',
  crown: '👑',
  gem: '💠'
};

export default function CelebrationProcessesPage() {
  const [celebrationProcesses, setCelebrationProcesses] = useState<CelebrationProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCelebrationProcess, setEditingCelebrationProcess] = useState<CelebrationProcess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCelebrationProcesses();
  }, []);

  const fetchCelebrationProcesses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/celebration-processes/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch celebration processes');
      }

      const data = await response.json();
      setCelebrationProcesses(data);
    } catch (error) {
      console.error('Error fetching celebration processes:', error);
      setError('Failed to fetch celebration processes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (celebrationProcessData: Omit<CelebrationProcess, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const url = editingCelebrationProcess 
        ? `${API_BASE_URL}/api/celebration-processes/${editingCelebrationProcess.id}`
        : `${API_BASE_URL}/api/celebration-processes`;
      
      const method = editingCelebrationProcess ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(celebrationProcessData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCelebrationProcess ? 'update' : 'create'} celebration process`);
      }

      const savedCelebrationProcess = await response.json();
      
      if (editingCelebrationProcess) {
        setCelebrationProcesses(prev => prev.map(cp => 
          cp.id === editingCelebrationProcess.id ? savedCelebrationProcess : cp
        ));
      } else {
        setCelebrationProcesses(prev => [savedCelebrationProcess, ...prev]);
      }

      setShowForm(false);
      setEditingCelebrationProcess(null);
    } catch (error) {
      console.error('Error saving celebration process:', error);
      setError(`Failed to ${editingCelebrationProcess ? 'update' : 'create'} celebration process`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (celebrationProcess: CelebrationProcess) => {
    setEditingCelebrationProcess(celebrationProcess);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this celebration process?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/celebration-processes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete celebration process');
      }

      setCelebrationProcesses(prev => prev.filter(cp => cp.id !== id));
    } catch (error) {
      console.error('Error deleting celebration process:', error);
      setError('Failed to delete celebration process');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/celebration-processes/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle celebration process status');
      }

      const updatedCelebrationProcess = await response.json();
      setCelebrationProcesses(prev => prev.map(cp => 
        cp.id === id ? updatedCelebrationProcess : cp
      ));
    } catch (error) {
      console.error('Error toggling celebration process status:', error);
      setError('Failed to toggle celebration process status');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCelebrationProcess(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Celebration Process Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Celebration Process Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Celebration Process Management</h1>
            <p className="text-gray-600">Manage the celebration diamond process steps and information</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Celebration Process
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
              <CelebrationProcessForm
                celebrationProcess={editingCelebrationProcess}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Celebration Processes Grid */}
        {celebrationProcesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No celebration processes yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first celebration process.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Celebration Process
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {celebrationProcesses.map((celebrationProcess) => (
              <div
                key={celebrationProcess.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                {celebrationProcess.imageUrl && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={celebrationProcess.imageUrl}
                      alt="Celebration process"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{celebrationProcess.title}</h3>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {celebrationProcess.title}
                    </h3>
                    {celebrationProcess.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {celebrationProcess.description}
                      </p>
                    )}
                  </div>

                  {/* Process Steps Preview */}
                  {celebrationProcess.steps && celebrationProcess.steps.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Process Steps:</h4>
                      <div className="space-y-2">
                        {celebrationProcess.steps.slice(0, 4).map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-3 text-sm">
                            <span className="text-lg">
                              {ICON_MAP[step.icon] || '🔹'}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{step.title}</div>
                              <div className="text-gray-500 text-xs line-clamp-1">{step.description}</div>
                            </div>
                          </div>
                        ))}
                        {celebrationProcess.steps.length > 4 && (
                          <div className="text-xs text-gray-500">
                            +{celebrationProcess.steps.length - 4} more steps
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status and Order */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        celebrationProcess.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {celebrationProcess.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {celebrationProcess.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(celebrationProcess)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(celebrationProcess.id)}
                        className={`text-sm font-medium ${
                          celebrationProcess.isActive
                            ? 'text-orange-600 hover:text-orange-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {celebrationProcess.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(celebrationProcess.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(celebrationProcess.createdAt).toLocaleDateString()}
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









