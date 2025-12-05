"use client";

import React from "react";
import { Truck, Globe, Shield, Award, Gem } from "lucide-react";
import Image from "next/image";

const ConfidentShop = () => {
  const features = [
    {
      icon: <Gem className="w-6 h-6" />,
      title: "Natural Diamonds",
      description: "Authentic diamonds, certified quality, ethically sourced."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Shipping",
      description: "Enjoy secure, fast, free global delivery"
    },
    
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certified Excellence",
      description: "Certified by trusted international labs, each diamond ensures you get precisely what you’ve selected.."
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-50 to-amber-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold jimthompson text-gray-900 mb-4">
            Shop with Assurance
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Experience the assurance of authentic diamonds with worldwide delivery
          </p>
        </div>

        {/* Features Section - Centered */}
        <div className="flex justify-center">
          <div className="space-y-8 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-sans mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-sans text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfidentShop;