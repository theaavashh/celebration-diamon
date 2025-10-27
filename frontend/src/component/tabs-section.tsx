"use client"

import React, { useState } from "react"
import { ArrowRight, TrendingUp } from "lucide-react"

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "AUTHENTICITY",
      content: {
        heading: "100% Natural Diamonds",
        description: "We source our diamonds from the best suppliers in the world, ensuring that you get the best quality diamonds at the best price.",
        chart: {
          title: "Growth",
          period: "Monthly",
          data: [
            { month: "Jul", value: 0.2 },
            { month: "Jun", value: 0.8 },
            { month: "Aug", value: 1.8 },
            { month: "Sep", value: 1.2 },
            { month: "Oct", value: 2.8 }
          ]
        }
      }
    },
    {
      title: "TEAM OF EXPERTS",
      content: {
        heading: "Expert diamond craftsmen",
        description: "Our master craftsmen bring decades of experience in diamond cutting and jewelry design. Each piece is meticulously crafted by skilled artisans who understand the art of luxury jewelry.",
        chart: {
          title: "Expertise",
          period: "Years",
          data: [
            { month: "2010", value: 5 },
            { month: "2015", value: 12 },
            { month: "2020", value: 25 },
            { month: "2022", value: 35 },
            { month: "2024", value: 50 }
          ]
        }
      }
    },
    {
      title: "RESULTS",
      content: {
        heading: "Proven track record",
        description: "With over 1000+ satisfied customers and 5000+ custom pieces delivered, our results speak for themselves. Every piece tells a story of excellence and customer satisfaction.",
        chart: {
          title: "Satisfaction",
          period: "Quarterly",
          data: [
            { month: "Q1", value: 85 },
            { month: "Q2", value: 92 },
            { month: "Q3", value: 88 },
            { month: "Q4", value: 95 },
            { month: "Q1", value: 98 }
          ]
        }
      }
    }
  ]

  const rightContent = {
    heading: "Why Celebration Diamond is your top-choice",
    description: "We are a five-star rated holistic full-service diamond studio, serving thousands of clients. Our diamond studio covers all aspects of luxury jewelry: custom design, diamond sourcing, and craftsmanship, all the way to wedding collections, engagement rings, and bespoke jewelry.",
    button: "GET CONSULTATION"
  }

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-20 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Section - Purple Card with Tabs */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 lg:p-10">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-all duration-200 ${
                    activeTab === index
                      ? 'bg-purple-300 text-black rounded-lg'
                      : 'text-black hover:bg-purple-200 rounded-lg'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Heading in New Row */}
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-black">
                {tabs[activeTab].content.heading}
              </h2>
            </div>

            {/* Content */}
            <div className="mb-8">
              <p className="text-black leading-relaxed">
                {tabs[activeTab].content.description}
              </p>
            </div>

            {/* Chart Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">
                  {tabs[activeTab].content.chart.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{tabs[activeTab].content.chart.period}</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              
              {/* Simple Chart Visualization */}
              <div className="h-32 flex items-end justify-between gap-2">
                {tabs[activeTab].content.chart.data.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-8 bg-yellow-400 rounded-t-sm transition-all duration-500"
                      style={{ 
                        height: `${(item.value / Math.max(...tabs[activeTab].content.chart.data.map(d => d.value))) * 100}px` 
                      }}
                    />
                    <span className="text-xs text-gray-600">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - White Background */}
          <div className="lg:pl-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
              {rightContent.heading}
            </h2>
            <p className="text-black leading-relaxed mb-8 text-lg">
              {rightContent.description}
            </p>
            
            {/* CTA Button */}
            <button className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
              {rightContent.button}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TabsSection
