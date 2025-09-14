"use client"

import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import {
  Autoplay,
  EffectCoverflow,
  Pagination,
} from "swiper/modules"

interface CarouselProps {
  images: { src: string; alt: string }[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 3000,
}) => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-gray-100">
      <div className="mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Limited Edition
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Exclusive jewelry pieces crafted with precision and elegance
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Swiper
            spaceBetween={40}
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
            }}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            loopAdditionalSlides={2}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
            }}
            navigation={false}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="swiper-container"
            style={{
              paddingBottom: '60px',
              paddingTop: '20px',
              width: '100%',
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide 
                key={index} 
                style={{ 
                  width: '280px',
                  height: '400px',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                className="sm:w-[320px] sm:h-[440px] md:w-[320px] md:h-[480px]"
              >
                <div className="relative group">
                  {/* Simple Card Container */}
                  <div className="relative h-[400px] sm:h-[440px] md:h-[480px] rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-white transform transition-all duration-300 group-hover:scale-105">
                    {/* Image */}
                    <Image
                      src={image.src}
                      fill
                      className="object-cover"
                      alt={image.alt}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
