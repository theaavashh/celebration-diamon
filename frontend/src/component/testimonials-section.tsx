"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { getApiBaseUrl, getImageUrl } from "@/lib/api";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  imageUrl: string | null;
  isActive: boolean;
}

interface TestimonialSection {
  id: string;
  title: string;
  subtitle: string | null;
  isActive: boolean;
}

const AUTOPLAY_INTERVAL = 6500;

const DEMO_TESTIMONIALS: Testimonial[] = [];
const DEMO_SECTION: TestimonialSection = { id: "demo", title: "Hear what our clients have to say", subtitle: null, isActive: true };

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [section, setSection] = useState<TestimonialSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const base = getApiBaseUrl();
        const res = await fetch(`${base}/testimonials/public`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const mapped: Testimonial[] = json.data
              .filter((t: any) => t.isActive !== false)
              .map((t: any) => ({
                id: t.id,
                clientName: t.clientName ?? t.customerName ?? "",
                clientTitle: t.clientTitle ?? null,
                company: t.company ?? null,
                content: t.content ?? t.description ?? "",
                rating: typeof t.rating === "number" ? t.rating : null,
                imageUrl: t.imageUrl ?? null,
                isActive: t.isActive !== false,
              }));
            setTestimonials(mapped);
            setSection(DEMO_SECTION);
            setLoading(false);
            return;
          }
        }
      } catch {}
      setTestimonials(DEMO_TESTIMONIALS);
      setSection(DEMO_SECTION);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  // Auto-advance when multiple testimonials are available
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const currentTestimonial = useMemo(() => testimonials[currentIndex], [testimonials, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const hasTestimonials = testimonials.length > 0;

  if (!loading && !hasTestimonials) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative h-[360px] sm:h-[420px] lg:h-[520px] bg-gray-100 animate-pulse" />
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-40 bg-gray-200" />
              <div className="h-6 w-3/4 bg-gray-200" />
              <div className="h-6 w-2/3 bg-gray-200" />
            </div>
          </div>
        ) : !currentTestimonial ? (
          <p className="text-center text-gray-500">No testimonials available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative w-full overflow-hidden">
              <div className="relative h-[360px] sm:h-[420px] lg:h-[520px]">
                <Image
                  src={currentTestimonial.imageUrl ? getImageUrl(currentTestimonial.imageUrl) : "https://via.placeholder.com/640x800?text=Client"}
                  alt={currentTestimonial.clientName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-sm tracking-wide text-gray-700 mb-4">{section?.subtitle || section?.title || "Hear what our clients have to say"}</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-gray-900">
                {currentTestimonial.content}
              </p>
              <div className="mt-6 text-gray-900 font-medium">
                {currentTestimonial.clientName}
              </div>
              {(currentTestimonial.clientTitle || currentTestimonial.company) && (
                <div className="text-gray-500">{currentTestimonial.clientTitle || currentTestimonial.company}</div>
              )}
              {testimonials.length > 1 && (
                <div className="mt-8 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;

