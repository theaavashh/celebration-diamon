'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  subCategory?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  status?: string; // "draft", "active", "inactive"
  goldWeight?: string;
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
  metalType?: string;
  stoneType?: string;
  settingType?: string;
  size?: string;
  color?: string;
  finish?: string;
  digitalBrowser?: boolean;
  website?: boolean;
  distributor?: boolean;
  culture?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSlug?: string;
  images?: ProductImage[]; // Add this for multiple images
  videoUrl?: string; // Add videoUrl property
  stoneWeight?: string; // Add stone weight field
  caret?: string; // Add caret field
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSuccess: () => void;
}

// Add this interface for our preview data
interface ProductPreviewData {
  id?: string;
  productCode: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  subCategory?: string;
  price: number;
  isActive: boolean;
  status: string; // "draft", "active", "inactive"
  goldWeight?: string;
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
  metalType?: string;
  stoneType?: string;
  settingType?: string;
  size?: string;
  color?: string;
  finish?: string;
  digitalBrowser: boolean;
  website: boolean;
  distributor: boolean;
  culture?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSlug?: string;
  imageUrl?: string;
  images?: ProductImage[];
  videoUrl?: string;
  stoneWeight?: string; // Add stone weight field
  caret?: string; // Add caret field
  createdAt?: string;
  updatedAt?: string;
}

// Add interface for Category
interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Add interface for Subcategory
interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Validation schema
const productSchema = z.object({
  productCode: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  price: z.string().optional(),
  isActive: z.boolean(),
  status: z.enum(["draft", "active", "inactive"]).default("draft"),
  goldWeight: z.string().optional(),
  diamondDetails: z.string().optional(),
  diamondQuantity: z.string().optional(),
  diamondSize: z.string().optional(),
  diamondWeight: z.string().optional(),
  diamondQuality: z.string().optional(),
  otherGemstones: z.string().optional(),
  orderDuration: z.string().optional(),
  metalType: z.string().optional(),
  stoneType: z.string().optional(),
  settingType: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
  digitalBrowser: z.boolean(),
  website: z.boolean(),
  distributor: z.boolean(),
  culture: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoSlug: z.string().optional(),
  videoUrl: z.string().optional(), // Add video URL validation
  stoneWeight: z.string().optional(), // Add stone weight validation
  caret: z.string().optional(), // Add caret validation
  // Images will be validated separately in the form submission handler
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm({ isOpen, onClose, editingProduct, onSuccess }: ProductFormProps) {
  const { isAuthenticated } = useAuth();
  
  // Add state for categories and subcategories
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  
  // Add state for preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ProductPreviewData | null>(null);
  
  // Refs for image cropping
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // React Hook Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
    reset,
    setValue,
    watch,
    getValues
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productCode: '',
      name: '',
      description: '',
      fullDescription: '',
      category: '',
      subCategory: '',
      price: '',
      isActive: true,
      status: 'draft',
      goldWeight: '',
      diamondDetails: '',
      diamondQuantity: '',
      diamondSize: '',
      diamondWeight: '',
      diamondQuality: '',
      otherGemstones: '',
      orderDuration: '',
      metalType: '',
      stoneType: '',
      settingType: '',
      size: '',
      color: '',
      finish: '',
      digitalBrowser: false,
      website: false,
      distributor: false,
      culture: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoSlug: '',
      videoUrl: '' // Add videoUrl to reset
    }
  });
  
  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        
        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories/admin/all`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('Categories API response:', categoriesData);
          setCategories(categoriesData.data || []);
        }
        
        // Fetch subcategories
        const subcategoriesResponse = await fetch(`${API_BASE_URL}/api/subcategories/admin/all`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (subcategoriesResponse.ok) {
          const subcategoriesData = await subcategoriesResponse.json();
          console.log('Subcategories API response:', subcategoriesData);
          setSubcategories(subcategoriesData.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };
    
    fetchCategoriesAndSubcategories();
  }, []);
  
  // Filter subcategories when category changes
  const watchCategory = watch('category');
  useEffect(() => {
    if (watchCategory) {
      const filtered = subcategories.filter(sub => sub.categoryId === watchCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [watchCategory, subcategories]);
  
  // State is now managed by React Hook Form, removing the old state management
  // const [productForm, setProductForm] = useState({/* ... */});
  const [selectedImages, setSelectedImages] = useState<File[]>([]); // Changed to array
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Changed to array
  // State for video handling
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  // State for image cropping
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppingImageIndex, setCroppingImageIndex] = useState<number | null>(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');
  
  // Handle form changes
  const handleFormChange = (field: keyof ProductFormData, value: any) => {
    setValue(field, value);
  };

  // Handle image selection (multiple images)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      // Instead of replacing, append new files to existing ones
      setSelectedImages(prevImages => [...prevImages, ...fileList]);
      
      // Create preview URLs for all selected images and append to existing previews
      const previewUrls = fileList.map(file => URL.createObjectURL(file));
      setPreviewImages(prevPreviews => [...prevPreviews, ...previewUrls]);
    }
  };

  // Handle image cropping
  const handleCropImage = (index: number) => {
    setCroppingImageIndex(index);
    setCroppingImageUrl(previewImages[index]);
    // Initialize crop with a centered crop
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
  };

  // Complete cropping and update the image
  const handleCompleteCrop = () => {
    if (imgRef.current && completedCrop && croppingImageIndex !== null) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast.error('Failed to create canvas context');
        return;
      }
      
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
      
      // Convert canvas to blob and create a new file
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `cropped-${Date.now()}.png`;
          const croppedFile = new File([blob], fileName, { type: 'image/png' });
          
          // Update the selected images and preview
          const newSelectedImages = [...selectedImages];
          const newPreviewImages = [...previewImages];
          
          newSelectedImages[croppingImageIndex] = croppedFile;
          newPreviewImages[croppingImageIndex] = URL.createObjectURL(croppedFile);
          
          setSelectedImages(newSelectedImages);
          setPreviewImages(newPreviewImages);
          
          // Close cropping modal
          setCroppingImageIndex(null);
          setCroppingImageUrl('');
          setCrop(undefined);
          setCompletedCrop(undefined);
          
          toast.success('Image cropped successfully!');
        }
      }, 'image/png');
    }
  };

  // Reset form
  const resetForm = () => {
    reset({
      productCode: '',
      name: '',
      description: '',
      fullDescription: '',
      category: '',
      subCategory: '',
      price: '',
      isActive: true,
      goldWeight: '',
      diamondDetails: '',
      diamondQuantity: '',
      diamondSize: '',
      diamondWeight: '',
      diamondQuality: '',
      otherGemstones: '',
      orderDuration: '',
      metalType: '',
      stoneType: '',
      settingType: '',
      size: '',
      color: '',
      finish: '',
      digitalBrowser: false,
      website: false,
      distributor: false,
      culture: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoSlug: '',
      videoUrl: '' // Add videoUrl to reset
    });
    setSelectedImages([]);
    setPreviewImages([]);
    setSelectedVideoFile(null);
    setVideoPreview('');
    
    // Reset cropping state
    setCroppingImageIndex(null);
    setCroppingImageUrl('');
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Populate form when editing
  useEffect(() => {
    if (editingProduct && categories.length > 0 && subcategories.length > 0) {
      // Debug: Check if category exists in loaded categories
      const categoryMatch = categories.find(cat => cat.id === editingProduct.category);
      const subCategoryMatch = subcategories.find(sub => sub.id === editingProduct.subCategory);
      
      console.log('Editing product category ID:', editingProduct.category);
      console.log('Editing product subCategory ID:', editingProduct.subCategory);
      console.log('Matching category:', categoryMatch);
      console.log('Matching subcategory:', subCategoryMatch);
      console.log('All categories:', categories);
      console.log('All subcategories:', subcategories);
      console.log('Editing product fullDescription:', editingProduct.fullDescription);
      
      reset({
        productCode: editingProduct.productCode || '',
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        fullDescription: editingProduct.fullDescription || '',
        category: editingProduct.category || '',
        subCategory: editingProduct.subCategory || '',
        price: editingProduct.price?.toString() || '',
        isActive: editingProduct.isActive,
        status: (editingProduct.status as 'draft' | 'active' | 'inactive' | undefined) || 'draft',
        goldWeight: editingProduct.goldWeight || '',
        diamondDetails: editingProduct.diamondDetails || '',
        stoneWeight: editingProduct.stoneWeight || '', // Add stone weight field
        caret: editingProduct.caret || '', // Add caret field
        diamondQuantity: editingProduct.diamondQuantity?.toString() || '',
        diamondSize: editingProduct.diamondSize || '',
        diamondWeight: editingProduct.diamondWeight || '',
        diamondQuality: editingProduct.diamondQuality || '',
        otherGemstones: editingProduct.otherGemstones || '',
        orderDuration: editingProduct.orderDuration || '',
        metalType: editingProduct.metalType || '',
        stoneType: editingProduct.stoneType || '',
        settingType: editingProduct.settingType || '',
        size: editingProduct.size || '',
        color: editingProduct.color || '',
        finish: editingProduct.finish || '',
        digitalBrowser: editingProduct.digitalBrowser || false,
        website: editingProduct.website || false,
        distributor: editingProduct.distributor || false,
        culture: (editingProduct as any).culture || '',
        seoTitle: editingProduct.seoTitle || '',
        seoDescription: editingProduct.seoDescription || '',
        seoKeywords: editingProduct.seoKeywords || '',
        seoSlug: editingProduct.seoSlug || ''
      });
      setSelectedImages([]);
      
      // Set preview images from existing product images
      if (editingProduct.images && editingProduct.images.length > 0) {
        // Use the image URLs for preview
        const imageUrls = editingProduct.images
          .filter(img => img.isActive)
          .sort((a, b) => a.order - b.order)
          .map(img => {
            // Handle different URL formats properly
            if (img.url.startsWith('http')) {
              // Already a full URL
              return img.url;
            } else if (img.url.startsWith('/')) {
              // Absolute path from domain root
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
              const fullUrl = baseUrl.endsWith('/') ? 
                `${baseUrl.slice(0, -1)}${img.url}` : 
                `${baseUrl}${img.url}`;
              return fullUrl;
            } else {
              // Relative path or filename
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
              const basePath = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
              const fullUrl = `${basePath}${img.url}`;
              return fullUrl;
            }
          });
        setPreviewImages(imageUrls);
      } else if (editingProduct.imageUrl) {
        // Fallback to single image URL if no images array
        let fullImageUrl = editingProduct.imageUrl;
        if (!editingProduct.imageUrl.startsWith('http')) {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
          if (editingProduct.imageUrl.startsWith('/')) {
            // Absolute path from domain root
            fullImageUrl = baseUrl.endsWith('/') ? 
              `${baseUrl.slice(0, -1)}${editingProduct.imageUrl}` : 
              `${baseUrl}${editingProduct.imageUrl}`;
          } else {
            // Relative path or filename
            const basePath = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            fullImageUrl = `${basePath}${editingProduct.imageUrl}`;
          }
        }
        setPreviewImages([fullImageUrl]);
      } else {
        setPreviewImages([]);
      }
      
      // Set video preview if editing and product has a video
      if (editingProduct && (editingProduct as any).videoUrl) {
        setVideoPreview((editingProduct as any).videoUrl);
      } else {
        setVideoPreview('');
      }
      setSelectedVideoFile(null);
    } else if (!editingProduct) {
      resetForm();
    }
  }, [editingProduct, reset, categories, subcategories]);

  // Handle form submission with React Hook Form
  const onSubmit = async (data: ProductFormData) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error('Authentication required. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }
      
      // Try to get token from localStorage as fallback (for API calls that need Bearer token)
      const authToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      // Images are now optional for new products
      // if (!editingProduct && selectedImages.length === 0) {
      //   toast.error('At least one product image is required');
      //   return;
      // }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('productCode', data.productCode || '');
      formData.append('name', data.name || '');
      formData.append('description', data.description || '');
      if (data.fullDescription) {
        formData.append('fullDescription', data.fullDescription);
      }
      formData.append('category', data.category || '');
      formData.append('subCategory', data.subCategory || '');
      // Only append price if it has a value (make it optional)
      if (data.price && data.price.trim() !== '') {
        formData.append('price', data.price);
      }
      formData.append('isActive', data.isActive.toString());
      formData.append('status', data.status);
      formData.append('goldWeight', data.goldWeight || '');

      formData.append('diamondDetails', data.diamondDetails || '');
      formData.append('stoneWeight', data.stoneWeight || ''); // Add stone weight field
      formData.append('caret', data.caret || ''); // Add caret field
      formData.append('diamondQuantity', data.diamondQuantity || '');
      formData.append('diamondSize', data.diamondSize || '');
      formData.append('diamondWeight', data.diamondWeight || '');
      formData.append('diamondQuality', data.diamondQuality || '');
      formData.append('otherGemstones', data.otherGemstones || '');
      formData.append('orderDuration', data.orderDuration || '');
      formData.append('metalType', data.metalType || '');
      formData.append('stoneType', data.stoneType || '');
      formData.append('settingType', data.settingType || '');
      formData.append('size', data.size || '');
      formData.append('color', data.color || '');
      formData.append('finish', data.finish || '');
      formData.append('digitalBrowser', data.digitalBrowser.toString());
      formData.append('website', data.website.toString());
      formData.append('distributor', data.distributor.toString());
      if (data.culture) {
        formData.append('culture', data.culture);
      }
      if (data.seoTitle) {
        formData.append('seoTitle', data.seoTitle);
      }
      if (data.seoDescription) {
        formData.append('seoDescription', data.seoDescription);
      }
      if (data.seoKeywords) {
        formData.append('seoKeywords', data.seoKeywords);
      }
      formData.append('seoSlug', data.seoSlug || '');
      if (data.videoUrl) {
        formData.append('videoUrl', data.videoUrl);
      }
      
      // Handle image uploads
      if (selectedImages.length > 0) {
        // If new images are selected, upload them
        console.log('Uploading new images:', selectedImages.length);
        selectedImages.forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (editingProduct && editingProduct.images && editingProduct.images.length > 0) {
        // If editing and no new images are selected, preserve the existing image URLs
        console.log('Preserving existing image URLs:', editingProduct.images.length);
        const imageUrls = editingProduct.images
          .filter(img => img.isActive)
          .sort((a, b) => a.order - b.order)
          .map(img => img.url);
        // Only append imageUrls if there are images to preserve
        if (imageUrls.length > 0) {
          formData.append('imageUrls', JSON.stringify(imageUrls));
        }
      }
      
      // Handle video upload
      if (selectedVideoFile) {
        formData.append('video', selectedVideoFile);
      }
      
      // Make API request
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `${apiUrl}/${editingProduct.id}` : apiUrl;
      
      const response = await fetch(url, {
        method,
        body: formData,
        // Don't set Content-Type header when using FormData
        credentials: 'include', // Send cookies
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        onSuccess();
        onClose();
      } else {
        console.error('API error:', result);
        toast.error(result.message || (editingProduct ? 'Failed to update product' : 'Failed to create product'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form');
    }
  };

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Code
                </label>
                <Controller
                  name="productCode"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.productCode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter Product Code"
                    />
                  )}
                />
                {errors.productCode && <p className="text-red-500 text-sm mt-1">{errors.productCode.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Product Name"
                    />
                  )}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    rows={6}
                    placeholder="Enter product description"
                  />
                )}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <Controller
                name="fullDescription"
                control={control}
                render={({ field }) => {
                  console.log('Full description field value:', field.value);
                  return (
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
              {errors.fullDescription && <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message}</p>}
            </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                      value={field.value || ''}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${errors.subCategory ? 'border-red-500' : 'border-gray-300'}`}
                      value={field.value || ''}
                      disabled={!watchCategory}
                    >
                      <option value="">Select Sub Category</option>
                      {filteredSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="0.00"
                    />
                  )}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>

            {/* Culture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Background
                </label>
                <Controller
                  name="culture"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${errors.culture ? 'border-red-500' : 'border-gray-300'}`}
                      value={field.value || ''}
                    >
                      <option value="">Select Culture</option>
                      <option value="None">None</option>
                      <option value="Newari">Newari</option>
                      <option value="Brahmin/Chhetri">Brahmin/Chhetri</option>
                      <option value="Tamang">Tamang</option>
                    </select>
                  )}
                />
                {errors.culture && <p className="text-red-500 text-sm mt-1">{errors.culture.message}</p>}
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-auto object-contain rounded-lg border border-gray-300 max-h-64"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleCropImage(index)}
                        className="bg-white text-black px-2 py-1 rounded text-xs font-medium"
                      >
                        Crop
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPreviewImages = previewImages.filter((_, i) => i !== index);
                        const newSelectedImages = selectedImages.filter((_, i) => i !== index);
                        setPreviewImages(newPreviewImages);
                        setSelectedImages(newSelectedImages);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {previewImages.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500 mt-2">Add Image</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Video
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500 mt-2">Upload Video</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                  </label>
                </div>
                {videoPreview && (
                  <div className="relative">
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full h-auto object-contain rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview('');
                        setSelectedVideoFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Jewelry Specific Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Jewelry Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gold Weight
                  </label>
                  <Controller
                    name="goldWeight"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldWeight ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="4 gms approx"
                        />
                        {errors.goldWeight && <p className="text-red-500 text-sm mt-1">{errors.goldWeight.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metal Type
                  </label>
                  <Controller
                    name="metalType"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.metalType ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="14k/18k"
                        />
                        {errors.metalType && <p className="text-red-500 text-sm mt-1">{errors.metalType.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Details
                  </label>
                  <Controller
                    name="diamondDetails"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondDetails ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="-"
                        />
                        {errors.diamondDetails && <p className="text-red-500 text-sm mt-1">{errors.diamondDetails.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stone Weight
                  </label>
                  <Controller
                    name="stoneWeight"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.stoneWeight ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Stone weight"
                        />
                        {errors.stoneWeight && <p className="text-red-500 text-sm mt-1">{errors.stoneWeight.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caret
                  </label>
                  <Controller
                    name="caret"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.caret ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Caret measurement"
                        />
                        {errors.caret && <p className="text-red-500 text-sm mt-1">{errors.caret.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Quantity
                  </label>
                  <Controller
                    name="diamondQuantity"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="number"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondQuantity ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="0"
                        />
                        {errors.diamondQuantity && <p className="text-red-500 text-sm mt-1">{errors.diamondQuantity.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Size
                  </label>
                  <Controller
                    name="diamondSize"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondSize ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Size"
                        />
                        {errors.diamondSize && <p className="text-red-500 text-sm mt-1">{errors.diamondSize.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stone Type
                  </label>
                  <Controller
                    name="stoneType"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.stoneType ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Diamond, Ruby, etc."
                        />
                        {errors.stoneType && <p className="text-red-500 text-sm mt-1">{errors.stoneType.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setting Type
                  </label>
                  <Controller
                    name="settingType"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.settingType ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Prong, Bezel, etc."
                        />
                        {errors.settingType && <p className="text-red-500 text-sm mt-1">{errors.settingType.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Gemstones
                  </label>
                  <Controller
                    name="otherGemstones"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.otherGemstones ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Other gemstones used"
                        />
                        {errors.otherGemstones && <p className="text-red-500 text-sm mt-1">{errors.otherGemstones.message}</p>}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Ring size, etc."
                        />
                        {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Gold color"
                        />
                        {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
                      </>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Finish
                  </label>
                  <Controller
                    name="finish"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.finish ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Polished, Matte, etc."
                        />
                        {errors.finish && <p className="text-red-500 text-sm mt-1">{errors.finish.message}</p>}
                      </>
                    )}
                  />
                </div>
                {/* Status Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
                        value={field.value}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    )}
                  />
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                </div>
              </div>
            </div>

            {/* Distribution Channels */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Controller
                    name="digitalBrowser"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Digital Browser
                  </label>
                </div>
                <div className="flex items-center">
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Website
                  </label>
                </div>
                <div className="flex items-center">
                  <Controller
                    name="distributor"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Distributor
                  </label>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <Controller
                    name="seoTitle"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.seoTitle ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Meta title"
                      />
                    )}
                  />
                  {errors.seoTitle && <p className="text-red-500 text-sm mt-1">{errors.seoTitle.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Slug
                  </label>
                  <Controller
                    name="seoSlug"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.seoSlug ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="URL slug"
                      />
                    )}
                  />
                  {errors.seoSlug && <p className="text-red-500 text-sm mt-1">{errors.seoSlug.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <Controller
                    name="seoDescription"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.seoDescription ? 'border-red-500' : 'border-gray-300'}`}
                        rows={3}
                        placeholder="Meta description"
                      />
                    )}
                  />
                  {errors.seoDescription && <p className="text-red-500 text-sm mt-1">{errors.seoDescription.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <Controller
                    name="seoKeywords"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.seoKeywords ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Meta keywords (comma separated)"
                      />
                    )}
                  />
                  {errors.seoKeywords && <p className="text-red-500 text-sm mt-1">{errors.seoKeywords.message}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={formIsSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Get current form data for preview
                  const formData = getValues();
                  const previewProduct: ProductPreviewData = {
                    id: editingProduct?.id,
                    productCode: formData.productCode || '',
                    name: formData.name || '',
                    description: formData.description || '',
                    fullDescription: formData.fullDescription,
                    category: formData.category || '',
                    subCategory: formData.subCategory,
                    price: formData.price ? parseFloat(formData.price) : 0,
                    isActive: formData.isActive,
                    status: formData.status || 'draft',
                    goldWeight: formData.goldWeight,
                    diamondDetails: formData.diamondDetails,
                    diamondQuantity: formData.diamondQuantity ? parseInt(formData.diamondQuantity) : undefined,
                    diamondSize: formData.diamondSize,
                    diamondWeight: formData.diamondWeight,
                    diamondQuality: formData.diamondQuality,
                    otherGemstones: formData.otherGemstones,
                    orderDuration: formData.orderDuration,
                    metalType: formData.metalType,
                    stoneType: formData.stoneType,
                    settingType: formData.settingType,
                    size: formData.size,
                    color: formData.color,
                    finish: formData.finish,
                    digitalBrowser: formData.digitalBrowser,
                    website: formData.website,
                    distributor: formData.distributor,
                    culture: formData.culture,
                    seoTitle: formData.seoTitle,
                    seoDescription: formData.seoDescription,
                    seoKeywords: formData.seoKeywords,
                    seoSlug: formData.seoSlug,
                    stoneWeight: formData.stoneWeight, // Add stone weight field
                    caret: formData.caret, // Add caret field
                    // For images, prioritize previewImages if available, otherwise use editingProduct images
                    imageUrl: previewImages.length > 0 ? previewImages[0] : editingProduct?.imageUrl,
                    images: previewImages.length > 0 
                      ? previewImages.map((url, index) => ({
                          id: `preview-${index}`,
                          url,
                          altText: '',
                          order: index,
                          isActive: true,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        })) 
                      : editingProduct?.images,
                    videoUrl: formData.videoUrl || editingProduct?.videoUrl,
                    createdAt: editingProduct?.createdAt,
                    updatedAt: editingProduct?.updatedAt
                  };
                  setPreviewData(previewProduct);
                  setIsPreviewOpen(true);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                disabled={formIsSubmitting}
              >
                Preview
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={formIsSubmitting}
              >
                {formIsSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && previewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Preview</h2>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-black">
                  <h3 className="text-xl font-semibold mb-4">{previewData.name}</h3>
                  <p className="mb-4">{previewData.description}</p>
                  
                  {previewData.fullDescription && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Full Description:</h4>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewData.fullDescription || '' }} 
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-2">
                        {categories.find(c => c.id === previewData.category)?.title || previewData.category}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Subcategory:</span>
                      <span className="ml-2">
                        {subcategories.find(s => s.id === previewData.subCategory)?.name || previewData.subCategory}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <span className="ml-2">Rs. {previewData.price.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className="ml-2 capitalize">{previewData.status}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {previewData.goldWeight && (
                      <div>
                        <span className="font-medium">Gold Weight:</span>
                        <span className="ml-2">{previewData.goldWeight}</span>
                      </div>
                    )}
                    
                    {previewData.diamondDetails && (
                      <div>
                        <span className="font-medium">Diamond Details:</span>
                        <span className="ml-2">{previewData.diamondDetails}</span>
                      </div>
                    )}
                    
                    {previewData.diamondQuantity !== undefined && (
                      <div>
                        <span className="font-medium">Diamond Quantity:</span>
                        <span className="ml-2">{previewData.diamondQuantity}</span>
                      </div>
                    )}
                    
                    {previewData.diamondSize && (
                      <div>
                        <span className="font-medium">Diamond Size:</span>
                        <span className="ml-2">{previewData.diamondSize}</span>
                      </div>
                    )}
                    
                    {previewData.diamondWeight && (
                      <div>
                        <span className="font-medium">Diamond Weight:</span>
                        <span className="ml-2">{previewData.diamondWeight}</span>
                      </div>
                    )}
                    
                    {previewData.diamondQuality && (
                      <div>
                        <span className="font-medium">Diamond Quality:</span>
                        <span className="ml-2">{previewData.diamondQuality}</span>
                      </div>
                    )}
                    
                    {previewData.stoneWeight && (
                      <div>
                        <span className="font-medium">Stone Weight:</span>
                        <span className="ml-2">{previewData.stoneWeight}</span>
                      </div>
                    )}
                    
                    {previewData.caret && (
                      <div>
                        <span className="font-medium">Caret:</span>
                        <span className="ml-2">{previewData.caret}</span>
                      </div>
                    )}
                    
                    {previewData.otherGemstones && (
                      <div>
                        <span className="font-medium">Other Gemstones:</span>
                        <span className="ml-2">{previewData.otherGemstones}</span>
                      </div>
                    )}
                    
                    {previewData.metalType && (
                      <div>
                        <span className="font-medium">Metal Type:</span>
                        <span className="ml-2">{previewData.metalType}</span>
                      </div>
                    )}
                    
                    {previewData.stoneType && (
                      <div>
                        <span className="font-medium">Stone Type:</span>
                        <span className="ml-2">{previewData.stoneType}</span>
                      </div>
                    )}
                    
                    {previewData.settingType && (
                      <div>
                        <span className="font-medium">Setting Type:</span>
                        <span className="ml-2">{previewData.settingType}</span>
                      </div>
                    )}
                    
                    {previewData.size && (
                      <div>
                        <span className="font-medium">Size:</span>
                        <span className="ml-2">{previewData.size}</span>
                      </div>
                    )}
                    
                    {previewData.color && (
                      <div>
                        <span className="font-medium">Color:</span>
                        <span className="ml-2">{previewData.color}</span>
                      </div>
                    )}
                    
                    {previewData.finish && (
                      <div>
                        <span className="font-medium">Finish:</span>
                        <span className="ml-2">{previewData.finish}</span>
                      </div>
                    )}
                    
                    {previewData.orderDuration && (
                      <div>
                        <span className="font-medium">Order Duration:</span>
                        <span className="ml-2">{previewData.orderDuration}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="font-medium">Digital Browser:</span>
                      <span className="ml-2">{previewData.digitalBrowser ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Website:</span>
                      <span className="ml-2">{previewData.website ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Distributor:</span>
                      <span className="ml-2">{previewData.distributor ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  
                  {previewData.culture && (
                    <div className="mb-2">
                      <span className="font-medium">Cultural Background:</span>
                      <span className="ml-2">{previewData.culture}</span>
                    </div>
                  )}
                  
                  {(previewData.seoTitle || previewData.seoDescription || previewData.seoKeywords || previewData.seoSlug) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium mb-2">SEO Information:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {previewData.seoTitle && (
                          <div>
                            <span className="font-medium">Title:</span>
                            <span className="ml-2">{previewData.seoTitle}</span>
                          </div>
                        )}
                        {previewData.seoSlug && (
                          <div>
                            <span className="font-medium">Slug:</span>
                            <span className="ml-2">{previewData.seoSlug}</span>
                          </div>
                        )}
                        {previewData.seoDescription && (
                          <div>
                            <span className="font-medium">Description:</span>
                            <span className="ml-2">{previewData.seoDescription}</span>
                          </div>
                        )}
                        {previewData.seoKeywords && (
                          <div>
                            <span className="font-medium">Keywords:</span>
                            <span className="ml-2">{previewData.seoKeywords}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-black">
                  {previewData.images && previewData.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {previewData.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image.url} 
                          alt={`Product ${index + 1}`} 
                          className="w-full h-auto object-contain rounded-lg"
                        />
                      ))}
                    </div>
                  ) : previewData.imageUrl ? (
                    <img 
                      src={previewData.imageUrl} 
                      alt="Product" 
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-auto flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  
                  {previewData.videoUrl && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Product Video:</h4>
                      <video 
                        src={previewData.videoUrl} 
                        controls 
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropping Modal */}
      {croppingImageIndex !== null && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Crop Image</h2>
                <button
                  onClick={() => {
                    setCroppingImageIndex(null);
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
                  minWidth={50}
                >
                  <img
                    ref={imgRef}
                    src={croppingImageUrl}
                    alt="Crop preview"
                    className="max-h-[60vh]"
                  />
                </ReactCrop>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setCroppingImageIndex(null);
                      setCroppingImageUrl('');
                      setCrop(undefined);
                      setCompletedCrop(undefined);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteCrop}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}