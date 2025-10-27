"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface DiamondCertification {
  id: string;
  title: string;
  description: string;
  fullContent?: string | null;
  ctaText: string;
  ctaLink?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function DiamondCertificationPage() {
  const [certification, setCertification] = useState<DiamondCertification | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertification()
  }, [])

  const fetchCertification = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diamond-certifications`)
      const data = await response.json()
      
      // API returns an array directly
      if (Array.isArray(data) && data.length > 0) {
        // Get the first active certification, sorted by sortOrder
        const activeCertification = data
          .filter((c: DiamondCertification) => c.isActive)
          .sort((a: DiamondCertification, b: DiamondCertification) => a.sortOrder - b.sortOrder)[0]
        
        if (activeCertification) {
          setCertification(activeCertification)
        }
      }
    } catch (error) {
      console.error('Error fetching diamond certification:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full py-16 px-4 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!certification || !certification.fullContent) {
    return (
      <div className="w-full py-16 px-4 text-center">
        <p className="text-gray-600">No certification content available</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header with Image */}
      {certification.imageUrl && (
        <div className="relative h-[400px] w-full">
          <img
            src={certification.imageUrl}
            alt={certification.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end">
            <div className="w-full max-w-7xl mx-auto px-4 pb-8">
              <h1 className="text-4xl md:text-5xl jimthompson font-bold text-white">
                {certification.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title (if no image) */}
        {!certification.imageUrl && (
          <h1 className="text-4xl md:text-5xl jimthompson font-bold text-gray-900 mb-8">
            {certification.title}
          </h1>
        )}

        {/* Description */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            {certification.description}
          </p>
        </div>

        {/* Rich Text Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: certification.fullContent || '' }}
        />
      </div>

      {/* CTA Button */}
      {certification.ctaLink && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href={certification.ctaLink}
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-md hover:bg-amber-700 transition-colors"
          >
            {certification.ctaText}
          </Link>
        </div>
      )}
    </div>
  )
}


