"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Filter only active categories and sort by sortOrder
            const activeCategories = data.data
              .filter((cat: Category) => cat.isActive)
              .sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
            setCategories(activeCategories);
          }
        } else {
          setError('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null; // Don't render anything if there's an error or no categories
  }

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-6xl font-bold text-gray-900 mb-8 sm:mb-12 jimthompson">
          Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const categoryLink = category.link || `/products/${category.title.toLowerCase()}`;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={categoryLink} className="group block">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow duration-300">
                    {category.imageUrl && !imageErrors.has(category.id) ? (
                      <Image
                        src={category.imageUrl.startsWith('http') 
                          ? category.imageUrl 
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${category.imageUrl}`}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => {
                          // Mark this image as failed to load
                          setImageErrors(prev => new Set(prev).add(category.id));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">{category.title}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-center text-sm sm:text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {category.title}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

