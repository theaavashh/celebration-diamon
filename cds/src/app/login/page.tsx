'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-gray-200">
        <Image
          src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2070&auto=format&fit=crop"
          alt="Woman looking down"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Overlay gradient if needed, though design looks clean */}
      </div>

      {/* Main Content Container - Overlapping */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-32 mb-20">
        <div className="bg-white shadow-xl flex flex-col lg:flex-row relative">
          
          {/* Social Sidebar (Right Side fixed/absolute) */}
          <div className="hidden lg:flex flex-col gap-2 absolute top-0 -right-12">
            <a href="#" className="bg-[#3b5998] p-2 text-white hover:opacity-90 transition-opacity">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="bg-gradient-to-b from-purple-500 to-pink-500 p-2 text-white hover:opacity-90 transition-opacity">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="bg-[#0077b5] p-2 text-white hover:opacity-90 transition-opacity">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          {/* Registered Customers Column */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
            <h2 className="text-xl font-normal tracking-widest text-gray-800 mb-8 uppercase">
              Registered Customers
            </h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="email"
                  placeholder="E-mail Id"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>

              <div>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-900 tracking-wide">
                  Forgot Password ?
                </Link>
              </div>

              <div className="pt-4 flex flex-col items-center">
                <button className="text-sm font-bold text-gray-800 uppercase tracking-widest hover:text-amber-600 transition-colors">
                  LOGIN
                </button>
                <div className="h-0.5 w-8 bg-amber-600 mt-2"></div>
              </div>
            </form>
          </div>

          {/* New Customers Column */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <h2 className="text-xl font-normal tracking-widest text-gray-800 mb-8 uppercase">
              New Customers
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Mobile No.
                </label>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  className="w-full bg-[#e6e6e6] border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 outline-none placeholder-gray-500"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
