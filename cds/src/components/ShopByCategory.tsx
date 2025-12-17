'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'NECKLACE',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2070&auto=format&fit=crop', // Greenish Necklace placeholder
  },
  {
    id: 2,
    name: 'EARRING',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop', // Earring placeholder
  },
  {
    id: 3,
    name: 'LADIES RING',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop', // Ring placeholder
  },
  {
    id: 4,
    name: 'BANGLE',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop', // Bangle placeholder
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl tracking-[0.15em] font-normal text-gray-900 mb-4 uppercase font-sans">
            SHOP BY CATEGORY
          </h2>
          <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-500 uppercase font-medium">
            CHOOSE FROM OUR VAST JEWELLERY COLLECTION
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-full aspect-square bg-gray-50 mb-6 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Optional overlay effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              <h3 className="text-sm tracking-[0.15em] font-medium text-gray-900 uppercase">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button className="group flex flex-col items-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">VIEW ALL</span>
            <span className="w-6 h-[2px] bg-amber-600 group-hover:w-10 transition-all duration-300"></span>
          </button>
        </div>

      </div>
    </section>
  );
}
