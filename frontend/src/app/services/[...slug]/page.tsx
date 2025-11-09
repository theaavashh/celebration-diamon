"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ServicePageProps {
  params: {
    slug: string[];
  } | Promise<{
    slug: string[];
  }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string[]>([]);

  // Resolve params (handle both Promise and non-Promise)
  useEffect(() => {
    if (params instanceof Promise) {
      params.then((resolved) => setSlug(resolved.slug));
    } else {
      setSlug(params.slug);
    }
  }, [params]);

  // Construct the full path from slug array
  const servicePath = slug.length > 0 ? `/${slug.join('/')}` : '';

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        // Fetch all services and find the one matching the path
        const response = await fetch('http://localhost:5000/api/services');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Find service by matching the link path
            const foundService = data.data.find(
              (s: Service) => s.link === servicePath && s.isActive
            );
            
            if (foundService) {
              setService(foundService);
            } else {
              setError('Service not found');
            }
          } else {
            setError('Failed to fetch services');
          }
        } else {
          setError('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Failed to fetch service');
      } finally {
        setIsLoading(false);
      }
    };

    if (servicePath) {
      fetchService();
    }
  }, [servicePath]);

  // Get image URL for service
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return '/budget.jpg'; // Fallback image
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The service you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Service Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={getImageUrl(service.imageUrl)}
              alt={service.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = '/budget.jpg';
              }}
            />
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 jimthompson">
                {service.title}
              </h1>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">Service ID:</span> {service.id.slice(0, 8)}...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services Section */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-8">Other Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This could be populated with other services */}
            <Link
              href="/"
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700">
                Explore All Services
              </h3>
              <p className="text-sm text-gray-600">
                Discover more services we offer
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
