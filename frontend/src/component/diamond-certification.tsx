"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { getApiBaseUrl, getImageUrl } from "@/lib/api"

interface DiamondCertification {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

const DiamondCertification = () => {
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

  if (loading || !certification) {
    return null
  }

  return (
    <section className="w-full py-16 sm:py-16 md:py-16 px-4 sm:px-6 md:px-16 bg-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[600px] sm:h-[700px] md:h-[700px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={certification.imageUrl ? getImageUrl(certification.imageUrl) : "/real-diamond.jpeg"}
                alt={certification.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl jimthompson font-bold text-gray-900 leading-tight">
                {certification.title}
              </h2>
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {certification.description}
              </p>

              <div className="pt-4">
                <a 
                  href={certification.ctaLink || "/diamond-certification"} 
                  className="inline-block text-amber-700 font-medium underline hover:text-amber-800 transition-colors duration-200"
                >
                  {certification.ctaText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiamondCertification
