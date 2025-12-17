'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function StyleStatement() {
  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          
          {/* Left Side - Earrings Image with Overlapping Card */}
          <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
               {/* Earring Image */}
               <motion.div
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1 }}
                 viewport={{ once: true }}
                 className="relative w-[85%] h-full shadow-lg"
               >
                 <Image
                   src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop"
                   alt="Ruby Earrings"
                   fill
                   className="object-cover"
                 />
               </motion.div>

               {/* Overlapping Card */}
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1, delay: 0.5 }}
                 viewport={{ once: true }}
                 className="absolute top-1/2 right-0 -translate-y-1/2 w-[55%] bg-[#e8e8e8] p-8 md:p-10 shadow-xl rounded-r-[50px] flex flex-col items-center justify-center text-center z-10 min-h-[200px]"
               >
                 <p className="text-[12px] md:text-[13px] tracking-wide text-gray-800 mb-8 font-medium font-sans leading-relaxed">
                   The style statement every Woman craves for.
                 </p>
                 <button className="group flex flex-col items-center">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">VIEW</span>
                    <span className="w-6 h-[2px] bg-amber-600 group-hover:w-10 transition-all duration-300"></span>
                 </button>
               </motion.div>
            </div>
          </div>

          {/* Right Side - Necklace Image */}
          <div className="w-full md:w-1/2 relative">
             <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2 }}
               viewport={{ once: true }}
               className="relative w-full max-w-[500px] h-[600px] md:h-[700px] shadow-lg ml-0 md:ml-8"
             >
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop" 
                  alt="Ruby Necklace"
                  fill
                  className="object-cover"
                />
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
