"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getApiBaseUrl, getImageUrl } from "@/lib/api"

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
      const response = await fetch(`${getApiBaseUrl()}/diamond-certifications`)
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
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
      {certification.imageUrl && (
        <div className="relative h-[400px] w-full">
          <Image
            src={getImageUrl(certification.imageUrl)}
            alt={certification.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!certification.imageUrl && (
          <h1 className="text-4xl md:text-5xl jimthompson font-bold text-gray-900 mb-8">
            {certification.title}
          </h1>
        )}

        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            {certification.description}
          </p>
        </div>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: certification.fullContent || '' }}
        />
      </div>

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
