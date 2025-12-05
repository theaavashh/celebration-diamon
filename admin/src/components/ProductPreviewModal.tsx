'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  imageUrl?: string;
  images?: ProductImage[];
  stock: number;
  isActive: boolean;
  status: string;
  goldWeight?: string;
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  stoneWeight?: string;
  caret?: string;
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
  goldCaret?: string;
  diamondCaret?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSlug?: string;
  briefDescription?: string;
  fullDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  categories: Category[];
  subcategories: Subcategory[];
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  product,
  categories,
  subcategories
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl font-bold text-black">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-xl">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:5000${product.images[0].url}`}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              ) : product.imageUrl ? (
                <img
                  src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {(product.isActive) && (
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              )}
            </div>
            
            {/* Right side - Product Details */}
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Description</h3>
                <p className="text-black leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Full Description */}
              {product.fullDescription && (
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Full Description</h3>
                  <div className="text-black leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
                </div>
              )}

              {/* Product Information */}
              <div className="border border-gray-200 rounded-lg">
                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-black">Product Code:</span>
                    <span className="font-medium text-black">{product.productCode}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-black">Category:</span>
                    <span className="font-medium text-black">
                      {categories.find((c: Category) => c.id === product.category)?.title || product.category}
                    </span>
                  </div>
                  {product.subCategory && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Sub Category:</span>
                      <span className="font-medium text-black">
                        {subcategories.find((s: Subcategory) => s.id === product.subCategory)?.name || product.subCategory}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-black">Price:</span>
                    <span className="font-medium text-black">NPR {product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-black">Stock:</span>
                    <span className="font-medium text-black">{product.stock}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-black">Status:</span>
                    <span className="font-medium text-black">
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                  {product.metalType && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Metal Type:</span>
                      <span className="font-medium text-black">{product.metalType}</span>
                    </div>
                  )}
                  {product.goldWeight && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Gold Weight:</span>
                      <span className="font-medium text-black">{product.goldWeight}</span>
                    </div>
                  )}
                  {product.otherGemstones && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Other Gemstones:</span>
                      <span className="font-medium text-black">{product.otherGemstones}</span>
                    </div>
                  )}
                  {product.orderDuration && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Order Duration:</span>
                      <span className="font-medium text-black">{product.orderDuration}</span>
                    </div>
                  )}
                  {product.culture && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Culture:</span>
                      <span className="font-medium text-black">{product.culture}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Diamond Section */}
              {(product.diamondDetails || 
                product.diamondQuantity !== undefined || 
                product.diamondSize || 
                product.diamondWeight || 
                product.diamondQuality ||
                product.stoneWeight ||
                product.caret ||
                product.diamondCaret) && (
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 space-y-3">
                    <h3 className="text-xl font-semibold text-black mb-4">Diamond Details</h3>
                    {product.diamondDetails && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Diamond Details:</span>
                        <span className="font-medium text-black">{product.diamondDetails}</span>
                      </div>
                    )}
                    {product.diamondQuantity !== undefined && product.diamondQuantity !== null && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Diamond Quantity:</span>
                        <span className="font-medium text-black">{product.diamondQuantity}</span>
                      </div>
                    )}
                    {product.diamondSize && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Diamond Size:</span>
                        <span className="font-medium text-black">{product.diamondSize}</span>
                      </div>
                    )}
                    {product.diamondWeight && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Diamond Weight:</span>
                        <span className="font-medium text-black">{product.diamondWeight}</span>
                      </div>
                    )}
                    {product.diamondQuality && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Diamond Quality:</span>
                        <span className="font-medium text-black">{product.diamondQuality}</span>
                      </div>
                    )}
                    {product.stoneWeight && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Stone Weight:</span>
                        <span className="font-medium text-black">{product.stoneWeight}</span>
                      </div>
                    )}
                    {product.caret && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Caret:</span>
                        <span className="font-medium text-black">{product.caret}</span>
                      </div>
                    )}
                    {product.diamondCaret && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Diamond Caret:</span>
                        <span className="font-medium text-black">{product.diamondCaret}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Gold Section */}
              {(product.goldWeight || 
                product.goldCaret || 
                (product.metalType && product.metalType.toLowerCase().includes('gold'))) && (
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 space-y-3">
                    <h3 className="text-xl font-semibold text-black mb-4">Gold Details</h3>
                    {product.goldWeight && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Gold Weight:</span>
                        <span className="font-medium text-black">{product.goldWeight}</span>
                      </div>
                    )}
                    {product.goldCaret && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Gold Caret:</span>
                        <span className="font-medium text-black">{product.goldCaret}</span>
                      </div>
                    )}
                    {product.metalType && product.metalType.toLowerCase().includes('gold') && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Gold Type:</span>
                        <span className="font-medium text-black">{product.metalType}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Platinum Section */}
              {product.metalType && product.metalType.toLowerCase().includes('platinum') && (
                <div className="border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 space-y-3">
                    <h3 className="text-xl font-semibold text-black mb-4">Platinum Details</h3>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-black">Platinum Type:</span>
                      <span className="font-medium text-black">{product.metalType}</span>
                    </div>
                    {product.goldWeight && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-black">Weight:</span>
                        <span className="font-medium text-black">{product.goldWeight}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Distribution Channels */}
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Distribution Channels</h3>
                <div className="flex flex-wrap gap-2">
                  {product.digitalBrowser && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-black">
                      Digital Browser
                    </span>
                  )}
                  {product.website && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-black">
                      Website
                    </span>
                  )}
                  {product.distributor && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-black">
                      Distributor
                    </span>
                  )}
                  {!product.digitalBrowser && !product.website && !product.distributor && (
                    <span className="text-sm text-black">No distribution channels selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;