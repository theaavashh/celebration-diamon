'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { apiService } from '@/lib/apiClient';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'], weight: '400' });

interface HeroSection {
  id: string;
  heading: string;
  subHeading: string | null;
  description: string | null;
  ctaTitle: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HeroSectionPage() {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);
  const [heroForm, setHeroForm] = useState({
    heading: '',
    subHeading: '',
    description: '',
    ctaTitle: '',
    ctaLink: '',
    isActive: true
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingHeroId, setDeletingHeroId] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');

  // Fetch hero sections
  const fetchHeroSections = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<HeroSection[]>('/hero/admin/all');
      console.log('Fetched hero sections:', response.data);
      setHeroSections(response.data || []);
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      toast.error('Failed to fetch hero sections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSections();
  }, []);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setHeroForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // For heading field, also update the internal validation state
    if (field === 'heading') {
      // Trigger immediate validation check
      setTimeout(() => {
        // This gives the RichTextEditor time to update its internal state
      }, 0);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCropper = () => {
    if (!previewImage) return;
    setCroppingImageUrl(previewImage);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setIsCropping(true);
  };

  const applyCrop = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const image = imgRef.current as HTMLImageElement;
      const pixelRatio = window.devicePixelRatio;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width * pixelRatio;
      canvas.height = completedCrop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `hero-cropped-${Date.now()}.png`;
          const croppedFile = new File([blob], fileName, { type: 'image/png' });
          setSelectedImage(croppedFile);
          setPreviewImage(URL.createObjectURL(croppedFile));
          setIsCropping(false);
          setCroppingImageUrl('');
          setCrop(undefined);
          setCompletedCrop(undefined);
        }
      }, 'image/png');
    }
  };

  // Reset form when modal opens
  const openModal = () => {
    // If there's already a hero section, edit it instead of creating new
    if (heroSections.length > 0) {
      const existingHero = heroSections[0];
      setHeroForm({
        heading: existingHero.heading || '',
        subHeading: existingHero.subHeading || '',
        description: existingHero.description || '',
        ctaTitle: existingHero.ctaTitle || '',
        ctaLink: existingHero.ctaLink || '',
        isActive: existingHero.isActive
      });
      setSelectedImage(null);
      // Fix: Ensure the preview image is properly set when editing
      setPreviewImage(existingHero.imageUrl ? `http://localhost:5000${existingHero.imageUrl}` : null);
      setEditingHero(existingHero);
    } else {
      setHeroForm({
        heading: '',
        subHeading: '',
        description: '',
        ctaTitle: '',
        ctaLink: '',
        isActive: true
      });
      setSelectedImage(null);
      setPreviewImage(null);
      setEditingHero(null);
    }
    setIsModalOpen(true);
  };

  // Open edit modal with hero data
  const openEditModal = (hero: HeroSection) => {
    setHeroForm({
      heading: hero.heading || '',
      subHeading: hero.subHeading || '',
      description: hero.description || '',
      ctaTitle: hero.ctaTitle || '',
      ctaLink: hero.ctaLink || '',
      isActive: hero.isActive
    });
    setSelectedImage(null);
    setPreviewImage(hero.imageUrl ? `http://localhost:5000${hero.imageUrl}` : null);
    setEditingHero(hero);
    setIsModalOpen(true);
  };

  // Helper function to strip HTML tags and get plain text
  const stripHtmlTags = (html: string): string => {
    if (typeof window === 'undefined') return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Check if heading has content (for button disabled state)
  const hasHeadingContent = () => {
    if (!heroForm.heading) return false;
    // Handle both plain text and HTML content
    let content = heroForm.heading;
    
    // If it looks like HTML, try to extract text content
    if (content.includes('<') && content.includes('>')) {
      try {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = content;
        content = tmp.textContent || tmp.innerText || '';
      } catch (e) {
        // If parsing fails, use the original content
        console.warn('Failed to parse HTML content', e);
      }
    }
    
    return content.trim().length > 0;
  };

  // Handle create/edit hero section
  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      let headingContent = heroForm.heading || '';
      
      // If it looks like HTML, extract text content for validation
      if (headingContent.includes('<') && headingContent.includes('>')) {
        try {
          const tmp = document.createElement('DIV');
          tmp.innerHTML = headingContent;
          headingContent = tmp.textContent || tmp.innerText || '';
        } catch (e) {
          // If parsing fails, use the original content
          console.warn('Failed to parse HTML content', e);
        }
      }
      
      if (!headingContent.trim()) {
        toast.error('Heading is required. Please enter a heading for your hero section.');
        setIsSubmitting(false);
        return;
      }

      // Validate CTA link format if provided
      let ctaLink = heroForm.ctaLink || '';
      if (ctaLink.trim()) {
        ctaLink = ctaLink.trim();
        // Remove trailing period if user added one
        if (ctaLink.endsWith('.')) {
          ctaLink = ctaLink.slice(0, -1);
        }
        if (!ctaLink.startsWith('/')) {
          toast.error('CTA Link must start with / (e.g., /products)');
          setIsSubmitting(false);
          return;
        }
      }

      // Create data object for submission
      const data: { [key: string]: string | Blob } = {
        heading: heroForm.heading,
        subHeading: heroForm.subHeading || '',
        description: heroForm.description || '',
        ctaTitle: heroForm.ctaTitle || '',
        ctaLink: ctaLink,
        isActive: heroForm.isActive.toString()
      };
      
      // Add existing image URL when editing and no new image is selected
      if (editingHero && editingHero.imageUrl && !selectedImage) {
        data.imageUrl = editingHero.imageUrl;
      }
      
      let formData: FormData | { [key: string]: string | Blob } = data;
      const headers: any = {};
      
      // Handle image upload
      if (selectedImage) {
        // New image selected - use FormData
        formData = new FormData();
        formData.append('heading', data.heading);
        formData.append('subHeading', data.subHeading);
        formData.append('description', data.description);
        formData.append('ctaTitle', data.ctaTitle);
        formData.append('ctaLink', data.ctaLink);
        formData.append('isActive', data.isActive);
        formData.append('image', selectedImage);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // No image selected - use JSON
        headers['Content-Type'] = 'application/json';
      }
      
      if (editingHero) {
        // Log the form data for debugging
        console.log('Updating hero section with data:', {
          id: editingHero.id,
          data: formData,
          headers: headers
        });
        
        await apiService.put<HeroSection>(`/hero/${editingHero.id}`, formData, {
          headers: headers
        });
      } else {
        await apiService.post<HeroSection>('/hero', formData, {
          headers: headers
        });
      }

      // Force refresh the hero sections
      await fetchHeroSections();
      
      // Close modal and reset state
      setIsModalOpen(false);
      setEditingHero(null);
      
      // Reset form
      setHeroForm({
        heading: '',
        subHeading: '',
        description: '',
        ctaTitle: '',
        ctaLink: '',
        isActive: true
      });
      setSelectedImage(null);
      setPreviewImage(null);
      
      // Show success message
      toast.success('Hero section saved successfully!');
    } catch (error: unknown) {
      console.error('Error saving hero section:', error);
      const err = error as { message?: string; response?: { data?: any; status?: number }; config?: unknown };
      console.error('Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        config: err?.config
      });
      
      let errorMessage = 'Failed to save hero section';
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const validationErrors = err.response.data.errors
          .map((e: any) => e.msg || e.message || e)
          .join(', ');
        errorMessage = validationErrors || errorMessage;
      }
      
      if (err?.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err?.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check your inputs.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete hero section
  const handleDelete = async (id: string) => {
    try {
      await apiService.delete(`/hero/${id}`);
      toast.success('Hero section deleted successfully!');
      fetchHeroSections();
    } catch (error) {
      console.error('Error deleting hero section:', error);
      toast.error('Failed to delete hero section');
    } finally {
      // Close the delete confirmation modal
      setIsDeleteModalOpen(false);
      setDeletingHeroId(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setDeletingHeroId(id);
    setIsDeleteModalOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await apiService.patch<HeroSection>(`/hero/${id}/toggle`);
      toast.success('Hero section status updated!');
      fetchHeroSections();
    } catch (error) {
      console.error('Error toggling hero section status:', error);
      toast.error('Failed to update hero section status');
    }
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className={` p-6 text-lg`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black italic">Hero Section</h1>
            <p className="text-black font-medium">Manage your website's hero section content (only one active at a time)</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={openModal}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              {heroSections.length === 0 ? 'Create Hero Section' : 'Edit Hero Section'}
            </button>
            {heroSections.length > 0 && (
              <button
                onClick={() => openDeleteModal(heroSections[0].id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Hero Section
              </button>
            )}
          </div>
        </div>

        {/* Hero Sections List */}
        <div className="bg-white rounded-lg shadow text-center">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading hero sections...</p>
            </div>
          ) : heroSections.length === 0 ? (
            <div className="p-8 text-center text-black flex items-center justify-center">
              <p>No hero section found. Create your hero section to get started.</p>
            </div>
          ) : (
            <div className="space-y-4 mt-20 py-10">
              {heroSections.map((hero) => (
                <div key={hero.id} className="bg-white  p-4 flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    {hero.imageUrl ? (
                      <img
                        src={`http://localhost:5000${hero.imageUrl}`}
                        alt="Hero"
                        className="w-full h-36 md:h-32 object-cover rounded border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-36 md:h-32 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-black">
                        {stripHtmlTags(hero.heading).length > 120 ? `${stripHtmlTags(hero.heading).substring(0, 120)}...` : stripHtmlTags(hero.heading)}
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${hero.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {hero.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-black text-lg">
                      {hero.subHeading ? (hero.subHeading.length > 100 ? `${hero.subHeading.substring(0, 100)}...` : hero.subHeading) : '-'}
                    </div>
                    <div className="text-black text-lg font-semibold">
                      {hero.ctaTitle ? `${hero.ctaTitle} →` : '-'}
                    </div>
                   
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">
                  {editingHero ? 'Edit Hero Section' : 'Create Hero Section'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Heading */}
                <div>
                  <label className="block text-xl font-medium text-black mb-2">
                    Heading * <span className="text-red-500">(Required)</span>
                  </label>
                  <RichTextEditor
                    value={heroForm.heading}
                    onChange={(value) => handleFormChange('heading', value)}
                    height="160px"
                  />
                  {!hasHeadingContent() && (
                    <p className="text-xs text-red-500 mt-1">Please enter a heading for your hero section</p>
                  )}
                </div>

                {/* Sub-heading */}
                <div>
                  <label className="block text-xl font-medium text-black mb-2">
                    Sub-heading
                  </label>
                    <input
                      type="text"
                      value={heroForm.subHeading}
                      onChange={(e) => handleFormChange('subHeading', e.target.value)}
                      placeholder="Enter sub-heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder-black"
                    />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xl font-medium text-black mb-2">
                    Description
                  </label>
                  <RichTextEditor
                    value={heroForm.description}
                    onChange={(value) => handleFormChange('description', value)}
                    height="280px"
                  />
                </div>

                {/* CTA Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xl font-medium text-black mb-2">
                      CTA Title
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaTitle}
                      onChange={(e) => handleFormChange('ctaTitle', e.target.value)}
                      placeholder="e.g., Shop Now, Learn More"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-medium text-black mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaLink}
                      onChange={(e) => handleFormChange('ctaLink', e.target.value)}
                      placeholder="/products or /about (single path only)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a single path like /products or /about</p>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xl font-medium text-black mb-2">
                    Hero Image
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                  />
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full object-contain rounded-lg border border-gray-300"
                          style={{ height: 'auto', maxHeight: '400px' }}
                          onError={(e) => {
                            console.log('Preview image failed to load:', previewImage);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="w-full bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 text-sm hidden">
                          Failed to load image
                        </div>
                        <div className="mt-3">
                          <button onClick={openCropper} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
                            Crop Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-black mt-1">Upload an image for your hero section (JPG, PNG, GIF - Max 5MB)</p>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={heroForm.isActive}
                    onChange={(e) => handleFormChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-xl text-black">
                    Active (visible on website - only one hero can be active at a time)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!hasHeadingContent() || isSubmitting}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingHero ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingHero ? 'Update Hero Section' : 'Create Hero Section'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Confirm Deletion</h2>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingHeroId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <p className="text-black">
                  Are you sure you want to delete this hero section? This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingHeroId(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deletingHeroId) {
                      handleDelete(deletingHeroId);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isCropping && (
        <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Crop Image</h3>
                <button
                  onClick={() => {
                    setIsCropping(false);
                    setCroppingImageUrl('');
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col items-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={16 / 9}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    ref={imgRef}
                    src={croppingImageUrl}
                    alt="Crop preview"
                    className="max-h-[60vh]"
                    onLoad={() => {
                      const img = imgRef.current as HTMLImageElement | null;
                      if (img) {
                        const { width, height } = img;
                        const cropInit = centerCrop(
                          makeAspectCrop(
                            { unit: '%', width: 90, height: 90 },
                            16 / 9,
                            width,
                            height
                          ),
                          width,
                          height
                        );
                        setCrop(cropInit);
                      }
                    }}
                  />
                </ReactCrop>
                <div className="mt-4 flex space-x-2 sticky bottom-0 bg-white py-3">
                  <button
                    onClick={applyCrop}
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    Apply Crop
                  </button>
                  <button
                    onClick={() => {
                      setIsCropping(false);
                      setCroppingImageUrl('');
                      setCrop(undefined);
                      setCompletedCrop(undefined);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
