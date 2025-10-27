"use client"

import React, { useState } from "react"
import { ChevronRight } from "lucide-react"

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null) // All questions closed by default

  const faqItems = [
    {
      question: "Where is Celebration Diamonds located?",
      answer: "We are located at NB Centre, New Baneshwor, Kathmandu, Nepal."
    },
    {
      question: "Do you provide certificates with your jewelry?",
      answer: "Yes, all our gemstones and diamonds are certified by our in-house gemological lab and international labs like GIA and IGI."
    },
    {
      question: "Can I custom-make a jewelry design?",
      answer: "Absolutely! We offer fully customized jewelry with expert consultation and CAD design previews."
    },
    {
      question: "Do you ship outside Kathmandu or internationally?",
      answer: "Yes, we ship across Nepal and internationally with secured packaging and insurance upon request."
    },
    {
      question: "How long does it take to make a custom piece?",
      answer: "It generally takes 10–15 working days depending on design and making process."
    },
    {
      question: "Is your store safe for high-value transactions?",
      answer: "Yes. We ensure complete privacy and physical security for all our in-store dealings and follow the rules and regulations applied by the related authorities."
    }
  ]

  return (
    <section className="w-full py-16 sm:py-20 md:py-16 px-8 sm:px-12 md:px-20 lg:px-24 bg-gradient-to-br from-amber-50/30 via-white to-gray-50/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-200/10 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-amber-100/20 to-transparent rounded-full translate-x-24 translate-y-24"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Header */}
          <div className="space-y-6 flex flex-col j">
            <div className="space-y-4">
              <p className="text-md jimthompson font-medium text-gray-500 uppercase tracking-wider">
                Guidance Refined for the Discerning Mind
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl jimthompson font-bold text-gray-900 leading-tight">
                Eternal Questions & Answer
              </h2>
            </div>
             {/* Bottom Section with Dots and Description - Left Side */}
         <div className="flex justify-start md:mt-36">
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <p className="jimthompson text-xl leading-relaxed">
              Our FAQ is crafted to answer your most important questions, offering peace of mind before you begin your jewelry journey.
            </p>
          </div>
        </div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-0">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-6 flex items-start justify-between text-left hover:bg-white/30 transition-colors duration-200 group"
                >
                  <span className="text-xl jimthompson text-gray-800 group-hover:text-gray-900 transition-colors pr-4 leading-relaxed">
                    {item.question}
                  </span>
                  <div className="flex items-center flex-shrink-0 mt-1">
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {/* Answer */}
                {item.answer && (
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

       

   
      
      </div>
    </section>
  )
}

export default FAQ 