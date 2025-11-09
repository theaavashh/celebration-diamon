"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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

const WeddingPlanning = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/services');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Filter active services and sort by sortOrder
            const activeServices = data.data
              .filter((service: Service) => service.isActive)
              .sort((a: Service, b: Service) => a.sortOrder - b.sortOrder);
            setServices(activeServices);
          }
        } else {
          setError('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

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
      <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 items-center">
            <div className="lg:col-span-1 lg:pr-8">
              <h2 className="text-2xl font-bold text-black leading-tight mb-4">
                Everything you need <br />
                all under celebration diamond
              </h2>
              <p className="text-lg sm:text-xl text-black mt-10">
                For all the days along the way
              </p>
            </div>
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-4 shadow-lg rounded-lg animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 items-center">
          {/* Left Section - Header */}
          <div className="lg:col-span-1 lg:pr-8">
            <h2 className="text-2xl font-bold text-black leading-tight mb-4">
              Everything you need <br />
              all under celebration diamond
            </h2>
            <p className="text-lg sm:text-xl text-black mt-10">
              For all the days along the way
            </p>
          </div>

          {/* Right Section - Services Grid */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length === 0 ? (
              <div className="col-span-full text-center text-gray-600">
                No services available
              </div>
            ) : (
              services.map((service) => {
                const ServiceContent = (
                  <div className="group relative bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg cursor-pointer">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-300">
                      {service.title}
                      <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Image Container */}
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={getImageUrl(service.imageUrl)}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/budget.jpg';
                        }}
                      />
                    </div>
                  </div>
                );

                // If service has a link, wrap in Link component to navigate to new page
                if (service.link) {
                  return (
                    <Link 
                      key={service.id} 
                      href={service.link}
                    >
                      {ServiceContent}
                    </Link>
                  );
                }

                return (
                  <div key={service.id}>
                    {ServiceContent}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WeddingPlanning
