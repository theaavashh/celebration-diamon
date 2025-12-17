'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || res.errors?.[0]?.msg || 'Something went wrong');
      }

      setStatus('success');
      setMessage('Thank you for subscribing!');
      reset();
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Instagram Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 md:px-8">
          <span className="text-lg md:text-xl text-gray-900 font-normal tracking-wide mb-4 md:mb-0">
            Follow us on Insta
          </span>
          <span className="text-lg md:text-xl text-gray-900 font-normal tracking-wide">
            dharma_jewels_
          </span>
        </div>

        {/* Subscription Form */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl tracking-[0.15em] font-normal text-gray-900 mb-4 uppercase font-sans">
            JOIN THE REVOLUTION
          </h2>
          <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-500 uppercase font-medium mb-12">
            GET BEST DEALS AND OFFERS
          </p>

          <form className="flex flex-col sm:flex-row max-w-2xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="E-mail ID"
              className="flex-1 bg-[#e6e6e6] px-6 py-4 text-sm text-gray-800 placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email',
                },
              })}
              disabled={status === 'loading' || isSubmitting}
            />
            <button
              type="submit"
              className="bg-[#9e7d4d] text-white px-10 py-4 text-sm font-medium hover:bg-[#8a6c42] transition-colors disabled:opacity-50"
              disabled={status === 'loading' || isSubmitting}
            >
              {status === 'loading' || isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {errors.email && (
            <p className="mt-2 text-center text-sm text-red-600">{errors.email.message as string}</p>
          )}
          {message && (
            <p className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
