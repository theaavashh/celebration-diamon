"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gem, Shield, Sparkles, Heart } from "lucide-react";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("natural-diamonds");

  const categories = [
    {
      id: "natural-diamonds",
      title: "Natural Diamonds",
      description: "Authentic diamonds formed naturally over billions of years, offering timeless beauty and value.",
      icon: <Gem className="w-6 h-6" />,
      image: "/natural_diamonds.jpg",
      features: [
        "GIA Certified",
        "Ethically Sourced",
        "Lifetime Warranty",
        "Expert Appraisal"
      ]
    },
    {
      id: "lab-grown",
      title: "Lab Grown Diamonds",
      description: "Sustainable and eco-friendly diamonds with the same brilliance as natural diamonds.",
      icon: <Sparkles className="w-6 h-6" />,
      image: "/lab_grown.jpg",
      features: [
        "Chemically Identical",
        "Environmentally Friendly",
        "Cost Effective",
        "Conflict Free"
      ]
    },
    {
      id: "engagement-rings",
      title: "Engagement Rings",
      description: "Exquisite rings designed to celebrate your love story with unparalleled craftsmanship.",
      icon: <Heart className="w-6 h-6" />,
      image: "/engagement_rings.jpg",
      features: [
        "Custom Design",
        "Premium Settings",
        "Free Resizing",
        "Gift Packaging"
      ]
    },
    {
      id: "jewelry",
      title: "Fine Jewelry",
      description: "Handcrafted pieces that blend elegance with contemporary design for every occasion.",
      icon: <Shield className="w-6 h-6" />,
      image: "/fine_jewelry.jpg",
      features: [
        "Premium Materials",
        "Artisan Crafted",
        "Complementary Cleaning",
        "Style Consultation"
      ]
    }
  ];

  const activeCategoryData = categories.find(cat => cat.id === activeCategory) || categories[0];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold jimthompson text-gray-900 mb-4">
            Our Collections
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Discover our carefully curated collections of exceptional diamonds and jewelry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Categories List */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`group cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-amber-50 border-2 border-amber-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      activeCategory === category.id
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                    }`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 font-sans ${
                        activeCategory === category.id
                          ? 'text-amber-700'
                          : 'text-gray-900 group-hover:text-amber-700'
                      }`}>
                        {category.title}
                      </h3>
                      <p className="text-gray-600 font-sans">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Category Details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-3xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Image Section */}
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={activeCategoryData.image}
                    alt={activeCategoryData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl font-bold jimthompson text-gray-900 mb-4">
                    {activeCategoryData.title}
                  </h3>
                  <p className="text-gray-600 mb-6 font-sans">
                    {activeCategoryData.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 font-sans">
                      Why Choose {activeCategoryData.title}?
                    </h4>
                    <ul className="space-y-2">
                      {activeCategoryData.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700 font-sans">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/collections/${activeCategoryData.id}`}
                    className="inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-sans"
                  >
                    Explore {activeCategoryData.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;