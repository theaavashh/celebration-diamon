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

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [section, setSection] = useState<TestimonialSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();

        const response = await fetch(`${apiBaseUrl}/testimonials`);
        const data = await response.json();

        if (data.success && data.data) {
          const testimonialsArray = Array.isArray(data.data) ? data.data : [];
          setTestimonials(testimonialsArray.filter((t: Testimonial) => t.isActive));
        }

        const sectionResponse = await fetch(`${apiBaseUrl}/testimonial-settings/admin`);
        const sectionData = await sectionResponse.json();

        if (sectionData.success && sectionData.data) {
          setSection(sectionData.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-600 mb-4">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
            {section?.title || "Stories From Our Clients"}
          </h2>
          {section?.subtitle && (
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{section.subtitle}</p>
          )}
        </div>

        <div className="relative">
          <div className="mx-auto max-w-3xl border border-gray-200 bg-white px-8 sm:px-12 py-12 sm:py-14">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="mx-auto h-6 w-24 rounded-full bg-gray-200" />
                <div className="mx-auto h-4 w-3/4 rounded-full bg-gray-200" />
                <div className="mx-auto h-4 w-2/3 rounded-full bg-gray-200" />
              </div>
            ) : testimonials.length === 0 ? (
              <p className="text-center text-gray-500">No testimonials available at the moment.</p>
            ) : currentTestimonial ? (
              <div className="flex flex-col items-center text-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <Quote className="h-10 w-10 text-amber-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
                    {currentTestimonial.company || "Client"}
                  </span>
                </div>

                <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-gray-800">
                  “{currentTestimonial.content}”
                </p>

                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200">
                    <Image
                      src={
                        currentTestimonial.imageUrl
                          ? getImageUrl(currentTestimonial.imageUrl)
                          : "https://via.placeholder.com/120x120?text=Client"
                      }
                      alt={currentTestimonial.clientName}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-gray-900">
                      {currentTestimonial.clientName}
                    </p>
                    {(currentTestimonial.clientTitle || currentTestimonial.company) && (
                      <p className="text-sm text-gray-500">
                        {currentTestimonial.clientTitle || currentTestimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {testimonials.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {testimonials.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-amber-500" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;

