"use client";
import React, { useEffect, useState } from 'react'

const Section = () => {
  const [homepageContent, setHomepageContent] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/content/homepage")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.content) {
          setHomepageContent({
            title: data.content.title,
            description: data.content.description
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch homepage content:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 bg-gradient-to-br from-blue-50 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="lg:col-span-8">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 bg-gradient-to-br from-blue-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-500/10 to-transparent rounded-b-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column - Title */}
          <div className="lg:col-span-5">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl jimthompson font-bold text-gray-900 leading-tight">
                {homepageContent?.title || "SUMMER STYLE"}
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic">
                  COLLECTION
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                {homepageContent?.description || "Embrace the glow of the season with our radiant Summer Style Collection. From lightweight diamond accents to breezy gold pieces, discover jewelry designed to shine with your every summer moment."}
              </p>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm sm:text-base font-medium rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span>Explore Collection</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-full hover:border-amber-500 hover:text-amber-600 transition-all duration-300">
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section