'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Using hardcoded data - no API calls needed

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Demo mode: Accept any credentials
      // In production, this would validate against the API
      
      // Hardcoded admin data based on email
      const adminData = {
        id: 'demo-admin-123',
        fullname: data.email === 'demo@retailer.com' 
          ? 'Demo Retailer' 
          : data.email.split('@')[0].charAt(0).toUpperCase() + data.email.split('@')[0].slice(1),
        username: data.email.split('@')[0],
        email: data.email,
        role: 'retailer',
        isActive: true,
      };

      // Generate a mock token
      const mockToken = 'demo-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
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
      
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 title-regular"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Login Form Card */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-blue-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <FaUser className="h-8 w-8 text-blue-600" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Please sign in to your account
            </motion.p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Email Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  className="mt-1 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Remember Me */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
            </motion.button>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div 
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><span className="font-medium">Email:</span> demo@retailer.com</p>
              <p><span className="font-medium">Password:</span> demo123</p>
        </div>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'demo@retailer.com');
                setValue('password', 'demo123');
              }}
              className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Use Demo Credentials
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

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
    </motion.div>
  );
}
