"use client";

import { useState, useEffect } from 'react';
import { FAQ } from '@/types';

interface FAQFormProps {
  faq?: FAQ | null;
  onSave: (faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORY_OPTIONS: never[] = [];

export default function FAQForm({ 
  faq, 
  onSave, 
  onCancel, 
  isLoading = false 
}: FAQFormProps) {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer
      });
    }
  }, [faq]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.length > 500) {
      newErrors.question = 'Question must be less than 500 characters';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    } else if (formData.answer.length > 2000) {
      newErrors.answer = 'Answer must be less than 2000 characters';
    }

    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      question: formData.question.trim(),
      answer: formData.answer.trim()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          {faq ? 'Edit FAQ' : 'Add New FAQ'}
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
        {/* Main Content Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">FAQ Content</h3>
          
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.question ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Where is Celebration Diamonds located?"
                disabled={isLoading}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.question.length}/500 characters
              </p>
            </div>

            {/* Answer */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Answer *
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.answer ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the detailed answer to the question..."
                disabled={isLoading}
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.answer.length}/2000 characters
              </p>
            </div>

            
          </div>
        </div>

        

        {/* Preview Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Preview</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900 text-sm">
                  {formData.question || 'Your question will appear here...'}
                </h4>
                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              {formData.answer && (
                <div className="text-xs text-gray-600 bg-white rounded p-2 border">
                  <strong>Answer:</strong> {formData.answer}
                </div>
              )}
              
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
                {faq ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              faq ? 'Update FAQ' : 'Create FAQ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}




















