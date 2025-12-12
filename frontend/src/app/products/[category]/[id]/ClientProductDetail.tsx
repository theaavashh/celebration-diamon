"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag, Share2, Star, Facebook, Twitter, Instagram, MessageCircle, Link2, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiBaseUrl, getImageUrl } from '@/lib/api';
import { Lato } from 'next/font/google';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

interface Product {
  id: string;
  name: string;
  productCode?: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: ProductImage[];
  rating: number;
  reviews: number;
  description: string;
  fullDescription?: string;
  details: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  metalType?: string;
  goldWeight?: string;
  goldPurity?: string;
  goldType?: string;
  goldCraftsmanship?: string;
  goldDesignDescription?: string;
  goldFinishedType?: string;
  goldStones?: string;
  goldStoneQuality?: string;
  diamondDetails?: string;
  diamondQuantity?: number | string;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
  platinumWeight?: string;
  platinumType?: string;
  silverWeight?: string;
  silverType?: string;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  order: number;
  isActive: boolean;
}

interface ApiProductImage {
  id: string;
  url: string;
  altText?: string;
  order: number;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  productCode?: string;
  category: string;
  subCategory?: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  images?: ApiProductImage[];
  stock: number;
  isNew?: boolean;
  isSale?: boolean;
  metalType?: string;
  goldWeight?: string;
  goldPurity?: string;
  goldType?: string;
  goldCraftsmanship?: string;
  goldDesignDescription?: string;
  goldFinishedType?: string;
  goldStones?: string;
  goldStoneQuality?: string;
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
  description: string;
  fullDescription?: string;
  platinumWeight?: string;
  platinumType?: string;
  silverWeight?: string;
  silverType?: string;
}

interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

type SpecItem = { label: string; value?: string };
function SpecGroup({ title, items }: { title: string; items: SpecItem[] }) {
  const filtered = items.filter(i => i.value && i.value !== 'N/A');
  if (filtered.length === 0) return null;
  return (
    <div className=" p-4 border border-amber-100">
      <h4 className="font-semibold text-black mb-3 flex items-center">
        <span className="w-2 h-2 mr-2"></span>
        {title}
      </h4>
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b border-amber-100">
            <span className="text-black">{item.label}:</span>
            <span className="font-medium text-black">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecGroupGrid({ title, items }: { title: string; items: SpecItem[] }) {
  const filtered = items.filter(i => i.value && i.value !== 'N/A');
  if (filtered.length === 0) return null;
  return (
    <div className="md:col-span-2">
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
        <h4 className="font-semibold text-black mb-3 flex items-center">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
          {title}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-black">{item.label}:</span>
              <span className="font-medium text-black">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Category {
  id: string;
  title: string;
  imageUrl?: string | null;
  link?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function ClientProductDetail({ category, id }: { category: string; id: string }) {
  const displayValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string' && value.trim() === '') return 'N/A';
    return String(value);
  };

  const sanitizeHtml = (html: string): string => {
    let s = html || '';
    s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    s = s.replace(/\son\w+="[^"]*"/gi, '');
    s = s.replace(/\son\w+='[^']*'/gi, '');
    s = s.replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"');
    return s;
  };

  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phone: '',
    culture: '',
    preferredDate: '',
    preferredTime: '',
    appointmentType: 'online',
    additionalNotes: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/categories`);
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data.filter((c: Category) => c.isActive));
        }
      } catch (_) {
      }
    };
    fetchCategories();
  }, []);

  const getCategoryTitle = (categoryId: string): string => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.title : categoryId;
  };

  // Set active image when thumbnails are clicked
  const setActiveImage = (index: number) => {
    setActiveImageIndex(index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/products/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const product = data.data;
          setProduct({
            id: product.id,
            name: product.name,
            productCode: product.productCode,
            category: product.category,
            subcategory: product.subCategory || product.subcategory || '',
            price: product.price,
            originalPrice: product.originalPrice,
            image: getImageUrl(product.imageUrl) || `/${category}.jpeg`,
            images: product.images?.map((img: ApiProductImage) => ({
              id: img.id,
              url: getImageUrl(img.url) || `/${category}.jpeg`,
              altText: img.altText || product.name,
              order: img.order,
              isActive: img.isActive
            })) || [],
            rating: 4.5,
            reviews: 0,
            description: product.description,
            fullDescription: product.fullDescription,
            details: product.description,
            inStock: product.stock > 0,
            isNew: product.isNew || false,
            isSale: product.isSale || false,
            metalType: product.metalType,
            goldWeight: product.goldWeight,
            goldPurity: product.goldPurity,
            goldType: product.goldType,
            goldCraftsmanship: product.goldCraftsmanship,
            goldDesignDescription: product.goldDesignDescription,
            goldFinishedType: product.goldFinishedType,
            goldStones: product.goldStones,
            goldStoneQuality: product.goldStoneQuality,
            diamondDetails: product.diamondDetails,
            diamondQuantity: product.diamondQuantity,
            diamondSize: product.diamondSize,
            diamondWeight: product.diamondWeight,
            diamondQuality: product.diamondQuality,
            otherGemstones: product.otherGemstones,
            orderDuration: product.orderDuration,
            platinumWeight: product.platinumWeight,
            platinumType: product.platinumType,
            silverWeight: product.silverWeight,
            silverType: product.silverType
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/products?limit=4`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const mappedProducts = data.data
            .filter((p: ApiProduct) => p.id !== id)
            .slice(0, 4)
            .map((product: ApiProduct) => ({
              id: product.id,
              name: product.name,
              category: product.category,
              subcategory: product.category.toLowerCase(),
              price: product.price,
              originalPrice: product.originalPrice,
              image: getImageUrl(product.imageUrl) || `/${product.category}.jpeg`,
              images: product.images?.map((img: ApiProductImage) => ({
                id: img.id,
                url: getImageUrl(img.url) || `/${product.category}.jpeg`,
                altText: img.altText || product.name,
                order: img.order,
                isActive: img.isActive
              })) || [],
              rating: 4.5,
              reviews: 0,
              description: product.description,
              details: product.description,
              inStock: product.stock > 0,
              isNew: product.isNew || false,
              isSale: product.isSale || false,
              metalType: product.metalType,
              goldWeight: product.goldWeight,
              goldPurity: product.goldPurity,
              goldType: product.goldType,
              goldCraftsmanship: product.goldCraftsmanship,
              goldDesignDescription: product.goldDesignDescription,
              goldFinishedType: product.goldFinishedType,
              goldStones: product.goldStones,
              goldStoneQuality: product.goldStoneQuality,
              diamondQuantity: product.diamondQuantity,
              diamondSize: product.diamondSize,
              diamondWeight: product.diamondWeight,
              otherGemstones: product.otherGemstones,
              orderDuration: product.orderDuration,
              platinumWeight: product.platinumWeight,
              platinumType: product.platinumType,
              silverWeight: product.silverWeight,
              silverType: product.silverType
            }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      }
    };

    fetchProduct();
    fetchRecommendedProducts();
  }, [id, category]);

  const getAllProductImages = (): string[] => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images
        .filter(img => img.isActive)
        .sort((a, b) => a.order - b.order)
        .map(img => {
          return img.url.startsWith('http') 
            ? img.url 
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img.url}`;
        });
    }
    if (product.image) {
      return [product.image];
    }
    return [`/${category}.jpeg`];
  };

  const productImages = getAllProductImages();

  const goToPreviousImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`${lato.className} min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href={`/products/${category}`} className="text-black hover:text-black">
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${lato.className} min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30`}>
      <div className="bg-white border-b border-gray-200 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href={`/products/${category}`}
            className="flex items-center gap-2 text-black hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base jimthompson">Back to {category.charAt(0).toUpperCase() + category.slice(1)}</span>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-xl">
                {productImages.length > 0 ? (
                  <>
                    <Image
                      src={`${productImages[activeImageIndex]}?_t=${Date.now()}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    {product.isNew && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">New</div>
                    )}
                    {product.isSale && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Sale</div>
                    )}
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={goToPreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                          {activeImageIndex + 1} / {productImages.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No image available</div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${activeImageIndex === idx ? 'border-black' : 'border-gray-200'}`}
                    >
                      <Image src={`${img}?_t=${Date.now()}`} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex gap-2">
                    {product.isNew && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">New</span>
                    )}
                    {product.isSale && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Sale</span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Product Code: {product.productCode || 'N/A'} • Category: {getCategoryTitle(product.category)} • Subcategory: {product.subcategory || 'N/A'}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-black fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                  {product.inStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                  )}
                </div>
                <p className="text-gray-700 mb-6">{product.description}</p>
                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Product Specifications</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <SpecGroup
                      title="General Specifications"
                      items={[
                        { label: 'Category', value: getCategoryTitle(product.category) },
                        { label: 'Subcategory', value: product.subcategory },
                        { label: 'Metal Type', value: product.metalType },
                        { label: 'Gold Weight', value: product.goldWeight },
                        { label: 'Order Duration', value: product.orderDuration }
                      ]}
                    />
                    <SpecGroupGrid
                      title="Diamond Specifications"
                      items={[
                        { label: 'Details', value: product.diamondDetails },
                        { label: 'Quantity', value: displayValue(product.diamondQuantity) },
                        { label: 'Size', value: product.diamondSize },
                        { label: 'Weight', value: product.diamondWeight },
                        { label: 'Quality', value: product.diamondQuality },
                        { label: 'Other Gemstones', value: product.otherGemstones }
                      ]}
                    />
                    <SpecGroup
                      title="Gold Specifications"
                      items={[
                        { label: 'Weight', value: product.goldWeight },
                        { label: 'Purity', value: product.goldPurity },
                        { label: 'Type', value: product.goldType },
                        { label: 'Craftsmanship', value: product.goldCraftsmanship },
                        { label: 'Design Description', value: product.goldDesignDescription },
                        { label: 'Finished Type', value: product.goldFinishedType },
                        { label: 'Stones', value: product.goldStones },
                        { label: 'Stone Quality', value: product.goldStoneQuality }
                      ]}
                    />
                    <SpecGroup
                      title="Platinum Specifications"
                      items={[
                        { label: 'Weight', value: product.platinumWeight },
                        { label: 'Type', value: product.platinumType }
                      ]}
                    />
                    <SpecGroup
                      title="Silver Specifications"
                      items={[
                        { label: 'Weight', value: product.silverWeight },
                        { label: 'Type', value: product.silverType }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setIsDescriptionOpen(true)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${isDescriptionOpen ? 'border-amber-600 text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Description
            </button>
            <button
              onClick={() => setIsDescriptionOpen(false)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${!isDescriptionOpen ? 'border-amber-600 text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        <div className="py-8">
          {isDescriptionOpen ? (
            <div className="prose max-w-none">
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.fullDescription || product.details) }} />
            </div>
          ) : (
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-black">{review.customerName.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-black fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
