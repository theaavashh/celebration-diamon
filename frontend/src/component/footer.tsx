"use client"

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaCopyright, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { getApiBaseUrl } from '@/lib/api';
import { Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({ subsets: ['latin'], weight: '400' });

type SiteSettings = {
  email: string;
  phone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

type ExpandedSections = {
  categories: boolean;
  account: boolean;
  company: boolean;
  support: boolean;
};

const CollapsibleSection: React.FC<{
  id: keyof ExpandedSections;
  title: string;
  links: { href: string; label: string }[];
  expanded: boolean;
  onToggle: () => void;
}> = ({ title, links, expanded, onToggle }) => (
  <div className="flex flex-col gap-2">
    <button onClick={onToggle} className="flex items-center justify-between text-2xl font-semibold mb-2 lg:mb-2 lg:cursor-default">
      <h2 className="jimthompson">{title}</h2>
      <span className="lg:hidden">{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
    <div className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${expanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 lg:max-h-32 lg:opacity-100'} overflow-hidden`}>
      {links.map((l) => (
        <a key={l.label} href={l.href} className="text-lg hover:underline">{l.label}</a>
      ))}
    </div>
  </div>
);

const LargeSocialIcons: React.FC<{ settings: SiteSettings }> = ({ settings }) => (
  <div className="hidden lg:flex items-center gap-4">
    {settings.facebookUrl && (
      <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        <FaFacebookF className="text-white" size={24} />
      </Link>
    )}
    {settings.instagramUrl && (
      <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        <FaInstagram className="text-white" size={24} />
      </Link>
    )}
    {settings.tiktokUrl && (
      <Link href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        <FaTiktok className="text-white" size={24} />
      </Link>
    )}
  </div>
);

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    categories: false,
    account: false,
    company: false,
    support: false
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    email: '',
    phone: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: ''
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const apiBase = getApiBaseUrl();
        const res = await fetch(`${apiBase}/settings`, { credentials: 'include' });
        const json = await res.json();
        if (res.ok && json?.success && json?.data) {
          setSiteSettings({
            email: json.data.email || '',
            phone: json.data.phone || '',
            address: json.data.address || '',
            facebookUrl: json.data.facebookUrl || '',
            instagramUrl: json.data.instagramUrl || '',
            tiktokUrl: json.data.tiktokUrl || ''
          });
        }
      } catch {} 
    };
    loadSettings();
  }, []);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className={`${publicSans.className} bg-black text-white px-6 lg:px-16 pt-10 flex flex-col gap-10`}>
      {/* Main Content: Newsletter + Links */}
      <div className="flex flex-col lg:flex-row justify-between gap-10 pl-4 lg:pl-0">
        {/* Left Section: Newsletter */}
        <section className="hidden gap-4 w-full lg:w-[30vw] md:flex flex-col">
            <Image
          src="/celebration-diamond-logo.png"
          alt="Celebration Diamond Logo"
          width={120}
          height={36}
          className="object-contain"
        />
        <div className="flex items-center gap-2 mt-4">
          <FaMapMarkerAlt className="text-white" />
          <span className="text-sm lg:text-base">{siteSettings.address || 'NB Center, Sankhamul, Kathmandu'}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-white" />
          <span className="text-sm lg:text-base">{siteSettings.email || 'support@celebrationdiamon.com'}</span>
        </div>
        {siteSettings.phone && (
          <div className="flex items-center gap-2">
            <FaPhone className="text-white" />
            <span className="text-sm lg:text-base">{siteSettings.phone}</span>
          </div>
        )}
        </section>

        {/* Right Section: Footer Links */}
        <div className="w-full lg:w-[70vw] flex flex-col gap-6">
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {([
              {
                id: 'categories',
                title: 'Categories',
                links: [
                  { href: '/stores', label: 'Necklace' },
                  { href: '/faq', label: 'Rings' }
                ]
              },
              {
                id: 'account',
                title: 'Account',
                links: [
                  { href: '/stores', label: 'Store' },
                  { href: '/faq', label: 'FAQ' }
                ]
              },
              {
                id: 'company',
                title: 'Company',
                links: [
                  { href: '#', label: 'About Us' },
                  { href: '#', label: 'Careers' },
                  { href: '#', label: 'Press' }
                ]
              },
              {
                id: 'support',
                title: 'Support',
                links: [
                  { href: '#', label: 'Help Center' },
                  { href: '#', label: 'Returns' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms-of-service', label: 'Terms & Condition' }
                ]
              }
            ] as const).map((sec) => (
              <CollapsibleSection
                key={sec.id}
                id={sec.id as keyof ExpandedSections}
                title={sec.title}
                links={sec.links}
                expanded={expandedSections[sec.id as keyof ExpandedSections]}
                onToggle={() => toggleSection(sec.id as keyof ExpandedSections)}
              />
            ))}
          </section>
        </div>
      </div>

   
  
      

     

      <div className="w-full flex items-center justify-between text-lg text-white border-t border-gray-700 mt-6 py-3 ">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <FaCopyright />
            <span>{new Date().getFullYear()} Celebration Diamonds. All Rights Reserved.</span>
          </span>
         
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end text-right">
          <LargeSocialIcons settings={siteSettings} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
