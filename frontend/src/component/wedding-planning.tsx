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
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold jimthompson text-gray-900 mb-4">
            Our Wedding Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto font-sans">
            Everything you need for your special day, all under one roof at Celebration Diamond
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 py-12">
              No services available at the moment
            </div>
          ) : (
            services.map((service) => {
              const ServiceContent = (
                <div className="group relative h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
                    <Image
                      src={getImageUrl(service.imageUrl)}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/budget.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300 jimthompson">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6 font-sans">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {service.link ? (
                      <Link 
                        href={service.link}
                        className="inline-flex items-center text-amber-600 font-semibold group-hover:text-amber-700 transition-colors duration-300 font-sans"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    ) : (
                      <div className="inline-flex items-center text-amber-600 font-semibold font-sans">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    )}
                  </div>
                </div>
              );

              // If service has a link, wrap in Link component
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

        {/* View All Services Button */}
        <div className="text-center mt-12">
          <Link 
            href="/services" 
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-sans"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}

export default WeddingPlanning
