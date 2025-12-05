"use client"

import React from "react"
import Image from "next/image"
import { ArrowRight, Sparkles, Heart, Gem } from "lucide-react"

const CustomRing = () => {
  const steps = [
    {
      id: 1,
      title: "Consultation & Vision",
      description: "Discuss your ideas and vision with our expert designers"
    },
    {
      id: 2,
      title: "Design & Quote",
      description: "Receive a detailed design preview and transparent pricing"
    },
    {
      id: 3,
      title: "Approval & Creation",
      description: "Approve the design and we'll craft your dream ring"
    },
    {
      id: 4,
      title: "Delivery & Care",
      description: "Your ring is delivered with our lifetime care guarantee"
    }
  ]

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-amber-50/30 via-white to-gray-50/50">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Section - Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold jimthompson text-gray-900">
                  Design Your Dream Ring
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 font-sans">
                Create a bespoke ring that tells your unique love story
              </p>
            </div>

            {/* Process Steps */}
            <div className="space-y-6">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-sans">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                Start Your Design Journey
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Section - Bento Grid Images */}
          <div className="space-y-4">
            {/* Full Width Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/ring.png"
                alt="Custom Diamond Ring"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Two Images Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/ring.jpeg"
                  alt="Ornate Band Design"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/ring.png"
                  alt="Salt & Pepper Diamond"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomRing 