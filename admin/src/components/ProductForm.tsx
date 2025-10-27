'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from './RichTextEditor';

interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
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
  createdAt: string;
  updatedAt: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSuccess: () => void;
}

export default function ProductForm({ isOpen, onClose, editingProduct, onSuccess }: ProductFormProps) {
  const { token } = useAuth();
  const [productForm, setProductForm] = useState({
    productCode: '',
    name: '',
    description: '',
    briefDescription: '',
    fullDescription: '',
    category: '',
    subCategory: '',
    price: '',
    stock: '0',
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
    seoSlug: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form when modal opens
  const resetForm = () => {
    setProductForm({
      productCode: '',
      name: '',
      description: '',
      briefDescription: '',
      fullDescription: '',
      category: '',
      subCategory: '',
      price: '',
      stock: '0',
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
      seoSlug: ''
    });
    setSelectedImage(null);
    setPreviewImage(null);
  };

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        productCode: editingProduct.productCode || '',
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        briefDescription: (editingProduct as any).briefDescription || '',
        fullDescription: (editingProduct as any).fullDescription || '',
        category: editingProduct.category || '',
        subCategory: editingProduct.subCategory || '',
        price: editingProduct.price?.toString() || '',
        stock: editingProduct.stock?.toString() || '0',
        isActive: editingProduct.isActive,
        goldWeight: editingProduct.goldWeight || '',
        diamondDetails: editingProduct.diamondDetails || '',
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
      setSelectedImage(null);
      setPreviewImage(editingProduct.imageUrl || null);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;
      
      // Try to get token from context or localStorage as fallback
      const authToken = token || localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      if (!authToken) {
        toast.error('Authentication required. Please log in again.');
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('productCode', productForm.productCode);
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      if (productForm.briefDescription) {
        formData.append('briefDescription', productForm.briefDescription);
      }
      if (productForm.fullDescription) {
        formData.append('fullDescription', productForm.fullDescription);
      }
      formData.append('category', productForm.category);
      formData.append('subCategory', productForm.subCategory);
      formData.append('price', productForm.price);
      formData.append('stock', productForm.stock);
      formData.append('isActive', productForm.isActive.toString());
      formData.append('goldWeight', productForm.goldWeight);
      formData.append('diamondDetails', productForm.diamondDetails);
      formData.append('diamondQuantity', productForm.diamondQuantity);
      formData.append('diamondSize', productForm.diamondSize);
      formData.append('diamondWeight', productForm.diamondWeight);
      formData.append('diamondQuality', productForm.diamondQuality);
      formData.append('otherGemstones', productForm.otherGemstones);
      formData.append('orderDuration', productForm.orderDuration);
      formData.append('metalType', productForm.metalType);
      formData.append('stoneType', productForm.stoneType);
      formData.append('settingType', productForm.settingType);
      formData.append('size', productForm.size);
      formData.append('color', productForm.color);
      formData.append('finish', productForm.finish);
      formData.append('digitalBrowser', productForm.digitalBrowser.toString());
      formData.append('website', productForm.website.toString());
      formData.append('distributor', productForm.distributor.toString());
      if (productForm.culture) {
        formData.append('culture', productForm.culture);
      }
      if (productForm.seoTitle) {
        formData.append('seoTitle', productForm.seoTitle);
      }
      if (productForm.seoDescription) {
        formData.append('seoDescription', productForm.seoDescription);
      }
      if (productForm.seoKeywords) {
        formData.append('seoKeywords', productForm.seoKeywords);
      }
      if (productForm.seoSlug) {
        formData.append('seoSlug', productForm.seoSlug);
      }
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await fetch(editingProduct ? `${apiUrl}/${editingProduct.id}` : apiUrl, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        onSuccess();
        onClose();
        resetForm();
      } else {
        const errorText = await response.text();
        console.error('Error saving product, status:', response.status);
        console.error('Error response text:', errorText);
        let errorMessage = 'Failed to save product';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
              <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
              </button>
        </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Code *
                    </label>
                    <input
                      type="text"
                  value={productForm.productCode}
                  onChange={(e) => handleFormChange('productCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                  placeholder="CD-001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                    </label>
                    <input
                      type="text"
                  value={productForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                  placeholder="Enter product name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
                  </label>
                  <textarea
                value={productForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                rows={3}
                placeholder="Enter product description"
                    required
                  />
                </div>

                {/* Brief Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brief Description
                  </label>
                  <textarea
                    value={productForm.briefDescription}
                    onChange={(e) => handleFormChange('briefDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    rows={2}
                    placeholder="Short description for product listings"
                  />
                </div>

                {/* Full Description with Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description
                  </label>
                  <RichTextEditor
                    value={productForm.fullDescription}
                    onChange={(value) => handleFormChange('fullDescription', value)}
                  />
                </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                  value={productForm.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                      required
                >
                  <option value="">Select Category</option>
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Bracelet">Bracelet</option>
                  <option value="Earring">Earring</option>
                  <option value="Pendant">Pendant</option>
                  <option value="Chain">Chain</option>
                  <option value="Bangle">Bangle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                    </label>
                    <input
                      type="text"
                  value={productForm.subCategory}
                  onChange={(e) => handleFormChange('subCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                  placeholder="Ladies/Casual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                  placeholder="0.00"
                  required
                    />
              </div>
                </div>

            {/* Culture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Background
                </label>
                <select
                  value={productForm.culture}
                  onChange={(e) => handleFormChange('culture', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                >
                  <option value="">Select Culture</option>
                  <option value="None">None</option>
                  <option value="Newari">Newari</option>
                  <option value="Brahmin/Chhetri">Brahmin/Chhetri</option>
                  <option value="Tamang">Tamang</option>
                </select>
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
                    <input
                      type="text"
                    value={productForm.goldWeight}
                    onChange={(e) => handleFormChange('goldWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="4 gms approx"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metal Type
                    </label>
                      <input
                    type="text"
                    value={productForm.metalType}
                    onChange={(e) => handleFormChange('metalType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="14k/18k"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Details
                          </label>
                          <input
                    type="text"
                    value={productForm.diamondDetails}
                    onChange={(e) => handleFormChange('diamondDetails', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="-"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Quantity
                    </label>
                    <input
                      type="number"
                    value={productForm.diamondQuantity}
                    onChange={(e) => handleFormChange('diamondQuantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Size
                    </label>
                    <input
                    type="text"
                    value={productForm.diamondSize}
                    onChange={(e) => handleFormChange('diamondSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="Size"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Weight
                    </label>
                      <input
                    type="text"
                    value={productForm.diamondWeight}
                    onChange={(e) => handleFormChange('diamondWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="None"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Quality
                  </label>
                  <input
                    type="text"
                    value={productForm.diamondQuality}
                    onChange={(e) => handleFormChange('diamondQuality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="Not mentioned"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Gemstones
                  </label>
                  <input
                    type="text"
                    value={productForm.otherGemstones}
                    onChange={(e) => handleFormChange('otherGemstones', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="None"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Duration
                  </label>
                    <input
                      type="text"
                    value={productForm.orderDuration}
                    onChange={(e) => handleFormChange('orderDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="7 days to make"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => handleFormChange('stock', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="0"
                  />
                </div>
              </div>
                </div>

            {/* Image Upload */}
                      <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
                        </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Choose Image
                        </label>
                      </div>
                      </div>
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    </div>
                  )}
                </div>
              </div>

            {/* Distribution Channels */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="digitalBrowser"
                    checked={productForm.digitalBrowser}
                    onChange={(e) => handleFormChange('digitalBrowser', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="digitalBrowser" className="ml-2 block text-sm font-medium text-gray-700">
                    Digital Browser
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="website"
                    checked={productForm.website}
                    onChange={(e) => handleFormChange('website', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="website" className="ml-2 block text-sm font-medium text-gray-700">
                    Website
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="distributor"
                    checked={productForm.distributor}
                    onChange={(e) => handleFormChange('distributor', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="distributor" className="ml-2 block text-sm font-medium text-gray-700">
                    Distributor
                  </label>
                </div>
              </div>
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={productForm.seoTitle}
                    onChange={(e) => handleFormChange('seoTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="e.g., 18k Gold Ring with Diamonds - Celebration Diamond"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    value={productForm.seoDescription}
                    onChange={(e) => handleFormChange('seoDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    rows={3}
                    placeholder="A brief description for search engines"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={productForm.seoKeywords}
                    onChange={(e) => handleFormChange('seoKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="e.g., gold ring, diamond jewelry, wedding rings"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Slug
                  </label>
                  <input
                    type="text"
                    value={productForm.seoSlug}
                    onChange={(e) => handleFormChange('seoSlug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-black"
                    placeholder="e.g., 18k-gold-ring-diamonds"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={productForm.isActive ? 'active' : 'inactive'}
                onChange={(e) => handleFormChange('isActive', e.target.value === 'active')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
          </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
            type="button"
            onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
              </button>
              <button
            type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}