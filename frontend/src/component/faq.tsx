"use client"

import React, { useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-amber-50/30 via-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold jimthompson text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Everything you need to know about our diamonds and services
          </p>
        </div>

        {/* FAQ Container */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between group"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 font-sans group-hover:text-amber-700 transition-colors">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown 
                      className="w-5 h-5 text-gray-500"
                    />
                  </motion.div>
                </button>
                
                {/* Answer with Framer Motion animation */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 font-sans">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ 