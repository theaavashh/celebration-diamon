'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Bell,
  MessageCircle,
  User,
  LogOut,
  Check,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  X,
  Shield,
  Store,
  Users,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface Retailer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  totalOrders: number;
  totalRevenue: number;
  lastLogin: string;
}

interface AddRetailerModalProps {
  onClose: () => void;
  onSuccess: (retailer: Retailer) => void;
}

interface EditRetailerModalProps {
  retailer: Retailer;
  onClose: () => void;
  onSuccess: () => void;
}

function AddRetailerModal({ onClose, onSuccess }: AddRetailerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    panVatNo: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    username: '',
    password: '',
    confirmPassword: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Retailer name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.panVatNo.trim()) {
      newErrors.panVatNo = 'PAN/VAT number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API endpoint - use environment variable or default to localhost
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Create retailer account
      const response = await fetch(`${API_URL}/api/auth/retailer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          shopName: formData.shopName,
          panVatNo: formData.panVatNo,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          status: formData.status,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create retailer');
      }

      // Create new retailer object from API response
      const retailerData = result.data.retailer;
      const newRetailer: Retailer = {
        id: retailerData.id,
        name: retailerData.name || formData.name,
        email: retailerData.email,
        phone: retailerData.phone,
        address: retailerData.address,
        status: retailerData.status as 'active' | 'inactive' | 'pending',
        registrationDate: new Date(retailerData.createdAt).toISOString().split('T')[0],
        totalOrders: retailerData.totalOrders || 0,
        totalRevenue: retailerData.totalRevenue || 0,
        lastLogin: retailerData.lastLogin || 'Never',
      };

      onSuccess(newRetailer);
      toast.success('Retailer created successfully!');
    } catch (error: any) {
      console.error('Error creating retailer:', error);
      toast.error(error.message || 'Failed to create retailer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
    setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-end p-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Add New Retailer</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Retailer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter retailer name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-black mb-2">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.shopName ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter shop name"
                />
                {errors.shopName && <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>}
              </div>

              <div>
                <label htmlFor="panVatNo" className="block text-sm font-medium text-black mb-2">
                  PAN/VAT Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="panVatNo"
                  name="panVatNo"
                  value={formData.panVatNo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.panVatNo ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter PAN/VAT number"
                />
                {errors.panVatNo && <p className="mt-1 text-sm text-red-600">{errors.panVatNo}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.username ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-black mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-300' : 'border-black'
                }`}
                placeholder="Enter street address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-black mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.city ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-black mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.state ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter state"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-black mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.zipCode ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="country" className="block text-sm font-medium text-black mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.country ? 'border-red-300' : 'border-black'
                }`}
                placeholder="Enter country"
              />
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>
          </div>

          {/* Password Management */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Password Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-300' : 'border-black'
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-black"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-black'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-black"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={generatePassword}
              className="mt-3 px-4 py-2 text-sm text-black hover:text-black font-medium border border-blue-300 hover:border-blue-400 rounded-lg transition-colors"
            >
              Generate Secure Password
            </button>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-black mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending" className="text-black">Pending</option>
              <option value="active" className="text-black">Active</option>
              <option value="inactive" className="text-black">Inactive</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-black font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Retailer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function EditRetailerModal({ retailer, onClose, onSuccess }: EditRetailerModalProps) {
  const [formData, setFormData] = useState({
    name: retailer.name,
    shopName: '',
    panVatNo: '',
    email: retailer.email,
    phone: retailer.phone,
    address: retailer.address.split(',')[0] || '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    status: retailer.status,
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch full retailer details
    const fetchRetailerDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/api/retailers/${retailer.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const data = result.data;
            setFormData({
              name: data.name || '',
              shopName: data.shopName || '',
              panVatNo: data.panVatNo || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              zipCode: data.zipCode || '',
              country: data.country || '',
              status: data.status || 'active',
              password: '',
              confirmPassword: '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching retailer details:', error);
      }
    };

    fetchRetailerDetails();
  }, [retailer.id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Retailer name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // Password validation (only if password is provided)
    if (formData.password || formData.confirmPassword) {
      if (!formData.password) {
        newErrors.password = 'Password is required if you want to change it';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/retailers/${retailer.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          shopName: formData.shopName,
          panVatNo: formData.panVatNo,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          status: formData.status,
          ...(formData.password && { password: formData.password }),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update retailer');
      }

      toast.success('Retailer updated successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating retailer:', error);
      toast.error(error.message || 'Failed to update retailer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-end p-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Edit Retailer</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-black mb-2">
                  Retailer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter retailer name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="edit-shopName" className="block text-sm font-medium text-black mb-2">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.shopName ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter shop name"
                />
                {errors.shopName && <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>}
              </div>

              <div>
                <label htmlFor="edit-panVatNo" className="block text-sm font-medium text-black mb-2">
                  PAN/VAT Number
                </label>
                <input
                  type="text"
                  id="edit-panVatNo"
                  name="panVatNo"
                  value={formData.panVatNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-black rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter PAN/VAT number"
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-black mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="edit-phone" className="block text-sm font-medium text-black mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-address" className="block text-sm font-medium text-black mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Enter street address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-city" className="block text-sm font-medium text-black mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? 'border-red-300' : 'border-black'
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="edit-state" className="block text-sm font-medium text-black mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? 'border-red-300' : 'border-black'
                    }`}
                    placeholder="Enter state"
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-zipCode" className="block text-sm font-medium text-black mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.zipCode ? 'border-red-300' : 'border-black'
                    }`}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                </div>

                <div>
                  <label htmlFor="edit-country" className="block text-sm font-medium text-black mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.country ? 'border-red-300' : 'border-black'
                    }`}
                    placeholder="Enter country"
                  />
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-black mb-2">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending" className="text-black">Pending</option>
              <option value="active" className="text-black">Active</option>
              <option value="inactive" className="text-black">Inactive</option>
            </select>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Password Reset (Optional)</h3>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="edit-password" className="block text-sm font-medium text-black mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="edit-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-black transition-colors"
                  style={{ top: '28px' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="relative">
                <label htmlFor="edit-confirmPassword" className="block text-sm font-medium text-black mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="edit-confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm text-black placeholder:text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-black'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-black transition-colors"
                  style={{ top: '28px' }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-black font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Retailer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAddRetailerModal, setShowAddRetailerModal] = useState(false);
  const [showEditRetailerModal, setShowEditRetailerModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRetailerId, setDeletingRetailerId] = useState<string | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isLoadingRetailers, setIsLoadingRetailers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 7;
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch retailers from API
  const fetchRetailers = async (page: number = 1) => {
    try {
      setIsLoadingRetailers(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/retailers?page=${page}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setRetailers(result.data);
          setTotalPages(result.totalPages || 1);
          setTotalCount(result.count || 0);
          setCurrentPage(result.page || 1);
        }
      }
    } catch (error) {
      console.error('Error fetching retailers:', error);
      toast.error('Failed to load retailers');
    } finally {
      setIsLoadingRetailers(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchRetailers(currentPage);
    }
  }, [admin, currentPage]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');

    if (!token || !adminData) {
      router.push('/');
      return;
    }

    try {
      setAdmin(JSON.parse(adminData));
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.push('/');
    }
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Filter retailers based on search and status (client-side filtering on current page)
  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         retailer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         retailer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || retailer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('rememberMe');
    router.push('/');
  };

  const handleEditRetailer = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setShowEditRetailerModal(true);
  };

  const handleDeleteRetailer = (retailerId: string) => {
    setDeletingRetailerId(retailerId);
    setShowDeleteModal(true);
  };

  const confirmDeleteRetailer = async () => {
    if (!deletingRetailerId) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/retailers/${deletingRetailerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Retailer deleted successfully!');
        setShowDeleteModal(false);
        setDeletingRetailerId(null);
        // Refresh the retailer list
        fetchRetailers(currentPage);
      } else {
        throw new Error(result.message || 'Failed to delete retailer');
      }
    } catch (error: any) {
      console.error('Error deleting retailer:', error);
      toast.error(error.message || 'Failed to delete retailer');
    }
  };

  const handleToggleStatus = async (retailerId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/retailers/${retailerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Retailer status updated to ${newStatus}`);
        // Refresh the retailer list
        fetchRetailers(currentPage);
      } else {
        throw new Error(result.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Calendar },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    totalRetailers: retailers.length,
    activeRetailers: retailers.filter(r => r.status === 'active').length,
    pendingRetailers: retailers.filter(r => r.status === 'pending').length,
    totalRevenue: retailers.reduce((sum, r) => sum + r.totalRevenue, 0),
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 space-y-6"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col space-y-2 flex-1 px-3">
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-black hover:bg-blue-100 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => router.push('/dashboard/price-quote')}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Price Quote</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors">
            <Store className="w-5 h-5" />
            <span className="font-medium">Retailer Management</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Users</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
            <span className="absolute left-8 top-3 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </button>
        </div>

        <div className="px-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition-colors w-full"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-black">Admin Portal</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-sm" />
              <input
                type="text"
                placeholder="Search retailers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-gray-300 transition-all text-black placeholder:text-black"
              />
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3 relative" ref={profileRef}>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-black" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
            >
              <span className="text-black font-medium text-sm">
                {(admin.fullname || admin.username || admin.email)[0].toUpperCase()}
              </span>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-xs font-medium text-black mb-3 uppercase">Currently in</p>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {(admin.fullname || admin.username || admin.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-black text-base truncate">
                          {admin.fullname || admin.username || 'Admin'}
                        </h3>
                        <p className="text-sm text-black mt-0.5">Administrator</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <p className="text-sm text-black truncate">{admin.email}</p>
                          <Check className="w-4 h-4 text-black flex-shrink-0" />
                          <ChevronDown className="w-4 h-4 text-black flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50 transition-colors">
                      Change Password
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-black hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black mb-1">Total Retailers</p>
                  <p className="text-2xl font-bold text-black">{stats.totalRetailers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-black" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black mb-1">Active Retailers</p>
                  <p className="text-2xl font-bold text-black">{stats.activeRetailers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-black" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black mb-1">Pending Approval</p>
                  <p className="text-2xl font-bold text-black">{stats.pendingRetailers}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-black" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-black">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Retailers Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">Retailers</h2>
                <p className="text-sm text-black mt-1">Manage all retailer accounts</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                  <option value="all" className="text-black">All Status</option>
                  <option value="active" className="text-black">Active</option>
                  <option value="inactive" className="text-black">Inactive</option>
                  <option value="pending" className="text-black">Pending</option>
                </select>
                <button
                  onClick={() => setShowAddRetailerModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Retailer</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Retailer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRetailers.map((retailer) => (
                    <motion.tr
                      key={retailer.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-black">{retailer.name}</div>
                          <div className="text-xs text-black">{retailer.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4 text-black" />
                            <span>{retailer.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-black" />
                            <span>{retailer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(retailer.status)}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={retailer.status === 'active'}
                              onChange={() => handleToggleStatus(retailer.id, retailer.status)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {retailer.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        ${retailer.totalRevenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {retailer.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditRetailer(retailer)}
                            className="p-2 text-black hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRetailer(retailer.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isLoadingRetailers ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-black mt-4">Loading retailers...</p>
              </div>
            ) : filteredRetailers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black">No retailers found matching your search.</p>
              </div>
            ) : null}
          </div>

          {/* Pagination */}
          {!isLoadingRetailers && retailers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-black">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{' '}
                <span className="font-medium">{totalCount}</span> retailers
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-black hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Retailer Modal */}
      <AnimatePresence>
        {showAddRetailerModal && (
          <AddRetailerModal
            onClose={() => setShowAddRetailerModal(false)}
            onSuccess={async (newRetailer) => {
              // Refresh retailers list from API
              try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const token = localStorage.getItem('token');
                
                await fetchRetailers(currentPage);
              } catch (error) {
                console.error('Error refreshing retailers:', error);
              }
              
              setShowAddRetailerModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Retailer Modal */}
      <AnimatePresence>
        {showEditRetailerModal && selectedRetailer && (
          <EditRetailerModal
            retailer={selectedRetailer}
            onClose={() => {
              setShowEditRetailerModal(false);
              setSelectedRetailer(null);
            }}
            onSuccess={async () => {
              // Refresh retailers list from API
              await fetchRetailers(currentPage);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingRetailerId && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Delete retailer?</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-black hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-black mb-2">
                  Are you sure you want to delete this retailer? This action cannot be undone.
                </p>
                {(() => {
                  const retailer = retailers.find(r => r.id === deletingRetailerId);
                  return retailer && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="font-semibold text-black mb-1">{retailer.name}</p>
                      <p className="text-sm text-black">{retailer.email}</p>
                    </div>
                  );
                })()}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-black font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteRetailer}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}

