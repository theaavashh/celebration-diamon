"use client"

import React from "react"

const AboutUs = () => {
  return (
    <section className="w-full pt-16 sm:pt-16 md:pt-16 px-8 sm:px-12 md:px-20 lg:px-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column - Small Heading */}
          <div className="lg:col-span-3">
            <h2 className="text-4xl font-bold text-black uppercase tracking-wider jimthompson">
              About Us
            </h2>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-9">
            <div className="max-w-none pr-0">
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-700 jimthompson mb-8 text-justify">
                <span className="font-semibold text-gray-900">Based in the heart of Kathmandu, we blend timeless elegance with modern precision.,</span>{" "}
                <span className="font-semibold text-gray-900">With an in-house diamond lab and 3 advanced SJI machines, </span>{" "}
                we ensure authenticity, ethical sourcing, and unmatched craftsmanship. Each piece is a fusion of tradition and innovation, designed with soul, delivered with meaning.
              </p>
              
              {/* Learn More Button */}
              <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black bg-black text-white hover:bg-gray-900 hover:text-white transition-all duration-300 jimthompson font-medium">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
