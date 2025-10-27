"use client";

import { useState, useEffect } from 'react';
import { WeddingPlanner } from '@/types';

interface WeddingPlannerFormProps {
  weddingPlanner?: WeddingPlanner | null;
  onSave: (weddingPlanner: Omit<WeddingPlanner, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function WeddingPlannerForm({ 
  weddingPlanner, 
  onSave, 
  onCancel, 
  isLoading = false 
}: WeddingPlannerFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    imageUrl: '',
    badgeText: '',
    badgeSubtext: '',
    isActive: true,
    sortOrder: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (weddingPlanner) {
      setFormData({
        title: weddingPlanner.title,
        description: weddingPlanner.description,
        ctaText: weddingPlanner.ctaText,
        ctaLink: weddingPlanner.ctaLink || '',
        imageUrl: weddingPlanner.imageUrl || '',
        badgeText: weddingPlanner.badgeText || '',
        badgeSubtext: weddingPlanner.badgeSubtext || '',
        isActive: weddingPlanner.isActive,
        sortOrder: weddingPlanner.sortOrder
      });
    }
  }, [weddingPlanner]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.ctaText.trim()) {
      newErrors.ctaText = 'CTA text is required';
    } else if (formData.ctaText.length > 100) {
      newErrors.ctaText = 'CTA text must be less than 100 characters';
    }

    if (formData.ctaLink && !isValidUrl(formData.ctaLink)) {
      newErrors.ctaLink = 'CTA link must be a valid URL';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Image URL must be a valid URL';
    }

    if (formData.badgeText && formData.badgeText.length > 50) {
      newErrors.badgeText = 'Badge text must be less than 50 characters';
    }

    if (formData.badgeSubtext && formData.badgeSubtext.length > 50) {
      newErrors.badgeSubtext = 'Badge subtext must be less than 50 characters';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      ctaText: formData.ctaText.trim(),
      ctaLink: formData.ctaLink.trim() || null,
      imageUrl: formData.imageUrl.trim() || null,
      badgeText: formData.badgeText.trim() || null,
      badgeSubtext: formData.badgeSubtext.trim() || null,
      isActive: formData.isActive,
      sortOrder: formData.sortOrder
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {weddingPlanner ? 'Edit Wedding Planner' : 'Add New Wedding Planner'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., YOURS WEDDING JEWELRY PLANNER"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter the main description text..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/2000 characters
            </p>
          </div>

          {/* CTA Text */}
          <div>
            <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700 mb-2">
              CTA Text *
            </label>
            <input
              type="text"
              id="ctaText"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.ctaText ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., SCHEDULE CONSULTATION"
              disabled={isLoading}
            />
            {errors.ctaText && (
              <p className="mt-1 text-sm text-red-600">{errors.ctaText}</p>
            )}
          </div>

          {/* CTA Link */}
          <div>
            <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700 mb-2">
              CTA Link (Optional)
            </label>
            <input
              type="url"
              id="ctaLink"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.ctaLink ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/consultation"
              disabled={isLoading}
            />
            {errors.ctaLink && (
              <p className="mt-1 text-sm text-red-600">{errors.ctaLink}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          {/* Badge Text */}
          <div>
            <label htmlFor="badgeText" className="block text-sm font-medium text-gray-700 mb-2">
              Badge Text (Optional)
            </label>
            <input
              type="text"
              id="badgeText"
              name="badgeText"
              value={formData.badgeText}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.badgeText ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., BRIDE PLANNING"
              disabled={isLoading}
            />
            {errors.badgeText && (
              <p className="mt-1 text-sm text-red-600">{errors.badgeText}</p>
            )}
          </div>

          {/* Badge Subtext */}
          <div>
            <label htmlFor="badgeSubtext" className="block text-sm font-medium text-gray-700 mb-2">
              Badge Subtext (Optional)
            </label>
            <input
              type="text"
              id="badgeSubtext"
              name="badgeSubtext"
              value={formData.badgeSubtext}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.badgeSubtext ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Expert Service"
              disabled={isLoading}
            />
            {errors.badgeSubtext && (
              <p className="mt-1 text-sm text-red-600">{errors.badgeSubtext}</p>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.sortOrder ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.sortOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.sortOrder}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Lower numbers appear first
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active (visible to users)
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {weddingPlanner ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              weddingPlanner ? 'Update Wedding Planner' : 'Create Wedding Planner'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

















