'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCsrfToken, getCsrfToken } from '@/lib/csrfClient';
import RichTextEditor from './RichTextEditor';
import DynamicDropdown from './DynamicDropdown';
import { productAttributeService } from '@/services/productAttributeService';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Enhanced Product interface with proper typing
interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  subCategory?: string;
  jewelryType?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  status: 'draft' | 'active' | 'inactive';
  
  // Gold Fields
  goldWeight?: string;
  goldPurity?: string;
  goldType?: string;
  goldCraftsmanship?: string;
  goldDesignDescription?: string;
  goldFinishedType?: string;
  goldStones?: string;
  goldStoneQuality?: string;
  
  // Diamond Fields
  diamondType?: string;
  diamondShapeCut?: string;
  diamondColorGrade?: string;
  diamondClarityGrade?: string;
  diamondCutGrade?: string;
  diamondMetalDetails?: string;
  diamondCertification?: string;
  diamondOrigin?: string;
  diamondCaratWeight?: string;
  
  // Platinum Fields
  platinumWeight?: string;
  platinumType?: string;
  
  // Silver Fields
  silverWeight?: string;
  silverType?: string;
  
  // Additional Fields
  orderDuration?: string;
  digitalBrowser?: boolean;
  website?: boolean;
  distributor?: boolean;
  culture?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSlug?: string;
  images?: ProductImage[];
  videoUrl?: string;
  stoneWeight?: string;
  caret?: string;
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

// Enhanced ProductPreviewData interface
interface ProductPreviewData {
  id?: string;
  productCode: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  subCategory?: string;
  jewelryType?: string;
  price: number;
  isActive: boolean;
  status: 'draft' | 'active' | 'inactive';
  
  // Gold Fields
  goldWeight?: string;
  goldPurity?: string;
  goldType?: string;
  goldCraftsmanship?: string;
  goldDesignDescription?: string;
  goldFinishedType?: string;
  goldStones?: string;
  goldStoneQuality?: string;
  
  // Diamond Fields
  diamondType?: string;
  diamondShapeCut?: string;
  diamondColorGrade?: string;
  diamondClarityGrade?: string;
  diamondCutGrade?: string;
  diamondMetalDetails?: string;
  diamondCertification?: string;
  diamondOrigin?: string;
  diamondCaratWeight?: string;
  
  // Platinum Fields
  platinumWeight?: string;
  platinumType?: string;
  
  // Silver Fields
  silverWeight?: string;
  silverType?: string;
  
  // Additional Fields
  orderDuration?: string;
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
  stoneWeight?: string;
  caret?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

// Enhanced validation schema with better error messages
const productSchema = z.object({
  productCode: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  fullDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  jewelryType: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  isActive: z.boolean(),
  status: z.enum(['draft', 'active', 'inactive']).default('draft'),
  
  // Gold Fields
  goldWeight: z.string().optional(),
  goldPurity: z.string().optional(),
  goldType: z.string().optional(),
  goldCraftsmanship: z.string().optional(),
  goldDesignDescription: z.string().optional(),
  goldFinishedType: z.string().optional(),
  goldStones: z.string().optional(),
  goldStoneQuality: z.string().optional(),
  
  // Diamond Fields
  diamondType: z.string().optional(),
  diamondShapeCut: z.string().optional(),
  diamondColorGrade: z.string().optional(),
  diamondClarityGrade: z.string().optional(),
  diamondCutGrade: z.string().optional(),
  diamondMetalDetails: z.string().optional(),
  diamondCertification: z.string().optional(),
  diamondOrigin: z.string().optional(),
  diamondCaratWeight: z.string().optional(),
  
  // Platinum Fields
  platinumWeight: z.string().optional(),
  platinumType: z.string().optional(),
  
  // Silver Fields
  silverWeight: z.string().optional(),
  silverType: z.string().optional(),
  
  digitalBrowser: z.boolean(),
  website: z.boolean(),
  distributor: z.boolean(),
  culture: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoSlug: z.string().optional(),
  videoUrl: z.string().optional(),
  stoneWeight: z.string().optional(),
  caret: z.string().optional(),
  orderDuration: z.string().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm({ isOpen, onClose, editingProduct, onSuccess }: ProductFormProps) {
  const { isAuthenticated } = useAuth();
  
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ProductPreviewData | null>(null);
  
  // Image cropping refs
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Form setup with React Hook Form
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
    reset,
    setValue,
    watch,
    getValues
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productCode: '',
      name: '',
      description: '',
      fullDescription: '',
      category: '',
      subCategory: '',
      jewelryType: '',
      price: '',
      isActive: true,
      status: 'draft',
      
      // Gold Fields
      goldWeight: '',
      goldPurity: '',
      goldType: '',
      goldCraftsmanship: '',
      goldDesignDescription: '',
      goldFinishedType: '',
      goldStones: '',
      goldStoneQuality: '',
      
      // Diamond Fields
      diamondType: '',
      diamondShapeCut: '',
      diamondColorGrade: '',
      diamondClarityGrade: '',
      diamondCutGrade: '',
      diamondMetalDetails: '',
      diamondCertification: '',
      diamondOrigin: '',
      diamondCaratWeight: '',
      
      // Platinum Fields
      platinumWeight: '',
      platinumType: '',
      
      // Silver Fields
      silverWeight: '',
      silverType: '',
      
      digitalBrowser: false,
      website: false,
      distributor: false,
      culture: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoSlug: '',
      videoUrl: '',
      stoneWeight: '',
      caret: '',
      orderDuration: '',
    }
  });
  
  // Watch category field for subcategory filtering
  const watchCategory = watch('category');
  
  // Image and video state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  // Image cropping state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppingImageIndex, setCroppingImageIndex] = useState<number | null>(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');

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
          setSubcategories(subcategoriesData.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
        toast.error('Failed to load categories and subcategories');
      }
    };
    
    fetchCategoriesAndSubcategories();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (watchCategory) {
      const filtered = subcategories.filter(sub => sub.categoryId === watchCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [watchCategory, subcategories]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setSelectedImages(prevImages => [...prevImages, ...fileList]);
      
      const previewUrls = fileList.map(file => URL.createObjectURL(file));
      setPreviewImages(prevPreviews => [...prevPreviews, ...previewUrls]);
    }
  };

  // Handle image cropping
  const handleCropImage = (index: number) => {
    setCroppingImageIndex(index);
    setCroppingImageUrl(previewImages[index]);
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
  };

  // Complete image cropping
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
      
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `cropped-${Date.now()}.png`;
          const croppedFile = new File([blob], fileName, { type: 'image/png' });
          
          const newSelectedImages = [...selectedImages];
          const newPreviewImages = [...previewImages];
          
          newSelectedImages[croppingImageIndex] = croppedFile;
          newPreviewImages[croppingImageIndex] = URL.createObjectURL(croppedFile);
          
          setSelectedImages(newSelectedImages);
          setPreviewImages(newPreviewImages);
          
          setCroppingImageIndex(null);
          setCroppingImageUrl('');
          setCrop(undefined);
          setCompletedCrop(undefined);
          
          toast.success('Image cropped successfully!');
        }
      }, 'image/png');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    reset({
      productCode: '',
      name: '',
      description: '',
      fullDescription: '',
      category: '',
      subCategory: '',
      jewelryType: '',
      price: '',
      isActive: true,
      status: 'draft',
      
      // Gold Fields
      goldWeight: '',
      goldPurity: '',
      goldType: '',
      goldCraftsmanship: '',
      goldDesignDescription: '',
      goldFinishedType: '',
      goldStones: '',
      goldStoneQuality: '',
      
      // Diamond Fields
      diamondType: '',
      diamondShapeCut: '',
      diamondColorGrade: '',
      diamondClarityGrade: '',
      diamondCutGrade: '',
      diamondMetalDetails: '',
      diamondCertification: '',
      diamondOrigin: '',
      diamondCaratWeight: '',
      
      // Platinum Fields
      platinumWeight: '',
      platinumType: '',
      
      // Silver Fields
      silverWeight: '',
      silverType: '',
      
      digitalBrowser: false,
      website: false,
      distributor: false,
      culture: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoSlug: '',
      videoUrl: '',
      stoneWeight: '',
      caret: '',
      orderDuration: ''
    });
    setSelectedImages([]);
    setPreviewImages([]);
    setSelectedVideoFile(null);
    setVideoPreview('');
    
    setCroppingImageIndex(null);
    setCroppingImageUrl('');
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Populate form when editing
  useEffect(() => {
    if (editingProduct && categories.length > 0 && subcategories.length > 0) {
      reset({
        productCode: editingProduct.productCode || '',
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        fullDescription: editingProduct.fullDescription || '',
        category: editingProduct.category || '',
        subCategory: editingProduct.subCategory || '',
        jewelryType: editingProduct.jewelryType || '',
        price: editingProduct.price?.toString() || '',
        isActive: editingProduct.isActive,
        status: editingProduct.status || 'draft',
        
        // Gold Fields
        goldWeight: editingProduct.goldWeight || '',
        goldPurity: editingProduct.goldPurity || '',
        goldType: editingProduct.goldType || '',
        goldCraftsmanship: editingProduct.goldCraftsmanship || '',
        goldDesignDescription: editingProduct.goldDesignDescription || '',
        goldFinishedType: editingProduct.goldFinishedType || '',
        goldStones: editingProduct.goldStones || '',
        goldStoneQuality: editingProduct.goldStoneQuality || '',
        
        // Diamond Fields
        diamondType: editingProduct.diamondType || '',
        diamondShapeCut: editingProduct.diamondShapeCut || '',
        diamondColorGrade: editingProduct.diamondColorGrade || '',
        diamondClarityGrade: editingProduct.diamondClarityGrade || '',
        diamondCutGrade: editingProduct.diamondCutGrade || '',
        diamondMetalDetails: editingProduct.diamondMetalDetails || '',
        diamondCertification: editingProduct.diamondCertification || '',
        diamondOrigin: editingProduct.diamondOrigin || '',
        diamondCaratWeight: editingProduct.diamondCaratWeight || '',
        
        // Platinum Fields
        platinumWeight: editingProduct.platinumWeight || '',
        platinumType: editingProduct.platinumType || '',
        
        // Silver Fields
        silverWeight: editingProduct.silverWeight || '',
        silverType: editingProduct.silverType || '',
        
        digitalBrowser: editingProduct.digitalBrowser || false,
        website: editingProduct.website || false,
        distributor: editingProduct.distributor || false,
        culture: editingProduct.culture || '',
        seoTitle: editingProduct.seoTitle || '',
        seoDescription: editingProduct.seoDescription || '',
        seoKeywords: editingProduct.seoKeywords || '',
        seoSlug: editingProduct.seoSlug || ''
      });
      setSelectedImages([]);
      
      // Set preview images
      if (editingProduct.images && editingProduct.images.length > 0) {
        const imageUrls = editingProduct.images
          .filter(img => img.isActive)
          .sort((a, b) => a.order - b.order)
          .map(img => {
            if (img.url.startsWith('http')) {
              return img.url;
            } else if (img.url.startsWith('/')) {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
              const fullUrl = baseUrl.endsWith('/') ? 
                `${baseUrl.slice(0, -1)}${img.url}` : 
                `${baseUrl}${img.url}`;
              return fullUrl;
            } else {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
              const basePath = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
              const fullUrl = `${basePath}${img.url}`;
              return fullUrl;
            }
          });
        setPreviewImages(imageUrls);
      } else if (editingProduct.imageUrl) {
        let fullImageUrl = editingProduct.imageUrl;
        if (!editingProduct.imageUrl.startsWith('http')) {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
          if (editingProduct.imageUrl.startsWith('/')) {
            fullImageUrl = baseUrl.endsWith('/') ? 
              `${baseUrl.slice(0, -1)}${editingProduct.imageUrl}` : 
              `${baseUrl}${editingProduct.imageUrl}`;
          } else {
            const basePath = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            fullImageUrl = `${basePath}${editingProduct.imageUrl}`;
          }
        }
        setPreviewImages([fullImageUrl]);
      } else {
        setPreviewImages([]);
      }
      
      // Set video preview
      if (editingProduct.videoUrl) {
        setVideoPreview(editingProduct.videoUrl);
      } else {
        setVideoPreview('');
      }
      setSelectedVideoFile(null);
    } else if (!editingProduct) {
      resetForm();
    }
  }, [editingProduct, reset, categories, subcategories]);

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;
      
      if (!isAuthenticated) {
        toast.error('Authentication required. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return;
      }
      
      const formData = new FormData();
      formData.append('productCode', data.productCode || '');
      formData.append('name', data.name || '');
      formData.append('description', data.description || '');
      if (data.fullDescription) {
        formData.append('fullDescription', data.fullDescription);
      }
      formData.append('category', data.category || '');
      formData.append('subCategory', data.subCategory || '');
      if (data.jewelryType) {
        formData.append('jewelryType', data.jewelryType);
      }
      if (data.price && data.price.trim() !== '') {
        formData.append('price', data.price);
      }
      formData.append('isActive', data.isActive.toString());
      formData.append('status', data.status);
      
      // Gold Fields
      formData.append('goldWeight', data.goldWeight || '');
      formData.append('goldPurity', data.goldPurity || '');
      formData.append('goldType', data.goldType || '');
      formData.append('goldCraftsmanship', data.goldCraftsmanship || '');
      formData.append('goldDesignDescription', data.goldDesignDescription || '');
      formData.append('goldFinishedType', data.goldFinishedType || '');
      formData.append('goldStones', data.goldStones || '');
      formData.append('goldStoneQuality', data.goldStoneQuality || '');
      
      // Diamond Fields
      formData.append('diamondType', data.diamondType || '');
      formData.append('diamondShapeCut', data.diamondShapeCut || '');
      formData.append('diamondColorGrade', data.diamondColorGrade || '');
      formData.append('diamondClarityGrade', data.diamondClarityGrade || '');
      formData.append('diamondCutGrade', data.diamondCutGrade || '');
      formData.append('diamondMetalDetails', data.diamondMetalDetails || '');
      formData.append('diamondCertification', data.diamondCertification || '');
      formData.append('diamondOrigin', data.diamondOrigin || '');
      formData.append('diamondCaratWeight', data.diamondCaratWeight || '');
      
      // Platinum Fields
      formData.append('platinumWeight', data.platinumWeight || '');
      formData.append('platinumType', data.platinumType || '');
      
      // Silver Fields
      formData.append('silverWeight', data.silverWeight || '');
      formData.append('silverType', data.silverType || '');
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
        selectedImages.forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (editingProduct && editingProduct.images && editingProduct.images.length > 0) {
        const imageUrls = editingProduct.images
          .filter(img => img.isActive)
          .sort((a, b) => a.order - b.order)
          .map(img => img.url);
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
      
      console.log('Making API request:', { method, url, formData });
      
      // Ensure we have a CSRF token
      const token = await fetchCsrfToken();
      if (!token) {
        console.error('Failed to fetch CSRF token');
        toast.error('Authentication failed. Please refresh the page and try again.');
        return;
      }
      
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
        headers: {
          'x-csrf-token': token
        }
      });
      
      console.log('API response received:', { status: response.status, statusText: response.statusText, headers: Object.fromEntries(response.headers.entries()) });
      
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('JSON response body:', result);
      } else {
        const text = await response.text();
        console.log('Text response body:', text);
        result = {
          success: response.ok,
          message: response.ok ? 'Success' : `HTTP ${response.status}: ${response.statusText}`,
          data: text
        };
      }
      
      if (response.ok && result.success) {
        Object.keys(data).forEach(key => {
          if ([
            'diamondType', 'diamondShapeCut', 'diamondColorGrade', 'diamondClarityGrade', 
            'diamondCutGrade', 'diamondMetalDetails', 'diamondCertification', 'diamondOrigin',
            'diamondCaratWeight', 'goldPurity', 'goldType', 'goldCraftsmanship', 
            'goldDesignDescription', 'goldFinishedType', 'goldStones', 'goldStoneQuality',
            'platinumType', 'silverType'
          ].includes(key)) {
            const value = data[key as keyof ProductFormData];
            if (value && typeof value === 'string') {
              productAttributeService.addToCache(key as any, value);
            }
          }
        });
        
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        onSuccess();
        onClose();
      } else {
        console.error('API error:', result);
        console.error('Request URL:', url);
        console.error('Request method:', method);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
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
                  Product Name *
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
                Description *
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    rows={10}
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
                  return (
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      height="500px"
                    />
                  );
                }}
              />
              {errors.fullDescription && <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message}</p>}
            </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
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
                  Jewelry Type
                </label>
                <Controller
                  name="jewelryType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${errors.jewelryType ? 'border-red-500' : 'border-gray-300'}`}
                      value={field.value || ''}
                    >
                      <option value="">Select Jewelry Type</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Kids">Kids</option>
                    </select>
                  )}
                />
                {errors.jewelryType && <p className="text-red-500 text-sm mt-1">{errors.jewelryType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
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

            {/* Diamond Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diamond Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Type
                  </label>
                  <Controller
                    name="diamondType"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondType"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter diamond type"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondType ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondType && <p className="text-red-500 text-sm mt-1">{errors.diamondType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Shape/Cut
                  </label>
                  <Controller
                    name="diamondShapeCut"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondShapeCut"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter shape/cut"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondShapeCut ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondShapeCut && <p className="text-red-500 text-sm mt-1">{errors.diamondShapeCut.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Grade
                  </label>
                  <Controller
                    name="diamondColorGrade"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondColorGrade"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter color grade"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondColorGrade ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondColorGrade && <p className="text-red-500 text-sm mt-1">{errors.diamondColorGrade.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <Controller
                    name="diamondOrigin"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondOrigin"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter origin"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondOrigin ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondOrigin && <p className="text-red-500 text-sm mt-1">{errors.diamondOrigin.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clarity
                  </label>
                  <Controller
                    name="diamondClarityGrade"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondClarityGrade"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter clarity"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondClarityGrade ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondClarityGrade && <p className="text-red-500 text-sm mt-1">{errors.diamondClarityGrade.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cut Grade
                  </label>
                  <Controller
                    name="diamondCutGrade"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondCutGrade"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter cut grade"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondCutGrade ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondCutGrade && <p className="text-red-500 text-sm mt-1">{errors.diamondCutGrade.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metal Details
                  </label>
                  <Controller
                    name="diamondMetalDetails"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondMetalDetails"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter metal details"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondMetalDetails ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondMetalDetails && <p className="text-red-500 text-sm mt-1">{errors.diamondMetalDetails.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification
                  </label>
                  <Controller
                    name="diamondCertification"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondCertification"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter certification"
                        forceDropdown={true}
                        allowCustomValue={true}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondCertification ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondCertification && <p className="text-red-500 text-sm mt-1">{errors.diamondCertification.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carat Weight
                  </label>
                  <Controller
                    name="diamondCaratWeight"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="diamondCaratWeight"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter carat weight"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.diamondCaratWeight ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.diamondCaratWeight && <p className="text-red-500 text-sm mt-1">{errors.diamondCaratWeight.message}</p>}
                </div>
              </div>
            </div>

            {/* Gold Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gold Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gold Purity
                  </label>
                  <Controller
                    name="goldPurity"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldPurity"
                        value={field.value || ''}
                        onChange={field.onChange}
                        forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter gold purity"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldPurity ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldPurity && <p className="text-red-500 text-sm mt-1">{errors.goldPurity.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gold Type
                  </label>
                  <Controller
                    name="goldType"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldType"
                        value={field.value || ''}
                        onChange={field.onChange}
                         forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter gold type"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldType ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldType && <p className="text-red-500 text-sm mt-1">{errors.goldType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gold Weight
                  </label>
                  <Controller
                    name="goldWeight"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldWeight"
                        value={field.value || ''}
                         forceDropdown={true}
                        allowCustomValue={true}
                        onChange={field.onChange}
                        placeholder="Select or enter gold weight"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldWeight ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldWeight && <p className="text-red-500 text-sm mt-1">{errors.goldWeight.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Craftsmanship
                  </label>
                  <Controller
                    name="goldCraftsmanship"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldCraftsmanship"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter craftsmanship"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldCraftsmanship ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldCraftsmanship && <p className="text-red-500 text-sm mt-1">{errors.goldCraftsmanship.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Design Description
                  </label>
                  <Controller
                    name="goldDesignDescription"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldDesignDescription"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select or enter design description"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldDesignDescription ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldDesignDescription && <p className="text-red-500 text-sm mt-1">{errors.goldDesignDescription.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Finished Type
                  </label>
                  <Controller
                    name="goldFinishedType"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldFinishedType"
                        value={field.value || ''}
                        onChange={field.onChange}
                         forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter finished type"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldFinishedType ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldFinishedType && <p className="text-red-500 text-sm mt-1">{errors.goldFinishedType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stones
                  </label>
                  <Controller
                    name="goldStones"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldStones"
                        value={field.value || ''}
                        onChange={field.onChange}
                        forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter stones"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldStones ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldStones && <p className="text-red-500 text-sm mt-1">{errors.goldStones.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stone Quality
                  </label>
                  <Controller
                    name="goldStoneQuality"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="goldStoneQuality"
                        value={field.value || ''}
                         forceDropdown={true}
                        allowCustomValue={true}
                        onChange={field.onChange}
                        placeholder="Select or enter stone quality"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.goldStoneQuality ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.goldStoneQuality && <p className="text-red-500 text-sm mt-1">{errors.goldStoneQuality.message}</p>}
                </div>
              </div>
            </div>

            {/* Platinum Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platinum Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platinum Weight
                  </label>
                  <Controller
                    name="platinumWeight"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="platinumWeight"
                        value={field.value || ''}
                        onChange={field.onChange}
                         forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter platinum weight"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.platinumWeight ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.platinumWeight && <p className="text-red-500 text-sm mt-1">{errors.platinumWeight.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platinum Type
                  </label>
                  <Controller
                    name="platinumType"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="platinumType"
                        value={field.value || ''}
                        onChange={field.onChange}
                        forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter platinum type"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.platinumType ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.platinumType && <p className="text-red-500 text-sm mt-1">{errors.platinumType.message}</p>}
                </div>
              </div>
            </div>

            {/* Silver Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Silver Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Silver Weight
                  </label>
                  <Controller
                    name="silverWeight"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="silverWeight"
                        value={field.value || ''}
                        onChange={field.onChange}
                        forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter silver weight"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.silverWeight ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.silverWeight && <p className="text-red-500 text-sm mt-1">{errors.silverWeight.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Silver Type
                  </label>
                  <Controller
                    name="silverType"
                    control={control}
                    render={({ field }) => (
                      <DynamicDropdown
                        attribute="silverType"
                        value={field.value || ''}
                        onChange={field.onChange}
                        forceDropdown={true}
                        allowCustomValue={true}
                        placeholder="Select or enter silver type"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.silverType ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.silverType && <p className="text-red-500 text-sm mt-1">{errors.silverType.message}</p>}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Estimated Order Period */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Order Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Order Period
                  </label>
                  <Controller
                    name="orderDuration"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.orderDuration ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter estimated order period (e.g., 2-3 weeks)"
                      />
                    )}
                  />
                  {errors.orderDuration && <p className="text-red-500 text-sm mt-1">{errors.orderDuration.message}</p>}
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
                <div className="col-span-2">
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
                        placeholder="Enter SEO slug"
                      />
                    )}
                  />
                  {errors.seoSlug && <p className="text-red-500 text-sm mt-1">{errors.seoSlug.message}</p>}
                </div>

                {/* Video URL */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <Controller
                    name="videoUrl"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black ${errors.videoUrl ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter video URL"
                      />
                    )}
                  />
                  {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>}
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
                  const formData = getValues();
                  const previewProduct: ProductPreviewData = {
                    id: editingProduct?.id,
                    productCode: formData.productCode || '',
                    name: formData.name || '',
                    description: formData.description || '',
                    fullDescription: formData.fullDescription,
                    category: formData.category || '',
                    subCategory: formData.subCategory,
                    jewelryType: formData.jewelryType,
                    price: formData.price ? parseFloat(formData.price) : 0,
                    isActive: formData.isActive,
                    status: (formData.status as 'draft' | 'active' | 'inactive') || 'draft',
                    
                    // Gold Fields
                    goldWeight: formData.goldWeight,
                    goldPurity: formData.goldPurity,
                    goldType: formData.goldType,
                    goldCraftsmanship: formData.goldCraftsmanship,
                    goldDesignDescription: formData.goldDesignDescription,
                    goldFinishedType: formData.goldFinishedType,
                    goldStones: formData.goldStones,
                    goldStoneQuality: formData.goldStoneQuality,
                    
                    // Diamond Fields
                    diamondType: formData.diamondType,
                    diamondShapeCut: formData.diamondShapeCut,
                    diamondColorGrade: formData.diamondColorGrade,
                    diamondClarityGrade: formData.diamondClarityGrade,
                    diamondCutGrade: formData.diamondCutGrade,
                    diamondMetalDetails: formData.diamondMetalDetails,
                    diamondCertification: formData.diamondCertification,
                    diamondOrigin: formData.diamondOrigin,
                    diamondCaratWeight: formData.diamondCaratWeight,
                    
                    // Platinum Fields
                    platinumWeight: formData.platinumWeight,
                    platinumType: formData.platinumType,
                    
                    // Silver Fields
                    silverWeight: formData.silverWeight,
                    silverType: formData.silverType,
                    
                    orderDuration: formData.orderDuration,
                    digitalBrowser: formData.digitalBrowser,
                    website: formData.website,
                    distributor: formData.distributor,
                    culture: formData.culture,
                    seoTitle: formData.seoTitle,
                    seoDescription: formData.seoDescription,
                    seoKeywords: formData.seoKeywords,
                    seoSlug: formData.seoSlug,
                    stoneWeight: formData.stoneWeight,
                    caret: formData.caret,
                    imageUrl: previewImages.length > 0 ? previewImages[0] : '',
                    images: previewImages.map((url, index) => ({
                      id: `preview-${index}`,
                      url,
                      altText: `Preview ${index + 1}`,
                      order: index,
                      isActive: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    })),
                    videoUrl: videoPreview || undefined,
                    createdAt: editingProduct?.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  };
                  setPreviewData(previewProduct);
                  setIsPreviewOpen(true);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={formIsSubmitting}
              >
                Preview
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={formIsSubmitting}
              >
                {formIsSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>

        {/* Image Cropping Modal */}
        {croppingImageIndex !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Crop Image</h3>
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
                        setCroppingImageIndex(null);
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

        {/* Product Preview Modal */}
        {isPreviewOpen && previewData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Product Preview</h2>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{previewData.name}</h3>
                    <p className="text-gray-600">{previewData.description}</p>
                  </div>
                  
                  {previewData.images && previewData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {previewData.images.map((image, index) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.altText || `Product image ${index + 1}`}
                          className="w-full h-auto object-contain rounded-lg border border-gray-300"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Basic Information</h4>
                      <div className="mt-2 space-y-1">
                        <p><span className="font-medium">Product Code:</span> {previewData.productCode || 'N/A'}</p>
                        <p><span className="font-medium">Category:</span> {previewData.category || 'N/A'}</p>
                        <p><span className="font-medium">Sub Category:</span> {previewData.subCategory || 'N/A'}</p>
                        <p><span className="font-medium">Jewelry Type:</span> {previewData.jewelryType || 'N/A'}</p>
                        <p><span className="font-medium">Price:</span> ${previewData.price.toFixed(2)}</p>
                        <p><span className="font-medium">Status:</span> {previewData.status}</p>
                      </div>
                    </div>
                    
                    {previewData.goldWeight && (
                      <div>
                        <h4 className="font-semibold">Gold Details</h4>
                        <div className="mt-2 space-y-1">
                          <p><span className="font-medium">Gold Weight:</span> {previewData.goldWeight}</p>
                          <p><span className="font-medium">Gold Purity:</span> {previewData.goldPurity || 'N/A'}</p>
                          <p><span className="font-medium">Gold Type:</span> {previewData.goldType || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    
                    {previewData.diamondType && (
                      <div>
                        <h4 className="font-semibold">Diamond Details</h4>
                        <div className="mt-2 space-y-1">
                          <p><span className="font-medium">Diamond Type:</span> {previewData.diamondType}</p>
                          <p><span className="font-medium">Diamond Shape/Cut:</span> {previewData.diamondShapeCut || 'N/A'}</p>
                          <p><span className="font-medium">Color Grade:</span> {previewData.diamondColorGrade || 'N/A'}</p>
                          <p><span className="font-medium">Clarity:</span> {previewData.diamondClarityGrade || 'N/A'}</p>
                          <p><span className="font-medium">Cut Grade:</span> {previewData.diamondCutGrade || 'N/A'}</p>
                          <p><span className="font-medium">Carat Weight:</span> {previewData.diamondCaratWeight || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    
                    {previewData.platinumWeight && (
                      <div>
                        <h4 className="font-semibold">Platinum Details</h4>
                        <div className="mt-2 space-y-1">
                          <p><span className="font-medium">Platinum Weight:</span> {previewData.platinumWeight}</p>
                          <p><span className="font-medium">Platinum Type:</span> {previewData.platinumType || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    
                    {previewData.silverWeight && (
                      <div>
                        <h4 className="font-semibold">Silver Details</h4>
                        <div className="mt-2 space-y-1">
                          <p><span className="font-medium">Silver Weight:</span> {previewData.silverWeight}</p>
                          <p><span className="font-medium">Silver Type:</span> {previewData.silverType || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold">SEO Information</h4>
                      <div className="mt-2 space-y-1">
                        <p><span className="font-medium">SEO Title:</span> {previewData.seoTitle || 'N/A'}</p>
                        <p><span className="font-medium">SEO Slug:</span> {previewData.seoSlug || 'N/A'}</p>
                        <p><span className="font-medium">SEO Description:</span> {previewData.seoDescription || 'N/A'}</p>
                        <p><span className="font-medium">SEO Keywords:</span> {previewData.seoKeywords || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}