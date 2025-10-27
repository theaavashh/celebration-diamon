"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { z } from 'zod';

// Type definitions
interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Gallery {
  id?: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
  galleryItems: GalleryItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Local validation schema
const GalleryItemSchema = z.object({
  title: z.string().max(100, 'Title must be less than 100 characters').optional().nullable(),
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().nullable(),
  sortOrder: z.number().int().min(0, 'Sort order must be non-negative'),
  isActive: z.boolean().default(true)
}).refine((data) => data.imageUrl || data.imageFile, {
  message: "Either image URL or image file is required",
  path: ["imageUrl"]
});

const GallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().min(1, 'Subtitle is required').max(500, 'Subtitle must be less than 500 characters'),
  sortOrder: z.number().int().min(0, 'Sort order must be non-negative'),
  isActive: z.boolean().default(true),
  galleryItems: z.array(GalleryItemSchema).min(1, 'At least one gallery item is required')
});

interface GalleryFormProps {
  gallery?: Gallery | null;
  onSave: (gallery: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface GalleryFormData {
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
}

interface GalleryItemFormData {
  title: string;
  imageUrl: string;
  imageFile: File | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function GalleryForm({ 
  gallery, 
  onSave, 
  onCancel, 
  isLoading = false 
}: GalleryFormProps) {
  // Form state
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    subtitle: '',
    isActive: true,
    sortOrder: 0
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItemFormData[]>([
    { title: '', imageUrl: '', imageFile: null, description: null, sortOrder: 1, isActive: true }
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  // Initialize form data when gallery prop changes
  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title,
        subtitle: gallery.subtitle,
        isActive: gallery.isActive,
        sortOrder: gallery.sortOrder
      });
      
      if (gallery.galleryItems && gallery.galleryItems.length > 0) {
        setGalleryItems(gallery.galleryItems.map((item: GalleryItem) => ({
          title: item.title,
          imageUrl: item.imageUrl,
          imageFile: null,
          description: item.description || null,
          sortOrder: item.sortOrder,
          isActive: item.isActive
        })));
      }
    }
  }, [gallery]);

  // Memoized validation function
  const validateForm = useCallback(() => {
    setIsValidating(true);
    const newErrors: FormErrors = {};

    try {
      // Validate main form data
      const mainFormData = {
        ...formData,
        galleryItems: galleryItems.map(item => ({
          title: item.title.trim(),
          imageUrl: item.imageUrl.trim(),
          imageFile: item.imageFile,
          description: item.description?.trim() || null,
          sortOrder: item.sortOrder,
          isActive: item.isActive
        }))
      };

      GallerySchema.parse(mainFormData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [formData, galleryItems]);

  // Upload image file and return server URL
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

    const response = await fetch('http://localhost:5000/api/galleries/upload-image', {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to upload image' }));
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload image');
    }

    return result.data.imageUrl;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Filter out incomplete items (items without image/video)
      const completeItems = galleryItems.filter(item => 
        (item.imageFile || (item.imageUrl && item.imageUrl.trim().length > 0))
      );

      if (completeItems.length < 1) {
        setErrors({ submit: 'Please add at least 1 complete gallery item with image or video.' });
        return;
      }

      // Upload all images first
      const uploadedGalleryItems = await Promise.all(
        completeItems.map(async (item, index) => {
          let imageUrl = item.imageUrl.trim();
          
          // If there's a file to upload, upload it first
          if (item.imageFile) {
            imageUrl = await uploadImage(item.imageFile);
          }
          
          return {
            title: item.title.trim(),
            imageUrl: imageUrl,
            description: item.description?.trim() || null,
            sortOrder: item.sortOrder || index + 1,
            isActive: item.isActive
          };
        })
      );

      const galleryData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
        galleryItems: uploadedGalleryItems
      };

      onSave(galleryData);
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrors({ submit: 'Failed to upload images. Please try again.' });
    }
  }, [formData, galleryItems, validateForm, onSave, uploadImage]);

  // Handle input changes with debounced validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle gallery item changes
  const handleGalleryItemChange = useCallback((index: number, field: string, value: string | boolean | null | File) => {
    setGalleryItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));

    // Clear error when user starts typing
    const errorKey = `galleryItems.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle file upload
  const handleFileUpload = useCallback((index: number, file: File | null) => {
    setGalleryItems(prev => prev.map((item, i) => 
      i === index ? { ...item, imageFile: file, imageUrl: file ? URL.createObjectURL(file) : '' } : item
    ));
  }, []);

  // Add new gallery item
  const addGalleryItem = useCallback(() => {
    setGalleryItems(prev => [...prev, {
      title: '',
      imageUrl: '',
      imageFile: null,
      description: null,
      sortOrder: prev.length + 1,
      isActive: true
    }]);
  }, []);

  // Remove gallery item
  const removeGalleryItem = useCallback((index: number) => {
    if (galleryItems.length > 1) {
      setGalleryItems(prev => prev.filter((_, i) => i !== index).map((item, i) => ({
        ...item,
        sortOrder: i + 1
      })));
    }
  }, [galleryItems.length]);

  // Memoized error display
  const getFieldError = useCallback((fieldPath: string) => {
    return errors[fieldPath] || '';
  }, [errors]);

  // Memoized form validation status
  const isFormValid = useMemo(() => {
    const hasTitle = formData.title.trim().length > 0;
    const hasSubtitle = formData.subtitle.trim().length > 0;
    
    // Check if there is at least 1 complete item with image/video
    const completeItems = galleryItems.filter(item => 
      (item.imageFile || (item.imageUrl && item.imageUrl.trim().length > 0))
    );
    
    return hasTitle && hasSubtitle && completeItems.length >= 1;
  }, [formData, galleryItems]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          {gallery ? 'Edit Gallery' : 'Add New Gallery'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
            Gallery Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                Gallery Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                  getFieldError('title') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Gallery"
                disabled={isLoading}
              />
              {getFieldError('title') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
              )}
            </div>

            {/* Subtitle */}
            <div className="md:col-span-2">
              <label htmlFor="subtitle" className="block text-sm font-medium text-black mb-2">
                Gallery Subtitle *
              </label>
              <textarea
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                  getFieldError('subtitle') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Discover the art of mindful living through our curated collection of peaceful moments."
                disabled={isLoading}
              />
              {getFieldError('subtitle') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('subtitle')}</p>
              )}
              <p className="mt-1 text-sm text-black">
                {formData.subtitle.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Items Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
                Gallery Items
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Complete items: {galleryItems.filter(item => 
                  (item.imageFile || (item.imageUrl && item.imageUrl.trim().length > 0))
                ).length} (minimum 1 required)
              </p>
            </div>
            <button
              type="button"
              onClick={addGalleryItem}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              + Add Item
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {galleryItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-800">Item {item.sortOrder}</h4>
                  {galleryItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Item Title */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleGalleryItemChange(index, 'title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        getFieldError(`galleryItems.${index}.title`) ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Moments of Tranquility (optional)"
                      disabled={isLoading}
                    />
                    {getFieldError(`galleryItems.${index}.title`) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(`galleryItems.${index}.title`)}</p>
                    )}
                  </div>

                  {/* Item Media Upload */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Image/Video Upload *
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileUpload(index, file);
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        getFieldError(`galleryItems.${index}.imageUrl`) ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isLoading}
                    />
                    {getFieldError(`galleryItems.${index}.imageUrl`) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(`galleryItems.${index}.imageUrl`)}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Supported formats: Images (JPG, PNG, GIF, WebP) or Videos (MP4, WebM, OGG, MOV) - Max 50MB
                    </p>
                  </div>

                  {/* Item Description */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => handleGalleryItemChange(index, 'description', e.target.value || null)}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        getFieldError(`galleryItems.${index}.description`) ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Optional description for this gallery item"
                      disabled={isLoading}
                    />
                    {getFieldError(`galleryItems.${index}.description`) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(`galleryItems.${index}.description`)}</p>
                    )}
                  </div>

                  {/* Media Preview */}
                  {(item.imageUrl || item.imageFile) && (
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Preview</label>
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        {item.imageFile && item.imageFile.type.startsWith('video/') ? (
                          <video
                            src={item.imageUrl}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={item.imageUrl}
                            alt={`Gallery item ${index + 1} preview`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      {item.imageFile && (
                        <p className="mt-1 text-sm text-gray-600">
                          Selected: {item.imageFile.name} ({(item.imageFile.size / 1024 / 1024).toFixed(2)} MB)
                          {item.imageFile.type && ` - Type: ${item.imageFile.type}`}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Item Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => handleGalleryItemChange(index, 'isActive', e.target.checked)}
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
          <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
            Settings
          </h3>
          
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                  getFieldError('sortOrder') ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {getFieldError('sortOrder') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('sortOrder')}</p>
              )}
              <p className="mt-1 text-sm text-black">
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
              <label htmlFor="isActive" className="ml-2 block text-sm text-black">
                Active (visible to users)
              </label>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              !isFormValid || isValidating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading || !isFormValid || isValidating}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {gallery ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              gallery ? 'Update Gallery' : 'Create Gallery'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}