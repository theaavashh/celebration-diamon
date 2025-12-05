"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, ShoppingBag, Share2, Star, Facebook, Twitter, Instagram, MessageCircle, Link2, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: ProductImage[]; // Add this for multiple images
  rating: number;
  reviews: number;
  description: string;
  details: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  metalType?: string;
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
  diamondDetails?: string;
  diamondQuantity?: number | string;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  // Other Fields
  otherGemstones?: string;
  orderDuration?: string;
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
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  // Other Fields
  otherGemstones?: string;
  orderDuration?: string;
  description: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const id = params.id as string;

  // Helper function to safely display values
  const displayValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string' && value.trim() === '') return 'N/A';
    return String(value);
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

  // Function to get all product images (including the main image)
  const getAllProductImages = (): string[] => {
    if (!product) return [];
    
    // If we have multiple images, use them
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
    
    // Fallback to single image
    if (product.image) {
      return [product.image];
    }
    
    // Default placeholder
    return [`/${category}.jpeg`];
  };

  const productImages = getAllProductImages();

  // Navigation functions for carousel
  const goToPreviousImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  // Set active image when thumbnails are clicked
  const setActiveImage = (index: number) => {
    setActiveImageIndex(index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/products/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const product = data.data;
          console.log('Product data from API:', product); // Debug log
          setProduct({
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.subCategory || product.subcategory || '',
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.imageUrl?.startsWith('http') 
              ? product.imageUrl 
              : product.imageUrl 
                ? `${apiUrl}${product.imageUrl}` 
                : `/${category}.jpeg`,
            images: product.images?.map((img: ApiProductImage) => ({
              id: img.id,
              url: img.url?.startsWith('http') 
                ? img.url 
                : img.url 
                  ? `${apiUrl}${img.url}` 
                  : `/${category}.jpeg`,
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
            // Gold Fields
            goldWeight: product.goldWeight,
            goldPurity: product.goldPurity,
            goldType: product.goldType,
            goldCraftsmanship: product.goldCraftsmanship,
            goldDesignDescription: product.goldDesignDescription,
            goldFinishedType: product.goldFinishedType,
            goldStones: product.goldStones,
            goldStoneQuality: product.goldStoneQuality,
            // Diamond Fields
            diamondDetails: product.diamondDetails,
            diamondQuantity: product.diamondQuantity,
            diamondSize: product.diamondSize,
            diamondWeight: product.diamondWeight,
            diamondQuality: product.diamondQuality,
            // Other Fields
            otherGemstones: product.otherGemstones,
            orderDuration: product.orderDuration
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
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/products?limit=4`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const mappedProducts = data.data
            .filter((p: ApiProduct) => p.id !== id) // Exclude current product
            .slice(0, 4)
            .map((product: ApiProduct) => ({
              id: product.id,
              name: product.name,
              category: product.category,
              subcategory: product.category.toLowerCase(),
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.imageUrl?.startsWith('http') 
                ? product.imageUrl 
                : product.imageUrl 
                  ? `${apiUrl}${product.imageUrl}` 
                  : `/${product.category}.jpeg`,
              images: product.images?.map((img: ApiProductImage) => ({
                id: img.id,
                url: img.url?.startsWith('http') 
                  ? img.url 
                  : img.url 
                    ? `${apiUrl}${img.url}` 
                    : `/${product.category}.jpeg`,
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
              // Gold Fields
              goldWeight: product.goldWeight,
              goldPurity: product.goldPurity,
              goldType: product.goldType,
              goldCraftsmanship: product.goldCraftsmanship,
              goldDesignDescription: product.goldDesignDescription,
              goldFinishedType: product.goldFinishedType,
              goldStones: product.goldStones,
              goldStoneQuality: product.goldStoneQuality,
              // Diamond Fields
              diamondQuantity: product.diamondQuantity,
              diamondSize: product.diamondSize,
              diamondWeight: product.diamondWeight,
              diamondQuality: product.diamondQuality,
              // Other Fields
              otherGemstones: product.otherGemstones,
              orderDuration: product.orderDuration
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/reviews/product/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleAddToCart = () => {
    setShowCartModal(true);
  };

  // Share functionality
  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const handleShare = (platform: string) => {
    const url = getShareUrl();
    const text = product?.name || 'Check out this product';
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          customerName: reviewForm.customerName,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowReviewModal(false);
        setReviewForm({ customerName: '', rating: 5, comment: '' });
        // Refresh reviews
        const reviewsResponse = await fetch(`${apiBaseUrl}/reviews/product/${id}`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.share-menu-container')) {
          setShowShareMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const handleCartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          productName: product?.name,
          name: personalDetails.name,
          email: personalDetails.email,
          phone: personalDetails.phone,
          culture: personalDetails.culture,
          appointmentType: personalDetails.appointmentType,
          preferredDate: personalDetails.preferredDate,
          preferredTime: personalDetails.preferredTime,
          additionalNotes: personalDetails.additionalNotes
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCartModal(false);
        setPersonalDetails({
          name: '',
          email: '',
          phone: '',
          culture: '',
          preferredDate: '',
          preferredTime: '',
          appointmentType: 'online',
          additionalNotes: ''
        });
        alert('Thank you! We will contact you soon to arrange your appointment.');
      } else {
        alert('Error submitting appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Error submitting appointment. Please try again.');
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href={`/products/${category}`} className="text-amber-600 hover:text-amber-700">
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href={`/products/${category}`}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base jimthompson">Back to {category.charAt(0).toUpperCase() + category.slice(1)}</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Carousel */}
            <div className="space-y-4">
              {/* Main Image Display */}
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
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        New
                      </div>
                    )}
                    {product.isSale && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sale
                      </div>
                    )}
                    
                    {/* Navigation Arrows */}
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
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                          {activeImageIndex + 1} / {productImages.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
                        activeImageIndex === index ? 'border-amber-600' : 'border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={`${image}?_t=${Date.now()}`}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex gap-2">
                    {product.isNew && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        New
                      </span>
                    )}
                    {product.isSale && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Sale
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) 
                            ? 'text-amber-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  {product.inStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <div className="flex items-baseline gap-3 mb-6">

                </div>
                
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                {/* Product Details Section - Enhanced UI */}
                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      {product.subcategory && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Subcategory:</span>
                          <span className="font-medium">{product.subcategory}</span>
                        </div>
                      )}
                      {product.metalType && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Metal Type:</span>
                          <span className="font-medium">{product.metalType}</span>
                        </div>
                      )}
                      {product.goldWeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Gold Weight:</span>
                          <span className="font-medium">{product.goldWeight}</span>
                        </div>
                      )}
                      {product.orderDuration && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Order Duration:</span>
                          <span className="font-medium">{product.orderDuration}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Gold Details Section */}
                    {(product.goldWeight || product.goldPurity || product.goldType || product.goldCraftsmanship || 
                      product.goldDesignDescription || product.goldFinishedType || product.goldStones || product.goldStoneQuality) && (
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                        <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                          Gold Specifications
                        </h4>
                        <div className="space-y-3">
                          {product.goldWeight && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Weight:</span>
                              <span className="font-medium text-amber-900">{product.goldWeight}</span>
                            </div>
                          )}
                          {product.goldPurity && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Purity:</span>
                              <span className="font-medium text-amber-900">{product.goldPurity}</span>
                            </div>
                          )}
                          {product.goldType && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Type:</span>
                              <span className="font-medium text-amber-900">{product.goldType}</span>
                            </div>
                          )}
                          {product.goldCraftsmanship && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Craftsmanship:</span>
                              <span className="font-medium text-amber-900">{product.goldCraftsmanship}</span>
                            </div>
                          )}
                          {product.goldDesignDescription && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Design Description:</span>
                              <span className="font-medium text-amber-900">{product.goldDesignDescription}</span>
                            </div>
                          )}
                          {product.goldFinishedType && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Finished Type:</span>
                              <span className="font-medium text-amber-900">{product.goldFinishedType}</span>
                            </div>
                          )}
                          {product.goldStones && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Stones:</span>
                              <span className="font-medium text-amber-900">{product.goldStones}</span>
                            </div>
                          )}
                          {product.goldStoneQuality && (
                            <div className="flex justify-between py-2 border-b border-amber-100">
                              <span className="text-amber-700">Stone Quality:</span>
                              <span className="font-medium text-amber-900">{product.goldStoneQuality}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Diamond Details Section */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        Diamond Specifications
                      </h4>
                      <div className="space-y-3">
                        {product.diamondDetails && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Details:</span>
                            <span className="font-medium text-amber-900">{product.diamondDetails}</span>
                          </div>
                        )}
                        {product.diamondQuantity && product.diamondQuantity !== 'N/A' && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Quantity:</span>
                            <span className="font-medium text-amber-900">{displayValue(product.diamondQuantity)}</span>
                          </div>
                        )}
                        {product.diamondSize && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Size:</span>
                            <span className="font-medium text-amber-900">{product.diamondSize}</span>
                          </div>
                        )}
                        {product.diamondWeight && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Weight:</span>
                            <span className="font-medium text-amber-900">{product.diamondWeight}</span>
                          </div>
                        )}
                        {product.diamondQuality && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Quality:</span>
                            <span className="font-medium text-amber-900">{product.diamondQuality}</span>
                          </div>
                        )}
                        {product.otherGemstones && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Other Gemstones:</span>
                            <span className="font-medium text-amber-900">{product.otherGemstones}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Book an Appointment
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative share-menu-container">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>

                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Link2 className="w-4 h-4" />
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setIsDescriptionOpen(true)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isDescriptionOpen
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setIsDescriptionOpen(false)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                !isDescriptionOpen
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        <div className="py-8">
          {isDescriptionOpen ? (
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.details}</p>
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
                            <span className="font-medium text-amber-800">
                              {review.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'text-amber-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment || 'No comment provided'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-6">Be the first to review this product</p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Products */}
      {products.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
                  <div className="relative h-64 bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </div>
                    )}
                    {product.isSale && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={reviewForm.customerName}
                    onChange={(e) => setReviewForm({...reviewForm, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="text-2xl focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating 
                              ? 'text-amber-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Book an Appointment</h3>
                <button
                  onClick={() => setShowCartModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCartSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={personalDetails.name}
                      onChange={(e) => setPersonalDetails({...personalDetails, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cultural Background
                    </label>
                    <select
                      value={personalDetails.culture}
                      onChange={(e) => setPersonalDetails({...personalDetails, culture: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select Culture</option>
                      <option value="None">None</option>
                      <option value="Newari">Newari</option>
                      <option value="Brahmin/Chhetri">Brahmin/Chhetri</option>
                      <option value="Tamang">Tamang</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPersonalDetails({...personalDetails, appointmentType: 'online'})}
                        className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                          personalDetails.appointmentType === 'online'
                            ? 'border-amber-600 bg-amber-50 text-amber-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Online
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonalDetails({...personalDetails, appointmentType: 'in-person'})}
                        className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                          personalDetails.appointmentType === 'in-person'
                            ? 'border-amber-600 bg-amber-50 text-amber-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        In Person
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={personalDetails.preferredDate}
                        onChange={(e) => setPersonalDetails({...personalDetails, preferredDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        value={personalDetails.preferredTime}
                        onChange={(e) => setPersonalDetails({...personalDetails, preferredTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={personalDetails.additionalNotes}
                      onChange={(e) => setPersonalDetails({...personalDetails, additionalNotes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCartModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Submit Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}