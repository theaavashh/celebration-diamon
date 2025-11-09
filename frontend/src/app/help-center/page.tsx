"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface HelpCenter {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const HelpCenterPage = () => {
  const [helpCenter, setHelpCenter] = useState<HelpCenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHelpCenter = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/help-center`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setHelpCenter(data.data);
          } else {
            setError('Help center not found');
          }
        } else {
          setError('Failed to fetch help center');
        }
      } catch (error) {
        console.error('Error fetching help center:', error);
        setError('Failed to fetch help center');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHelpCenter();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading help center...</p>
        </div>
      </div>
    );
  }

  if (error || !helpCenter) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
          <div className="text-center">
            <p className="text-red-600">{error || 'Help center not found'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 jimthompson">{helpCenter.title}</h1>

          {/* Help Center Content */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .help-center-content strong,
              .help-center-content b,
              .help-center-content h2,
              .help-center-content h3,
              .help-center-content h4,
              .help-center-content h5,
              .help-center-content h6 {
                font-family: 'JimThompson', sans-serif !important;
              }
            `
          }} />
          <div 
            className="help-center-content"
            dangerouslySetInnerHTML={{ __html: helpCenter.content }}
          />

          {/* Last Updated */}
          <section className="mb-12">
            <p className="text-sm text-gray-500 italic">
              Last updated: {new Date(helpCenter.updatedAt).toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default HelpCenterPage
