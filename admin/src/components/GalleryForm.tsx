"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { z } from 'zod';
import { getApiBaseUrl, getImageUrl } from '@/lib/api';
import { apiPostFormData, type ApiResponse } from '@/lib/apiClient';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'], weight: '400' });

// Type definitions
interface GalleryItem {
  id?: string;
  imageUrl: string;
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
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
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
  imageUrl: string;
  imageFile: File | null;
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
    { imageUrl: '', imageFile: null, sortOrder: 1, isActive: true }
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
          imageUrl: item.imageUrl ? getImageUrl(item.imageUrl) : '',
          imageFile: null,
          sortOrder: item.sortOrder ?? 0,
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
          imageUrl: item.imageUrl.trim(),
          imageFile: item.imageFile,
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
    const apiBase = getApiBaseUrl();
    const response: ApiResponse<{ imageUrl: string }> = await apiPostFormData(`${apiBase}/galleries/upload-image`, formData);
    if (!response.success || !response.data?.imageUrl) {
      throw new Error(response.error || 'Failed to upload image');
    }
    return response.data.imageUrl;
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
          } else if (imageUrl.startsWith('http')) {
            try {
              imageUrl = new URL(imageUrl).pathname || imageUrl;
            } catch {
              // ignore URL parsing errors and keep original
            }
          }
          
          return {
            imageUrl: imageUrl,
            sortOrder: (item.sortOrder ?? index + 1) || index + 1,
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

  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');

  const handleCropImage = (index: number) => {
    setCroppingIndex(index);
    setCroppingImageUrl(galleryItems[index].imageUrl);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  };

  const handleCompleteCrop = () => {
    if (imgRef.current && completedCrop && croppingIndex !== null) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const image = imgRef.current;
      const pixelRatio = window.devicePixelRatio;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width * pixelRatio;
      canvas.height = completedCrop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `cropped-${Date.now()}.png`;
          const croppedFile = new File([blob], fileName, { type: 'image/png' });
          setGalleryItems(prev => prev.map((it, i) => i === croppingIndex ? {
            ...it,
            imageFile: croppedFile,
            imageUrl: URL.createObjectURL(croppedFile)
          } : it));
          setCroppingIndex(null);
          setCroppingImageUrl('');
          setCrop(undefined);
          setCompletedCrop(undefined);
        }
      }, 'image/png');
    }
  };

  // Add new gallery item
  const addGalleryItem = useCallback(() => {
    setGalleryItems(prev => [...prev, {
      imageUrl: '',
      imageFile: null,
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
    <>
    <div className={`${urbanist.className} bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-black">
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
          <h3 className="text-2xl font-semibold text-black border-b border-gray-200 pb-2">
            Gallery Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-lg font-medium text-black mb-2">
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
              <label htmlFor="subtitle" className="block text-lg font-medium text-black mb-2">
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
              <p className="mt-1 text-base text-black">
                {formData.subtitle.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Items Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-black border-b border-gray-200 pb-2">
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
              className="px-4 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              + Add Item
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
                  {/* Item Media Upload */}
                  <div>
                    <label className="block text-lg font-medium text-black mb-2">
                      Image/Video Upload *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileUpload(index, file);
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                        getFieldError(`galleryItems.${index}.imageUrl`) ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isLoading}
                    />
                    {(item.imageUrl || item.imageFile) && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => handleCropImage(index)}
                          className="px-3 py-1 bg-gray-800 text-white rounded-md"
                          disabled={isLoading}
                        >
                          Crop Image
                        </button>
                      </div>
                    )}
                    {getFieldError(`galleryItems.${index}.imageUrl`) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(`galleryItems.${index}.imageUrl`)}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Supported formats: Images (JPG, PNG, GIF, WebP) - Max 5MB
                    </p>
                  </div>
                  {/* Media Preview */}
                  {(item.imageUrl || item.imageFile) && (
                    <div>
                      <label className="block text-lg font-medium text-black mb-2">Preview</label>
                      <div className="w-full h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={`Gallery item ${index + 1} preview`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      {item.imageFile && (
                        <p className="mt-1 text-base text-gray-600">
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
                    <label className="ml-2 block text-base text-gray-700">
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
          <h3 className="text-2xl font-semibold text-black border-b border-gray-200 pb-2">
            Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sort Order */}
            <div>
              <label htmlFor="sortOrder" className="block text-lg font-medium text-gray-700 mb-2">
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
              <p className="mt-1 text-base text-black">
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
              <label htmlFor="isActive" className="ml-2 block text-base text-black">
                Active (visible to users)
              </label>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-base">
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-base font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
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
    {croppingIndex !== null && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${urbanist.className} bg-white rounded-lg shadow-xl w-full max-w-2xl`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Crop Image</h3>
              <button
                onClick={() => {
                  setCroppingIndex(null);
                  setCroppingImageUrl('');
                  setCrop(undefined);
                  setCompletedCrop(undefined);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={100}
                minHeight={100}
              >
                <img
                  ref={imgRef}
                  src={croppingImageUrl}
                  alt="Crop preview"
                  className="max-h-[70vh]"
                  onLoad={() => {
                    const img = imgRef.current;
                    if (img) {
                      const { width, height } = img;
                      const crop = centerCrop(
                        makeAspectCrop(
                          {
                            unit: '%',
                            width: 50,
                            height: 50
                          },
                          1,
                          width,
                          height
                        ),
                        width,
                        height
                      );
                      setCrop(crop);
                    }
                  }}
                />
              </ReactCrop>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleCompleteCrop}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Apply Crop
                </button>
                <button
                  onClick={() => {
                    setCroppingIndex(null);
                    setCroppingImageUrl('');
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
