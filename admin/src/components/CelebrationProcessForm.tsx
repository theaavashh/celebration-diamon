"use client";

import { useState, useEffect } from 'react';
import { CelebrationProcess, CelebrationProcessStep } from '@/types';

interface CelebrationProcessFormProps {
  celebrationProcess?: CelebrationProcess | null;
  onSave: (celebrationProcess: Omit<CelebrationProcess, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ICON_OPTIONS = [
  { value: 'diamond', label: 'Diamond', icon: '💎' },
  { value: 'star', label: 'Star', icon: '⭐' },
  { value: 'shield', label: 'Shield', icon: '🛡️' },
  { value: 'heart', label: 'Heart', icon: '❤️' },
  { value: 'calendar', label: 'Calendar', icon: '📅' },
  { value: 'shopping-bag', label: 'Shopping Bag', icon: '🛍️' },
  { value: 'crown', label: 'Crown', icon: '👑' },
  { value: 'gem', label: 'Gem', icon: '💠' }
];

export default function CelebrationProcessForm({ 
  celebrationProcess, 
  onSave, 
  onCancel, 
  isLoading = false 
}: CelebrationProcessFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true,
    sortOrder: 0
  });

  const [steps, setSteps] = useState<Omit<CelebrationProcessStep, 'id' | 'celebrationProcessId' | 'createdAt' | 'updatedAt'>[]>([
    { title: '', description: '', icon: 'diamond', order: 1, isActive: true },
    { title: '', description: '', icon: 'star', order: 2, isActive: true },
    { title: '', description: '', icon: 'shield', order: 3, isActive: true },
    { title: '', description: '', icon: 'heart', order: 4, isActive: true }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (celebrationProcess) {
      setFormData({
        title: celebrationProcess.title,
        description: celebrationProcess.description || '',
        imageUrl: celebrationProcess.imageUrl || '',
        isActive: celebrationProcess.isActive,
        sortOrder: celebrationProcess.sortOrder
      });
      
      if (celebrationProcess.steps && celebrationProcess.steps.length > 0) {
        setSteps(celebrationProcess.steps.map(step => ({
          title: step.title,
          description: step.description,
          icon: step.icon,
          order: step.order,
          isActive: step.isActive
        })));
      }
    }
  }, [celebrationProcess]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Image URL must be a valid URL';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be a non-negative number';
    }

    // Validate steps
    steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`step_${index}_title`] = `Step ${index + 1} title is required`;
      } else if (step.title.length > 100) {
        newErrors[`step_${index}_title`] = `Step ${index + 1} title must be less than 100 characters`;
      }

      if (!step.description.trim()) {
        newErrors[`step_${index}_description`] = `Step ${index + 1} description is required`;
      } else if (step.description.length > 200) {
        newErrors[`step_${index}_description`] = `Step ${index + 1} description must be less than 200 characters`;
      }

      if (!step.icon.trim()) {
        newErrors[`step_${index}_icon`] = `Step ${index + 1} icon is required`;
      }
    });

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
      description: formData.description.trim() || null,
      imageUrl: formData.imageUrl.trim() || null,
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
      steps: steps.map((step, index) => ({
        title: step.title.trim(),
        description: step.description.trim(),
        icon: step.icon.trim(),
        order: step.order,
        isActive: step.isActive
      }))
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

  const handleStepChange = (index: number, field: string, value: string | boolean) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    ));

    // Clear error when user starts typing
    const errorKey = `step_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addStep = () => {
    setSteps(prev => [...prev, {
      title: '',
      description: '',
      icon: 'diamond',
      order: prev.length + 1,
      isActive: true
    }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(prev => prev.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        order: i + 1
      })));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {celebrationProcess ? 'Edit Celebration Process' : 'Add New Celebration Process'}
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., The Celebration Diamond process is in the details"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter an optional description..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
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
                placeholder="https://example.com/celebration-image.jpg"
                disabled={isLoading}
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                This image will be displayed alongside the process steps
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Process Steps</h3>
            <button
              type="button"
              onClick={addStep}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              Add Step
            </button>
          </div>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-800">Step {step.order}</h4>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`step_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Jewelry Selection"
                      disabled={isLoading}
                    />
                    {errors[`step_${index}_title`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`step_${index}_title`]}</p>
                    )}
                  </div>

                  {/* Step Icon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon *
                    </label>
                    <select
                      value={step.icon}
                      onChange={(e) => handleStepChange(index, 'icon', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`step_${index}_icon`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isLoading}
                    >
                      {ICON_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                    {errors[`step_${index}_icon`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`step_${index}_icon`]}</p>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`step_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Select the perfect jewelry for your special moment."
                      disabled={isLoading}
                    />
                    {errors[`step_${index}_description`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`step_${index}_description`]}</p>
                    )}
                  </div>

                  {/* Step Active Status */}
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={step.isActive}
                      onChange={(e) => handleStepChange(index, 'isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Active (visible to users)
                    </label>
                  </div>
                </div>
              </div>
            ))}
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
                {celebrationProcess ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              celebrationProcess ? 'Update Celebration Process' : 'Create Celebration Process'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

















