"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface TermsAndConditions {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TermsPage = () => {
  const [terms, setTerms] = useState<TermsAndConditions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/terms`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setTerms(data.data);
          } else {
            setError('Terms and conditions not found');
          }
        } else {
          setError('Failed to fetch terms and conditions');
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        setError('Failed to fetch terms and conditions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading terms and conditions...</p>
        </div>
      </div>
    );
  }

  if (error || !terms) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
          <div className="text-center">
            <p className="text-red-600">{error || 'Terms and conditions not found'}</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8 jimthompson">{terms.title}</h1>

          {/* Terms Content */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .terms-content strong,
              .terms-content b,
              .terms-content h2,
              .terms-content h3,
              .terms-content h4,
              .terms-content h5,
              .terms-content h6 {
                font-family: 'JimThompson', sans-serif !important;
              }
            `
          }} />
          <div 
            className="terms-content"
            dangerouslySetInnerHTML={{ __html: terms.content }}
          />

          {/* Last Updated */}
          <section className="mb-12">
            <p className="text-sm text-gray-500 italic">
              Last updated: {new Date(terms.updatedAt).toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default TermsPage

