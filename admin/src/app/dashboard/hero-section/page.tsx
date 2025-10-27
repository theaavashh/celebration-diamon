'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { apiService } from '@/lib/apiClient';

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

  // Fetch hero sections
  const fetchHeroSections = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<HeroSection[]>('/api/hero/admin/all');
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

  // Handle create/edit hero section
  const handleSubmit = async () => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('heading', heroForm.heading);
      formData.append('subHeading', heroForm.subHeading);
      formData.append('description', heroForm.description);
      formData.append('ctaTitle', heroForm.ctaTitle);
      formData.append('ctaLink', heroForm.ctaLink);
      formData.append('isActive', heroForm.isActive.toString());
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      if (editingHero) {
        await apiService.put<HeroSection>(`/api/hero/${editingHero.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Hero section updated successfully!');
      } else {
        await apiService.post<HeroSection>('/api/hero', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Hero section created successfully!');
      }
      
      fetchHeroSections();
      setIsModalOpen(false);
      setEditingHero(null);
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Failed to save hero section');
    }
  };

  // Handle delete hero section
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      await apiService.delete(`/api/hero/${id}`);
      toast.success('Hero section deleted successfully!');
      fetchHeroSections();
    } catch (error) {
      console.error('Error deleting hero section:', error);
      toast.error('Failed to delete hero section');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      await apiService.patch<HeroSection>(`/api/hero/${id}/toggle`);
      toast.success('Hero section status updated!');
      fetchHeroSections();
    } catch (error) {
      console.error('Error toggling hero section status:', error);
      toast.error('Failed to update hero section status');
    }
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Hero Section</h1>
            <p className="text-black">Manage your website's hero section content (only one active at a time)</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {heroSections.length === 0 ? 'Create Hero Section' : 'Edit Hero Section'}
            </button>
            {heroSections.length > 0 && (
              <button
                onClick={() => handleDelete(heroSections[0].id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Hero Section
              </button>
            )}
          </div>
        </div>

        {/* Hero Sections List */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading hero sections...</p>
            </div>
          ) : heroSections.length === 0 ? (
            <div className="p-8 text-center text-black">
              <p>No hero section found. Create your hero section to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-heading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {heroSections.map((hero) => (
                    <tr key={hero.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {hero.heading.length > 50 ? `${hero.heading.substring(0, 50)}...` : hero.heading}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {hero.subHeading ? (hero.subHeading.length > 30 ? `${hero.subHeading.substring(0, 30)}...` : hero.subHeading) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {hero.ctaTitle ? `${hero.ctaTitle} →` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hero.imageUrl ? (
                          <img
                            src={`http://localhost:5000${hero.imageUrl}`}
                            alt="Hero"
                            className="w-16 h-12 object-cover rounded border border-gray-300"
                            onError={(e) => {
                              console.log('Hero image failed to load:', hero.imageUrl);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-12 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs ${hero.imageUrl ? 'hidden' : ''}`}>
                          {hero.imageUrl ? 'Failed to load' : 'No image'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          hero.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hero.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(hero.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
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
                  <label className="block text-sm font-medium text-black mb-2">
                    Heading *
                  </label>
                  <RichTextEditor
                    value={heroForm.heading}
                    onChange={(value) => handleFormChange('heading', value)}
                    placeholder="Enter the main hero heading"
                    className="border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Sub-heading */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sub-heading
                  </label>
                    <input
                      type="text"
                      value={heroForm.subHeading}
                      onChange={(e) => handleFormChange('subHeading', e.target.value)}
                      placeholder="Enter sub-heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <RichTextEditor
                    value={heroForm.description}
                    onChange={(value) => handleFormChange('description', value)}
                    placeholder="Enter hero description"
                    className="border border-gray-300 rounded-lg"
                  />
                </div>

                {/* CTA Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      CTA Title
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaTitle}
                      onChange={(e) => handleFormChange('ctaTitle', e.target.value)}
                      placeholder="e.g., Shop Now, Learn More"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={heroForm.ctaLink}
                      onChange={(e) => handleFormChange('ctaLink', e.target.value)}
                      placeholder="/products, /about, /contact, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-black"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Hero Image
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            console.log('Preview image failed to load:', previewImage);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 text-sm hidden">
                          Failed to load image
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-black">
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
                  disabled={!heroForm.heading.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {editingHero ? 'Update Hero Section' : 'Create Hero Section'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
