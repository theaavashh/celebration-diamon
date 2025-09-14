"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react"
import Image from "next/image"

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      quote: "The entire staff at Celebration Diamond has been phenomenal. They are quick with their replies and incredibly helpful.",
      author: "Edward Kennedy",
      title: "Director, Client Experience"
    },
    {
      quote: "Exceptional craftsmanship and attention to detail. My custom engagement ring exceeded all expectations.",
      author: "Sarah Johnson",
      title: "Bride-to-be"
    },
    {
      quote: "Outstanding service from consultation to delivery. The team made our special day even more memorable.",
      author: "Michael Chen",
      title: "Groom"
    }
  ]

  const reviews = [
    { name: "Alice", image: "/reviewer1.jpg" },
    { name: "Bob", image: "/reviewer2.jpg" },
    { name: "Carol", image: "/reviewer3.jpg" }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Section - Testimonial */}
          <div className="relative">
            {/* Purple Quote Marks */}
            <div className="absolute -top-4 -left-4 text-6xl lg:text-8xl text-purple-500 font-bold opacity-20">
              "
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              <blockquote className="text-lg sm:text-xl lg:text-2xl text-black italic font-serif leading-relaxed mb-8">
                {testimonials[currentTestimonial].quote}
              </blockquote>

              <div className="mb-8">
                <h4 className="text-xl font-bold text-black mb-1">
                  {testimonials[currentTestimonial].author}
                </h4>
                <p className="text-gray-600">
                  {testimonials[currentTestimonial].title}
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-4">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Reviews Summary */}
          <div className="relative">
            {/* Decorative Dashed Line */}
            <div className="absolute top-0 right-0 w-32 h-32 lg:w-40 lg:h-40">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="text-black"
              >
                <path d="M0,20 Q20,0 40,20 T80,20 Q90,30 80,40 T80,60 Q70,80 50,60 T20,60 Q10,50 20,40" />
              </svg>
            </div>

            {/* Reviews Content */}
            <div className="relative z-10 pt-16 lg:pt-20">
              {/* Stars */}
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Review Count */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl font-semibold text-black">
                  5000+ Client reviews
                </span>
              </div>

              {/* Profile Pictures */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md"
                    >
                      {review.name.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-black font-medium">
                  View all reviews
                </span>
                <ArrowRight className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection



