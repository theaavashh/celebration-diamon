"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";

interface MidBanner {
  id: string;
  title: string;
  description: string | null;
  text: string;
  linkText: string | null;
  linkUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  leftImage: string | null;
  rightImage: string | null;
  leftImageHeight: number;
  rightImageHeight: number;
}

export default function AdvertisementBanner() {
  const [bannerData, setBannerData] = useState<MidBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMidBanner = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${getApiBaseUrl()}/mid-banners?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          const activeBanner = data.data.find((b: MidBanner) => b.isActive) || data.data[0];
          setBannerData(activeBanner);
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchMidBanner();
  }, []);

  if (isLoading || !bannerData) {
    return null;
  }

  return (
    <section
      className="w-full py-8 sm:py-12 px-4 sm:px-6 md:px-16"
      style={{ backgroundColor: bannerData.backgroundColor || "#f4f4f9" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mx-4">
          <motion.div
            className="text-center lg:text-left lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 jimthompson"
              style={{ color: bannerData.textColor || "#000000" }}
            >
              {bannerData.text || bannerData.title || "Advertisement"}
            </h2>
            {(() => {
              const raw = bannerData.description || '';
              const clean = raw.includes('||') ? raw.split('||')[0] : raw;
              const looksJson = /\{\s*"leftImage"/i.test(clean);
              return clean && !looksJson ? (
                <p className="text-lg sm:text-xl mb-4 font-sans" style={{ color: bannerData.textColor || "#333333" }}>
                  {clean}
                </p>
              ) : null;
            })()}
            {bannerData.linkUrl && (
              <Link href={bannerData.linkUrl}>
                <motion.button
                  className="inline-block bg-white text-amber-600 font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {bannerData.linkText || "Explore"}
                </motion.button>
              </Link>
            )}
          </motion.div>

          <motion.div
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-4 w-full max-w-2xl mx-auto">
              <div className="w-1/2 relative overflow-hidden group" style={{ height: `${bannerData.leftImageHeight || 300}px` }}>
                {bannerData.leftImage ? (
                  <Image
                    src={getImageUrl(bannerData.leftImage)}
                    alt="Left"
                    fill
                    unoptimized
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="w-1/2 relative overflow-hidden group" style={{ height: `${bannerData.rightImageHeight || 400}px` }}>
                {bannerData.rightImage ? (
                  <Image
                    src={getImageUrl(bannerData.rightImage)}
                    alt="Right"
                    fill
                    unoptimized
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
