import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-screen w-full flex overflow-hidden">
      {/* Left Side - Solid Color & Text */}
      <div 
        className="relative z-10 w-full md:w-[45%] bg-[#7C8594] flex flex-col justify-center px-8 sm:px-12 lg:px-20 pt-20"
        style={{ clipPath: 'polygon(0 0, 80% 0, 100% 100%, 0% 100%)' }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-light text-white leading-tight">
          Shine bright like a diamond, <br />
          with this beautiful necklace.
        </h2>
      </div>

      {/* Right Side - Image */}
      <div className="absolute top-0 right-0 hidden md:block w-[80%] h-full bg-gray-200">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Necklace"
          fill
          className="object-cover"
          priority
        />
        
        {/* Social Icons - Floating on Right Edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col space-y-1">
          <a href="#" className="bg-[#3b5998] p-3 text-white hover:bg-opacity-90 transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-3 text-white hover:opacity-90 transition-opacity">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="bg-[#0077b5] p-3 text-white hover:bg-opacity-90 transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
