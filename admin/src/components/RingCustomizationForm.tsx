"use client";

import { useState, useEffect } from 'react';
import { RingCustomization } from '@/types';

interface RingCustomizationFormProps {
  ringCustomization?: RingCustomization | null;
  onSave: (ringCustomization: Omit<RingCustomization, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RingCustomizationForm({ 
  ringCustomization, 
  onSave, 
  onCancel, 
  isLoading = false 
}: RingCustomizationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    processImageUrl: '',
    example1Title: '',
    example1Desc: '',
    example1ImageUrl: '',
    example2Title: '',
    example2Desc: '',
    example2ImageUrl: '',
    isActive: true,
    sortOrder: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ringCustomization) {
      setFormData({
        title: ringCustomization.title,
        description: ringCustomization.description,
        ctaText: ringCustomization.ctaText,
        ctaLink: ringCustomization.ctaLink || '',
        processImageUrl: ringCustomization.processImageUrl || '',
        example1Title: ringCustomization.example1Title || '',
        example1Desc: ringCustomization.example1Desc || '',
        example1ImageUrl: ringCustomization.example1ImageUrl || '',
        example2Title: ringCustomization.example2Title || '',
        example2Desc: ringCustomization.example2Desc || '',
        example2ImageUrl: ringCustomization.example2ImageUrl || '',
        isActive: ringCustomization.isActive,
        sortOrder: ringCustomization.sortOrder
      });
    }
  }, [ringCustomization]);

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

    if (formData.processImageUrl && !isValidUrl(formData.processImageUrl)) {
      newErrors.processImageUrl = 'Process image URL must be a valid URL';
    }

    if (formData.example1Title && formData.example1Title.length > 100) {
      newErrors.example1Title = 'Example 1 title must be less than 100 characters';
    }

    if (formData.example1Desc && formData.example1Desc.length > 200) {
      newErrors.example1Desc = 'Example 1 description must be less than 200 characters';
    }

    if (formData.example1ImageUrl && !isValidUrl(formData.example1ImageUrl)) {
      newErrors.example1ImageUrl = 'Example 1 image URL must be a valid URL';
    }

    if (formData.example2Title && formData.example2Title.length > 100) {
      newErrors.example2Title = 'Example 2 title must be less than 100 characters';
    }

    if (formData.example2Desc && formData.example2Desc.length > 200) {
      newErrors.example2Desc = 'Example 2 description must be less than 200 characters';
    }

    if (formData.example2ImageUrl && !isValidUrl(formData.example2ImageUrl)) {
      newErrors.example2ImageUrl = 'Example 2 image URL must be a valid URL';
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
      processImageUrl: formData.processImageUrl.trim() || null,
      example1Title: formData.example1Title.trim() || null,
      example1Desc: formData.example1Desc.trim() || null,
      example1ImageUrl: formData.example1ImageUrl.trim() || null,
      example2Title: formData.example2Title.trim() || null,
      example2Desc: formData.example2Desc.trim() || null,
      example2ImageUrl: formData.example2ImageUrl.trim() || null,
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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {ringCustomization ? 'Edit Ring Customization' : 'Add New Ring Customization'}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Main Content</h3>
          
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., CREATE YOUR RING ONLINE"
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ctaText ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., START DESIGNING"
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ctaLink ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/design"
                disabled={isLoading}
              />
              {errors.ctaLink && (
                <p className="mt-1 text-sm text-red-600">{errors.ctaLink}</p>
              )}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Process Diagram</h3>
          
          <div>
            <label htmlFor="processImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Process Image URL (Optional)
            </label>
            <input
              type="url"
              id="processImageUrl"
              name="processImageUrl"
              value={formData.processImageUrl}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.processImageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/process-diagram.jpg"
              disabled={isLoading}
            />
            {errors.processImageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.processImageUrl}</p>
            )}
          </div>
        </div>

        {/* Examples Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Ring Examples</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Example 1 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800">Example 1</h4>
              
              <div>
                <label htmlFor="example1Title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="example1Title"
                  name="example1Title"
                  value={formData.example1Title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.example1Title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Ornate Band Design"
                  disabled={isLoading}
                />
                {errors.example1Title && (
                  <p className="mt-1 text-sm text-red-600">{errors.example1Title}</p>
                )}
              </div>

              <div>
                <label htmlFor="example1Desc" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  id="example1Desc"
                  name="example1Desc"
                  value={formData.example1Desc}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.example1Desc ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., V-shaped with leaf carvings"
                  disabled={isLoading}
                />
                {errors.example1Desc && (
                  <p className="mt-1 text-sm text-red-600">{errors.example1Desc}</p>
                )}
              </div>

              <div>
                <label htmlFor="example1ImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="example1ImageUrl"
                  name="example1ImageUrl"
                  value={formData.example1ImageUrl}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.example1ImageUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/example1.jpg"
                  disabled={isLoading}
                />
                {errors.example1ImageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.example1ImageUrl}</p>
                )}
              </div>
            </div>

            {/* Example 2 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-800">Example 2</h4>
              
              <div>
                <label htmlFor="example2Title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="example2Title"
                  name="example2Title"
                  value={formData.example2Title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.example2Title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Salt & Pepper Diamond"
                  disabled={isLoading}
                />
                {errors.example2Title && (
                  <p className="mt-1 text-sm text-red-600">{errors.example2Title}</p>
                )}
              </div>

              <div>
                <label htmlFor="example2Desc" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  id="example2Desc"
                  name="example2Desc"
                  value={formData.example2Desc}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.example2Desc ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Unique speckled gemstone"
                  disabled={isLoading}
                />
                {errors.example2Desc && (
                  <p className="mt-1 text-sm text-red-600">{errors.example2Desc}</p>
                )}
              </div>

              <div>
                <label htmlFor="example2ImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="example2ImageUrl"
                  name="example2ImageUrl"
                  value={formData.example2ImageUrl}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.example2ImageUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/example2.jpg"
                  disabled={isLoading}
                />
                {errors.example2ImageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.example2ImageUrl}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                {ringCustomization ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              ringCustomization ? 'Update Ring Customization' : 'Create Ring Customization'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
















