import Link from 'next/link';
import { Search, User, Menu, Sun } from 'lucide-react';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start pt-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <div className="text-amber-500 mb-1">
              <Sun className="h-8 w-8" />
            </div>
            <Link href="/" className="flex flex-col items-center">
              <h1 className="text-2xl font-serif font-bold text-amber-600 tracking-wider leading-none">
                DHARMA
              </h1>
              <span className="text-amber-600 text-sm font-serif tracking-widest leading-none">
                JEWELS
              </span>
              <span className="text-amber-500 text-[10px] italic mt-1">
                Beyond Dreams...
              </span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6 pt-2">
            <Link href="/login" className="text-gray-800 hover:text-amber-600 transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <button className="text-gray-800 hover:text-amber-600 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <button className="text-gray-800 hover:text-amber-600 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
