'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type ApiTestimonial = {
  id: string;
  clientName?: string;
  customerName?: string;
  clientTitle?: string | null;
  company?: string | null;
  content?: string;
  description?: string;
  rating?: number | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

type Review = { id: string; name: string; image: string | null; text: string };

function resolveImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const uploadsIndex = imagePath.indexOf('/uploads/');
  const normalized = (uploadsIndex !== -1 ? imagePath.slice(uploadsIndex) : imagePath).replace(/\\/g, '/');
  const prefixed = normalized.startsWith('/') ? normalized : `/${normalized}`;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${apiUrl}${prefixed}`;
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
        const res = await fetch(`${base}/testimonials/public`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const mapped: Review[] = json.data
              .filter((t: ApiTestimonial) => t.isActive !== false)
              .map((t: ApiTestimonial) => ({
                id: String(t.id),
                name: (t.clientName || t.customerName || '').trim(),
                text: (t.content || t.description || '').trim(),
                image: resolveImageUrl(t.imageUrl || null),
              }));
            setReviews(mapped);
          }
        }
      } catch {}
      setLoading(false);
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Precious Craft */}
        <div className="text-center mb-24">
          <h2 className="text-2xl md:text-3xl font-normal text-gray-900 mb-6 font-serif">
            A Moments of Precious Craft
          </h2>
          <p className="text-[10px] md:text-[11px] leading-loose tracking-wider text-gray-600 font-medium uppercase max-w-5xl mx-auto">
            Our products exhibit a diversification of cultures much like our customers whose <span className="font-bold text-gray-900">LOYALTY</span> is not just an asset from our patrons but also a value towards our customers. Our faith in them is as unwavering as their towards us.
          </p>
        </div>

        {/* Reviews Section */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl tracking-[0.1em] font-normal text-gray-900 mb-20 font-sans">
            Customer Reviews
          </h2>

          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows (Visual only for this static layout) */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:block">
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:block">
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 gap-x-8">
              {(loading ? [] : reviews).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative bg-white border border-gray-100 shadow-sm p-8 pt-16 hover:shadow-md transition-shadow"
                >
                  {/* Floating Profile Image */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                    {review.image ? (
                      <Image src={review.image} alt={review.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col h-full justify-between">
                    <p className="text-[11px] leading-relaxed tracking-wide text-gray-600 mb-6 uppercase">
                      {review.text}
                    </p>
                    <h4 className="text-amber-600 font-medium text-sm tracking-wider uppercase">
                      {review.name}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-16">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
