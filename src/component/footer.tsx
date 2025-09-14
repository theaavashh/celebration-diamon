"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({
    account: false,
    company: false,
    support: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="bg-black text-white px-6 lg:px-16 py-12 flex flex-col gap-10 font-covaline">
      {/* Main Content: Newsletter + Links */}
      <div className="flex flex-col lg:flex-row justify-between gap-10 pl-4 lg:pl-0">
        {/* Left Section: Newsletter */}
        <section className="flex flex-col gap-5 w-full lg:w-[30vw]">
          <h1 className="text-4xl font-jimthompson">Join Our Newsletter</h1>
          <h4 className="text-2xl font-covaline">Subscribe for updates on our next drop</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 text-white font-covaline bg-transparent border-2 border-white rounded-md"
            />
            <button className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition flex items-center justify-center">
              <FaArrowRight />
            </button>
          </div>
          <h5 className="text-xl mt-2 font-covaline hidden lg:flex">support@celebrationdiamon.com</h5>
          <h5 className="text-xl font-covaline hidden lg:flex">+977-9872727272</h5>
        </section>

        {/* Right Section: Footer Links */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full lg:w-[40vw]">
          {/* Account Section */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => toggleSection('account')}
              className="flex items-center justify-between text-2xl font-semibold mb-2 lg:mb-2 lg:cursor-default"
            >
              <h2>Account</h2>
              <span className="lg:hidden">
                {expandedSections.account ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <div className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${
              expandedSections.account ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 lg:max-h-32 lg:opacity-100'
            } overflow-hidden`}>
              <a href="/stores" className="text-lg hover:underline">Store</a>
              <a href="/faq" className="text-lg hover:underline">FAQ</a>
              
            </div>
          </div>

          {/* Company Section */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => toggleSection('company')}
              className="flex items-center justify-between text-2xl font-semibold mb-2 lg:mb-2 lg:cursor-default"
            >
              <h2>Company</h2>
              <span className="lg:hidden">
                {expandedSections.company ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <div className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${
              expandedSections.company ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 lg:max-h-32 lg:opacity-100'
            } overflow-hidden`}>
              <a href="#" className="text-lg hover:underline">About Us</a>
              <a href="#" className="text-lg hover:underline">Careers</a>
              <a href="#" className="text-lg hover:underline">Press</a>
            </div>
          </div>

          {/* Support Section */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => toggleSection('support')}
              className="flex items-center justify-between text-2xl font-semibold mb-2 lg:mb-2 lg:cursor-default"
            >
              <h2>Support</h2>
              <span className="lg:hidden">
                {expandedSections.support ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <div className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${
              expandedSections.support ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 lg:max-h-32 lg:opacity-100'
            } overflow-hidden`}>
              <a href="#" className="text-lg hover:underline">Help Center</a>
              <a href="#" className="text-lg hover:underline">Returns</a>
              <a href="#" className="text-lg hover:underline">Privacy Policy</a>
            </div>
          </div>
        </section>
      </div>

      {/* Contact and Social Media Section - Centered on mobile */}
      <section className="flex flex-col pl-6 items-left lg:hidden gap-6">
        <div className="flex flex-col items-left gap-2">
          <h5 className="text-md font-covaline">support@celebrationdiamon.com</h5>
          <h5 className="text-xl font-covaline">+977-9872727272</h5>
        </div>
        
        {/* Social Media Icons */}
        <div className="flex gap-4 text-xl">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaInstagram />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaTiktok />
          </a>
        </div>
      </section>

      {/* Full Width Section Below */}
      <section className="w-full border-gray-400 pt-6 text-sm flex flex-col lg:flex-row justify-between items-center gap-4 border-t-2">
        <h3 className="text-3xl font-extrabold uppercase jimthompson">Celebration Diamond</h3>

        <div className="flex flex-col lg:items-end gap-3 w-full lg:w-auto">
          {/* Social Media Icons - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex gap-4 text-xl">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <FaFacebookF />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <FaInstagram />
            </Link>
            <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              <FaTiktok />
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center mt-5 lg:justify-end gap-6 text-xl text-gray-400">
            <Link href="/terms-of-service" className="hover:underline cursor-pointer">
            <h4 className="hover:underline cursor-pointer">Terms & Condition</h4>
            </Link>
            <h4 className="hover:underline cursor-pointer">Privacy Policy</h4>
            <h4 className='text-md text-center'>© 2025 Celebration Diamonds</h4>
            <h4 className="hover:underline cursor-pointer">Developed by M.A.P TECH</h4>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
