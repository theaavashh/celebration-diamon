'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function JewelryShowcase() {
  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row relative">
          {/* Left Image */}
          <motion.div 
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative w-full md:w-[60%] h-[500px] shadow-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Rings"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 3, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative w-full md:w-[40%] h-[500px] md:mt-48 md:-ml-16 shadow-lg z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2070&auto=format&fit=crop"
              alt="Diamond Pendant"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Center Text Card - Overlapping */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: "-50%" }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
            className="absolute top-1/2 left-1/2 md:left-[55%] -translate-x-1/2 -translate-y-1/2 bg-[#f5f5f5] p-10 md:p-14 max-w-[450px] w-[90%] text-center shadow-2xl rounded-[50px] rounded-tr-none z-20"
          >
            <p className="text-[10px] md:text-[11px] leading-loose tracking-widest text-gray-800 mb-8 font-medium uppercase font-sans">
              I see bold accessories as a woman's armour. <br/>
              "Jewellery has the power to be the one little thing that makes you feel unique." <br/>
              "I've always thought of accessories as the exclamation point of a woman's outfit." <br/>
              "Jewellery is a very personal thing... it should tell a story about the person who's wearing it."
            </p>
            <div className="flex justify-center">
              <button className="group flex flex-col items-center">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-2">VIEW</span>
                <span className="w-6 h-[2px] bg-amber-600 group-hover:w-10 transition-all duration-300"></span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
