'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // API endpoint - use environment variable or default to localhost
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Store token and admin data
      const { token, admin } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      
      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      toast.success('Login successful! Redirecting...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 title-regular bg-[#FAFAFA]"
     
    >
      <div className="w-full max-w-md">
        {/* Login Form Card */}
        <div className="shadow-xl rounded-2xl p-8 border border-gray-200 bg-[#FFFFFF]" >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <img 
                src="/image.png" 
                alt="Company Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Retailer Admin Portal
          </h1>
            <p className="text-black text-sm">
              Please sign in to your admin account
          </p>
        </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg text-sm outline-none focus:border-black transition-colors ${
                    errors.email
                      ? "border-red-300"
                      : "border-black"
                  } bg-white text-black placeholder:text-black`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm outline-none focus:border-black transition-colors ${
                    errors.password
                      ? "border-red-300"
                      : "border-black"
                  } bg-white text-black placeholder:text-black`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-black transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-black">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
