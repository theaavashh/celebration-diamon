'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { ChevronDown, RotateCcw, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';

// Mock data for products
const products = [
  { 
    id: 1, 
    code: '29', 
    gold: '18KT , 50.89 gms', 
    diamond: '7.82 ct', 
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    code: 'DN01429', 
    gold: 'Gold : 18KT , 19.76 gms', 
    diamond: '2.33 ct', 
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    code: '01417', 
    gold: 'Gold : 18KT , 20.45 gms', 
    diamond: '2.18 ct', 
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 4, 
    code: 'DN00948T', 
    gold: 'Gold : 18KT , 19.43 gms', 
    diamond: '', 
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop' 
  },
];

export default function ProductCategory() {
  const params = useParams();
  const category = (params.category as string).toUpperCase();
  const count = 8; // Mock count

  // Determine hero content based on category
  const getHeroContent = () => {
    switch (category) {
      case 'EARRINGS':
        return {
          title: 'Dazzling Earrings',
          subtitle: 'Earring to your loved ones',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop' // Model with earrings
        };
      case 'NECKLACE':
        return {
          title: 'Stunning Necklaces',
          subtitle: 'Adorn your neck with elegance',
          image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=2070&auto=format&fit=crop'
        };
      default:
        return {
          title: `Dazzling ${category}`,
          subtitle: `${category} to your loved ones`,
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop'
        };
    }
  };

  const heroContent = getHeroContent();

  return (
    <main className="min-h-screen bg-white">
      {/* Header overlaying the hero image */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-gray-200">
        <Image
          src={heroContent.image}
          alt={heroContent.title}
          fill
          className="object-cover object-top"
          priority
        />
        {/* Text Overlay */}
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 text-right text-white pr-10">
          <h1 className="text-4xl md:text-5xl font-sans font-normal tracking-wide mb-4">
            {heroContent.title}
          </h1>
          <div className="w-16 h-0.5 bg-white ml-auto mb-4"></div>
          <p className="text-lg md:text-xl font-light tracking-wider">
            {heroContent.subtitle}
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-[#e6e6e6] py-3 text-center">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          Home / <span className="text-gray-900">{category}({count})</span>
        </p>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-normal text-gray-800 tracking-wide">Filters :</span>
              <button className="text-gray-800 hover:text-amber-600">
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            {['SUB CATEGORY', 'COLLECTION', 'METAL WT.', 'DIAMOND WT.', 'ORDER TYPE'].map((filter) => (
              <div key={filter} className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-amber-600 transition-colors">
                  {filter}
                  <ChevronDown className="h-3 w-3" />
                </div>
                {/* Underline effect */}
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gray-200 group-hover:bg-amber-600 transition-colors"></div>
              </div>
            ))}
          </div>

          {/* Right Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Sort by :</span>
            <button className="bg-[#e6e6e6] px-4 py-2 text-[10px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 hover:bg-gray-300 transition-colors">
              StyleCode (Z-{'>'}A)
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="py-12">
          {/* Login Message */}
          <div className="text-center mb-12">
            <p className="text-sm text-gray-600 tracking-wide">
              Please <Link href="/login" className="font-bold text-gray-900 hover:text-amber-600">login</Link> to see more products..
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100 mb-2">
                  <Image
                    src={product.image}
                    alt="Jewelry Item"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800 tracking-wide">{product.code}</span>
                    <div className="flex items-center gap-3">
                      <button className="text-black hover:text-amber-600 transition-colors">
                        <ShoppingCart className="h-4 w-4" fill="black" />
                      </button>
                      <button className="text-black hover:text-amber-600 transition-colors">
                        <Heart className="h-4 w-4" fill="black" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-medium text-gray-600 tracking-wide">
                    <span>{product.gold}</span>
                    {product.diamond && <span>Dia. : {product.diamond}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
