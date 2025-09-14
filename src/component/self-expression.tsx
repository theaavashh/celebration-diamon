"use client"

import React from "react"
import Image from "next/image"

const SelfExpression = () => {
  const models = [
    {
      id: 1,
      name: "Elegant Diamond Collection",
      image: "/model1.jpeg",
      alt: "Woman wearing elegant diamond jewelry"
    },
    {
      id: 2,
      name: "Modern Diamond Design",
      image: "/model2.jpeg", 
      alt: "Woman showcasing modern diamond pieces"
    },
    {
      id: 3,
      name: "Classic Diamond Style",
      image: "/model3.jpeg",
      alt: "Woman with classic diamond jewelry"
    },
    {
      id: 4,
      name: "Contemporary Diamond Look",
      image: "/model4.jpeg",
      alt: "Woman displaying contemporary diamond designs"
    }
  ]

  return (
    <section className="w-full py-16 sm:py-20 md:py-16 px-8 sm:px-12 md:px-20 lg:px-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Central Text Block - Exact Reference Style */}
        <div className="relative z-10 text-center mb-8 lg:mb-12">
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl jimthompson font-light italic text-gray-900 leading-tight">
              "Thoughtfully crafted designs,
              <br />
              inclusive sizing, and colors inspired
              <br />
              by you. This isn't just jewelry. It's
              <br />
              self-expression."
            </blockquote>
          </div>
        </div>

       

      </div>
    </section>
  )
}

export default SelfExpression
