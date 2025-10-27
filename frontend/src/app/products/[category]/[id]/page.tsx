"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag, Share2, Star, Facebook, Twitter, Instagram, MessageCircle, Link2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  details: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  metalType?: string;
  goldWeight?: string;
  diamondQuantity?: string;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
}

export default function ProductDetailPage() {
  const { useParams } = require('next/navigation');
  const params = useParams();
  const category = params.category as string;
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const product = data.data;
          setProduct({
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.category.toLowerCase(),
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.imageUrl?.startsWith('http') 
              ? product.imageUrl 
              : product.imageUrl 
                ? `http://localhost:5000${product.imageUrl}` 
                : `/${category}.jpeg`,
            rating: 4.5,
            reviews: 0,
            description: product.description,
            details: product.description,
            inStock: product.stock > 0,
            isNew: product.isNew || false,
            isSale: product.isSale || false,
            metalType: product.metalType,
            goldWeight: product.goldWeight,
            diamondQuantity: product.diamondQuantity,
            diamondSize: product.diamondSize,
            diamondWeight: product.diamondWeight,
            diamondQuality: product.diamondQuality,
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
        const response = await fetch(`http://localhost:5000/api/products?limit=4`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const mappedProducts = data.data
            .filter((p: any) => p.id !== id) // Exclude current product
            .slice(0, 4)
            .map((product: any) => ({
              id: product.id,
              name: product.name,
              category: product.category,
              subcategory: product.category.toLowerCase(),
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.imageUrl?.startsWith('http') 
                ? product.imageUrl 
                : product.imageUrl 
                  ? `http://localhost:5000${product.imageUrl}` 
                  : `/${product.category}.jpeg`,
              rating: 4.5,
              reviews: 0,
              description: product.description,
              details: product.description,
              inStock: product.stock > 0,
              isNew: product.isNew || false,
              isSale: product.isSale || false,
              metalType: product.metalType,
              goldWeight: product.goldWeight,
              diamondQuantity: product.diamondQuantity,
              diamondSize: product.diamondSize,
              diamondWeight: product.diamondWeight,
              diamondQuality: product.diamondQuality,
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
        const response = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
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
      const response = await fetch('http://localhost:5000/api/reviews/', {
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
        const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
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
      const response = await fetch('http://localhost:5000/api/appointments', {
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
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
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
              </div>
              
              <div className="flex gap-3">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-amber-600">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Add more thumbnails here if needed */}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 jimthompson">{product.name}</h1>
                  <div className="flex items-center gap-2 relative">
                    <button className="px-4 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="relative share-menu-container">
                      <button 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="px-4 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      
                      {/* Share Menu */}
                      {showShareMenu && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 min-w-[200px]">
                          <div className="space-y-1">
                            <button
                              onClick={() => handleShare('facebook')}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Facebook className="w-5 h-5 text-blue-600" />
                              <span className="text-sm">Facebook</span>
                            </button>
                            <button
                              onClick={() => handleShare('twitter')}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Twitter className="w-5 h-5 text-sky-500" />
                              <span className="text-sm">Twitter</span>
                            </button>
                            <button
                              onClick={() => handleShare('whatsapp')}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MessageCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm">WhatsApp</span>
                            </button>
                            <button
                              onClick={() => handleShare('copy')}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Link2 className="w-5 h-5" />
                              <span className="text-sm">Copy Link</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {product.rating && (
                  <div className="flex items-center gap-1 mb-6">
                    <span className="text-amber-600">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                )}
                
                <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Details Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setIsProductDetailsOpen(!isProductDetailsOpen)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 jimthompson">Product Details</h3>
                  {isProductDetailsOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {isProductDetailsOpen && (
                  <div className="p-6 bg-white space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Category</span>
                        <p className="text-base font-semibold text-gray-900">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Sub Category</span>
                        <p className="text-base font-semibold text-gray-900">{product.subcategory || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Gold Weight</span>
                        <p className="text-base font-semibold text-gray-900">{product.goldWeight || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Diamond Quantity</span>
                        <p className="text-base font-semibold text-gray-900">{product.diamondQuantity || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Diamond Size</span>
                        <p className="text-base font-semibold text-gray-900">{product.diamondSize || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Diamond Weight</span>
                        <p className="text-base font-semibold text-gray-900">{product.diamondWeight || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Diamond Quality</span>
                        <p className="text-base font-semibold text-gray-900">{product.diamondQuality || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Other Gemstones</span>
                        <p className="text-base font-semibold text-gray-900">{product.otherGemstones || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">Order Duration</span>
                        <p className="text-base font-semibold text-gray-900">{product.orderDuration || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Description Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 jimthompson">Description</h3>
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {isDescriptionOpen && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-amber-600 text-white py-4 px-8 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg flex items-center justify-center gap-2"
                >
                  Book an Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section - After Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 space-y-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 jimthompson">Customer Reviews ({reviews.length})</h3>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Write a Review
            </button>
          </div>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => {
                const initials = review.customerName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase();
                const colors = ['bg-amber-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600'];
                const colorIndex = review.customerName.length % colors.length;
                
                return (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < review.rating ? 'fill-amber-600 text-amber-600' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Just For You - Product Recommendations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center jimthompson">Just For You</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 && products.slice(0, 4).map((recProduct) => (
            <Link
              key={recProduct.id}
              href={`/products/${recProduct.category}/${recProduct.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={recProduct.image}
                  alt={recProduct.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recProduct.name}</h4>
                <p className="text-lg font-bold text-amber-600">${recProduct.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 jimthompson">Write a Review</h2>
              <form onSubmit={handleSubmitReview}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewForm.customerName}
                      onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-8 h-8 transition-colors ${
                              star <= reviewForm.rating ? 'fill-amber-600 text-amber-600' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-600 text-white py-4 px-8 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setReviewForm({ customerName: '', rating: 5, comment: '' });
                      }}
                      className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 jimthompson">Book an Appointment</h2>
              <form onSubmit={handleCartSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={personalDetails.name}
                    onChange={(e) => setPersonalDetails({...personalDetails, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={personalDetails.email}
                    onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={personalDetails.phone}
                    onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="culture" className="block text-sm font-medium text-gray-700 mb-1">Cultural Background</label>
                  <select
                    id="culture"
                    value={personalDetails.culture}
                    onChange={(e) => setPersonalDetails({...personalDetails, culture: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  >
                    <option value="">None</option>
                    <option value="Newari">Newari</option>
                    <option value="Brahmin/Chhetri">Brahmin/Chhetri</option>
                    <option value="Tamang">Tamang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Appointment Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPersonalDetails({...personalDetails, appointmentType: 'online'})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        personalDetails.appointmentType === 'online'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 mb-1">Online Meeting</div>
                        <div className="text-sm text-gray-600">Video call appointment</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPersonalDetails({...personalDetails, appointmentType: 'instore'})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        personalDetails.appointmentType === 'instore'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 mb-1">In-Store Visit</div>
                        <div className="text-sm text-gray-600">Visit our showroom</div>
                      </div>
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    required
                    value={personalDetails.preferredDate}
                    onChange={(e) => setPersonalDetails({...personalDetails, preferredDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    id="time"
                    required
                    value={personalDetails.preferredTime}
                    onChange={(e) => setPersonalDetails({...personalDetails, preferredTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={personalDetails.additionalNotes}
                    onChange={(e) => setPersonalDetails({...personalDetails, additionalNotes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCartModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Book Appointment
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
