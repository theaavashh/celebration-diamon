"use client"

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';
import { getApiBaseUrl } from '@/lib/api';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'], weight: '400' });

type SiteSettings = {
  phone: string;
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
        <a key={l.label} href={l.href} className="text-xl hover:underline">{l.label}</a>
      ))}
    </div>
  </div>
);

const LargeSocialIcons: React.FC<{ settings: SiteSettings }> = ({ settings }) => (
  <div className="hidden lg:flex gap-1">
    {settings.facebookUrl && (
      <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
        <Image src="/facebook-logo.webp" alt="Facebook" width={100} height={100} className="object-cover" />
      </Link>
    )}
    {settings.instagramUrl && (
      <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
        <Image src="/instagram-logo.png" alt="Instagram" width={100} height={100} className="object-contain" />
      </Link>
    )}
    {settings.tiktokUrl && (
      <Link href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
        <Image src="/tiktok-logo.png" alt="TikTok" width={32} height={32} className="object-contain" />
      </Link>
    )}
  </div>
);

const email = 'support@celebrationdiamon.com';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    categories: false,
    account: false,
    company: false,
    support: false
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    phone: '',
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
            phone: json.data.phone || '',
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
    <footer className={`${urbanist.className} bg-black text-white px-6 lg:px-16 pt-10 flex flex-col gap-10`}>
      {/* Main Content: Newsletter + Links */}
      <div className="flex flex-col lg:flex-row justify-between gap-10 pl-4 lg:pl-0">
        {/* Left Section: Newsletter */}
        <section className="hidden gap-5 w-full lg:w-[30vw] md:flex flex-col">
            <Image
          src="/celebration-diamond-logo.png"
          alt="Celebration Diamond Logo"
          width={120}
          height={36}
          className="object-contain"
        />

        
        </section>

        {/* Right Section: Footer Links */}
        <div className="w-full lg:w-[70vw] flex flex-col gap-6">
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <CollapsibleSection
              id="categories"
              title="Categories"
              links={[
                { href: '/stores', label: 'Necklace' },
                { href: '/faq', label: 'Rings' }
              ]}
              expanded={expandedSections.categories}
              onToggle={() => toggleSection('categories')}
            />
            <CollapsibleSection
              id="account"
              title="Account"
              links={[
                { href: '/stores', label: 'Store' },
                { href: '/faq', label: 'FAQ' }
              ]}
              expanded={expandedSections.account}
              onToggle={() => toggleSection('account')}
            />
            <CollapsibleSection
              id="company"
              title="Company"
              links={[
                { href: '#', label: 'About Us' },
                { href: '#', label: 'Careers' },
                { href: '#', label: 'Press' }
              ]}
              expanded={expandedSections.company}
              onToggle={() => toggleSection('company')}
            />
            <CollapsibleSection
              id="support"
              title="Support"
              links={[
                { href: '#', label: 'Help Center' },
                { href: '#', label: 'Returns' },
                { href: '#', label: 'Privacy Policy' }
              ]}
              expanded={expandedSections.support}
              onToggle={() => toggleSection('support')}
            />
          </section>
          <div className="flex flex-col items-end gap-2">
            <h5 className="text-md">{email}</h5>
            {siteSettings.phone && (
              <h5 className="text-xl">{siteSettings.phone}</h5>
            )}
          </div>
        </div>
      </div>

   
  
      

     

      <div className="w-full flex items-center justify-between  text-lg text-white ">
        <div className="flex items-center gap-3">
          <Link href="/terms-of-service" className="hover:underline">Terms & Condition</Link>
          <span className="hidden md:inline">•</span>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
           <span className="hidden md:inline">•</span>
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end text-right">
          <LargeSocialIcons settings={siteSettings} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
