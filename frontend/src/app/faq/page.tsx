"use client"

import React, { useEffect, useState } from "react"
import { Public_Sans } from "next/font/google"
import { FaChevronRight } from "react-icons/fa"
import { getApiBaseUrl } from "@/lib/api"

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

const FAQPage = () => {
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>([])
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/faqs`, { credentials: 'include' })
        const json = await res.json()
        if (res.ok && json?.success && Array.isArray(json.data)) {
          setFaqs(json.data)
        } else {
          setError('Failed to load FAQs')
        }
      } catch {
        setError('Failed to load FAQs')
      } finally {
        setLoading(false)
      }
    }
    loadFaqs()
  }, [])

  return (
    <main className={`${publicSans.className} min-h-screen bg-white`}>
      <section className="px-4 md:px-8 pt-24 pb-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <h1 className="jimthompson text-[40px] md:text-[64px] leading-[1.05] text-gray-900">Frequently asked<br/>questions</h1>
          <div className="flex items-center gap-3 text-sm text-gray-700 mt-3">
            <span className="uppercase tracking-wider">FAQ'S</span>
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300">{String(faqs.length).padStart(2,'0')}</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading && <div className="text-gray-600">Loading...</div>}
          {error && !loading && <div className="text-red-600">{error}</div>}
          {!loading && !error && faqs.map((item) => (
            <div key={item.id} className="border-t border-gray-200">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between py-6"
              >
                <span className="text-xl text-gray-900">{item.question}</span>
                <FaChevronRight className={`text-gray-500 transition-transform ${openItems[item.id] ? 'rotate-90' : ''}`} />
              </button>
              {openItems[item.id] && (
                <div className="pb-6 text-gray-700 whitespace-pre-line">
                  {item.answer}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-gray-200 mt-6 pt-10 text-center">
            <p className="text-gray-700">Still have questions? <a href="mailto:support@celebrationdiamondstudio.com" className="underline">Email us</a> or <a href="tel:+15551234567" className="underline">call us</a>.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FAQPage 
