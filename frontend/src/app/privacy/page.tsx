"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PrivacyPolicyPage = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/privacy-policy`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPrivacyPolicy(data.data);
          } else {
            setError('Privacy policy not found');
          }
        } else {
          setError('Failed to fetch privacy policy');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setError('Failed to fetch privacy policy');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading privacy policy...</p>
        </div>
      </div>
    );
  }

  if (error || !privacyPolicy) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
          <div className="text-center">
            <p className="text-red-600">{error || 'Privacy policy not found'}</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8 jimthompson">{privacyPolicy.title}</h1>

          {/* Privacy Policy Content */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .privacy-content strong,
              .privacy-content b,
              .privacy-content h2,
              .privacy-content h3,
              .privacy-content h4,
              .privacy-content h5,
              .privacy-content h6 {
                font-family: 'JimThompson', sans-serif !important;
              }
            `
          }} />
          <div 
            className="privacy-content"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
          />

          {/* Last Updated */}
          <section className="mb-12">
            <p className="text-sm text-gray-500 italic">
              Last updated: {new Date(privacyPolicy.updatedAt).toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default PrivacyPolicyPage
