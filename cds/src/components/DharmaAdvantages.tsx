'use client';

import { FileText, Smile, GraduationCap, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const advantages = [
  {
    id: 1,
    title: 'Amazing Value',
    icon: <FileText className="w-12 h-12 text-[#003057]" strokeWidth={1} />,
  },
  {
    id: 2,
    title: 'Peace of Mind',
    icon: <Smile className="w-12 h-12 text-[#003057]" strokeWidth={1} />,
  },
  {
    id: 3,
    title: 'Expert Guidance',
    icon: <GraduationCap className="w-12 h-12 text-[#003057]" strokeWidth={1} />,
  },
  {
    id: 4,
    title: 'Inspiring Assortment',
    icon: <Lightbulb className="w-12 h-12 text-[#003057]" strokeWidth={1} />,
  },
];

export default function DharmaAdvantages() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl tracking-[0.15em] font-normal text-gray-900 mb-4 uppercase font-sans">
            DHARMA ADVANTAGES
          </h2>
          <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-500 uppercase font-medium">
            REASON TO SHOP WITH US !
          </p>
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {advantages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group"
            >
              <div className="mb-6 p-4 rounded-full bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-800 tracking-wide">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
