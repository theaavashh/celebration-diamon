"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface ReturnPolicy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ReturnPolicyPage = () => {
  const [returnPolicy, setReturnPolicy] = useState<ReturnPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturnPolicy = async () => {
      try {
        setIsLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/return-policy`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setReturnPolicy(data.data);
          } else {
            setError('Return policy not found');
          }
        } else {
          setError('Failed to fetch return policy');
        }
      } catch (error) {
        console.error('Error fetching return policy:', error);
        setError('Failed to fetch return policy');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturnPolicy();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading return policy...</p>
        </div>
      </div>
    );
  }

  if (error || !returnPolicy) {
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
          <div className="text-center">
            <p className="text-red-600">{error || 'Return policy not found'}</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8 jimthompson">{returnPolicy.title}</h1>

          {/* Return Policy Content */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .return-policy-content strong,
              .return-policy-content b,
              .return-policy-content h2,
              .return-policy-content h3,
              .return-policy-content h4,
              .return-policy-content h5,
              .return-policy-content h6 {
                font-family: 'JimThompson', sans-serif !important;
              }
            `
          }} />
          <div 
            className="return-policy-content"
            dangerouslySetInnerHTML={{ __html: returnPolicy.content }}
          />

          {/* Last Updated */}
          <section className="mb-12">
            <p className="text-sm text-gray-500 italic">
              Last updated: {new Date(returnPolicy.updatedAt).toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ReturnPolicyPage
