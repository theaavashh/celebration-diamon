'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { apiService } from '@/lib/apiClient';

interface AboutUsData {
  id?: string;
  heroTitle: string;
  heroSubtitle?: string;
  storyTitle: string;
  storyContent: string;
  storyImageUrl?: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  values?: Array<{ title: string; description: string; icon: string }>;
  whyChooseUs?: Array<{ title: string; description: string; icon: string }>;
  milestones?: Array<{ year: string; event: string }>;
  contactLocation?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  email?: string;
  linkedin?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AboutUsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'team'>('content');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  
  const [aboutUsData, setAboutUsData] = useState<AboutUsData>({
    heroTitle: '',
    heroSubtitle: '',
    storyTitle: '',
    storyContent: '',
    storyImageUrl: '',
    missionTitle: '',
    missionContent: '',
    visionTitle: '',
    visionContent: '',
    values: [],
    whyChooseUs: [],
    milestones: [],
    contactLocation: '',
    contactPhone: '',
    contactEmail: '',
    isActive: true
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    linkedin: '',
    sortOrder: 0,
    isActive: true
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTeamImage, setSelectedTeamImage] = useState<File | null>(null);
  const [previewTeamImage, setPreviewTeamImage] = useState<string | null>(null);

  // Fetch About Us data
  const fetchAboutUs = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/about-us/admin`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data?.aboutUs) {
          setAboutUsData({
            ...result.data.aboutUs,
            values: result.data.aboutUs.values || [],
            whyChooseUs: result.data.aboutUs.whyChooseUs || [],
            milestones: result.data.aboutUs.milestones || []
          });
        }
        if (result.data?.teamMembers) {
          setTeamMembers(result.data.teamMembers);
        }
      }
    } catch (error) {
      console.error('Error fetching About Us:', error);
      toast.error('Failed to fetch About Us data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  // Handle form changes
  const handleChange = (field: keyof AboutUsData, value: any) => {
    setAboutUsData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamFormChange = (field: string, value: any) => {
    setTeamForm(prev => ({ ...prev, [field]: value }));
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

  const handleTeamImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedTeamImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewTeamImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save About Us content
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const formData = new FormData();
      
      formData.append('heroTitle', aboutUsData.heroTitle);
      formData.append('heroSubtitle', aboutUsData.heroSubtitle || '');
      formData.append('storyTitle', aboutUsData.storyTitle);
      formData.append('storyContent', aboutUsData.storyContent);
      if (aboutUsData.storyImageUrl && !selectedImage) {
        formData.append('storyImageUrl', aboutUsData.storyImageUrl);
      }
      formData.append('missionTitle', aboutUsData.missionTitle);
      formData.append('missionContent', aboutUsData.missionContent);
      formData.append('visionTitle', aboutUsData.visionTitle);
      formData.append('visionContent', aboutUsData.visionContent);
      formData.append('values', JSON.stringify(aboutUsData.values || []));
      formData.append('whyChooseUs', JSON.stringify(aboutUsData.whyChooseUs || []));
      formData.append('milestones', JSON.stringify(aboutUsData.milestones || []));
      formData.append('contactLocation', aboutUsData.contactLocation || '');
      formData.append('contactPhone', aboutUsData.contactPhone || '');
      formData.append('contactEmail', aboutUsData.contactEmail || '');
      formData.append('isActive', aboutUsData.isActive.toString());
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/about-us/admin`, {
        method: aboutUsData.id ? 'PUT' : 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        toast.success('About Us content saved successfully!');
        setSelectedImage(null);
        setPreviewImage(null);
        fetchAboutUs();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save About Us content');
      }
    } catch (error) {
      console.error('Error saving About Us:', error);
      toast.error('Failed to save About Us content');
    } finally {
      setIsSaving(false);
    }
  };

  // Team member functions
  const openTeamModal = (member?: TeamMember) => {
    if (member) {
      setEditingTeamMember(member);
      setTeamForm({
        name: member.name,
        role: member.role,
        bio: member.bio,
        email: member.email || '',
        linkedin: member.linkedin || '',
        sortOrder: member.sortOrder,
        isActive: member.isActive
      });
      setPreviewTeamImage(member.imageUrl ? `http://localhost:5000${member.imageUrl}` : null);
    } else {
      setEditingTeamMember(null);
      setTeamForm({
        name: '',
        role: '',
        bio: '',
        email: '',
        linkedin: '',
        sortOrder: teamMembers.length,
        isActive: true
      });
      setPreviewTeamImage(null);
    }
    setSelectedTeamImage(null);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const formData = new FormData();
      
      formData.append('name', teamForm.name);
      formData.append('role', teamForm.role);
      formData.append('bio', teamForm.bio);
      formData.append('email', teamForm.email);
      formData.append('linkedin', teamForm.linkedin);
      formData.append('sortOrder', teamForm.sortOrder.toString());
      formData.append('isActive', teamForm.isActive.toString());
      
      if (editingTeamMember?.imageUrl && !selectedTeamImage) {
        formData.append('imageUrl', editingTeamMember.imageUrl);
      }
      
      if (selectedTeamImage) {
        formData.append('image', selectedTeamImage);
      }

      const url = editingTeamMember 
        ? `${API_BASE_URL}/api/about-us/admin/team/${editingTeamMember.id}`
        : `${API_BASE_URL}/api/about-us/admin/team`;
      
      const response = await fetch(url, {
        method: editingTeamMember ? 'PUT' : 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        toast.success(editingTeamMember ? 'Team member updated!' : 'Team member created!');
        setIsTeamModalOpen(false);
        setSelectedTeamImage(null);
        setPreviewTeamImage(null);
        fetchAboutUs();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/about-us/admin/team/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Team member deleted!');
        fetchAboutUs();
      } else {
        toast.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleToggleTeamStatus = async (id: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/about-us/admin/team/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Team member status updated!');
        fetchAboutUs();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  // Add/Remove array items
  const addValue = () => {
    setAboutUsData(prev => ({
      ...prev,
      values: [...(prev.values || []), { title: '', description: '', icon: '' }]
    }));
  };

  const removeValue = (index: number) => {
    setAboutUsData(prev => ({
      ...prev,
      values: prev.values?.filter((_, i) => i !== index) || []
    }));
  };

  const updateValue = (index: number, field: string, value: string) => {
    setAboutUsData(prev => ({
      ...prev,
      values: prev.values?.map((v, i) => i === index ? { ...v, [field]: value } : v) || []
    }));
  };

  const addWhyChooseUs = () => {
    setAboutUsData(prev => ({
      ...prev,
      whyChooseUs: [...(prev.whyChooseUs || []), { title: '', description: '', icon: '' }]
    }));
  };

  const removeWhyChooseUs = (index: number) => {
    setAboutUsData(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs?.filter((_, i) => i !== index) || []
    }));
  };

  const updateWhyChooseUs = (index: number, field: string, value: string) => {
    setAboutUsData(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs?.map((v, i) => i === index ? { ...v, [field]: value } : v) || []
    }));
  };

  const addMilestone = () => {
    setAboutUsData(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), { year: '', event: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    setAboutUsData(prev => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index) || []
    }));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setAboutUsData(prev => ({
      ...prev,
      milestones: prev.milestones?.map((v, i) => i === index ? { ...v, [field]: value } : v) || []
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout showBreadcrumb={true}>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">About Us Management</h1>
            <p className="text-black">Manage your About Us page content</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'team'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Team Members ({teamMembers.length})
            </button>
          </div>
        </div>

        {activeTab === 'content' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-black mb-4">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Hero Title *</label>
                  <input
                    type="text"
                    value={aboutUsData.heroTitle}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="About Celebration Diamond"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={aboutUsData.heroSubtitle || ''}
                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Nepal's First and Finest Diamond Studio"
                  />
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-black mb-4">Our Story</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Story Title *</label>
                  <input
                    type="text"
                    value={aboutUsData.storyTitle}
                    onChange={(e) => handleChange('storyTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Story Content *</label>
                  <RichTextEditor
                    value={aboutUsData.storyContent}
                    onChange={(value) => handleChange('storyContent', value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Story Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="mt-2 w-48 h-48 object-cover rounded-lg" />
                  )}
                  {aboutUsData.storyImageUrl && !previewImage && (
                    <img
                      src={`http://localhost:5000${aboutUsData.storyImageUrl}`}
                      alt="Current"
                      className="mt-2 w-48 h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-black mb-4">Mission</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Mission Title *</label>
                    <input
                      type="text"
                      value={aboutUsData.missionTitle}
                      onChange={(e) => handleChange('missionTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Mission Content *</label>
                    <RichTextEditor
                      value={aboutUsData.missionContent}
                      onChange={(value) => handleChange('missionContent', value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-black mb-4">Vision</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Vision Title *</label>
                    <input
                      type="text"
                      value={aboutUsData.visionTitle}
                      onChange={(e) => handleChange('visionTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Vision Content *</label>
                    <RichTextEditor
                      value={aboutUsData.visionContent}
                      onChange={(value) => handleChange('visionContent', value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Our Values</h2>
                <button
                  onClick={addValue}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  + Add Value
                </button>
              </div>
              <div className="space-y-4">
                {aboutUsData.values?.map((value, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-600">Value {index + 1}</span>
                      <button
                        onClick={() => removeValue(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                      <input
                        type="text"
                        placeholder="Icon (emoji or text)"
                        value={value.icon}
                        onChange={(e) => updateValue(index, 'icon', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Why Choose Us</h2>
                <button
                  onClick={addWhyChooseUs}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-4">
                {aboutUsData.whyChooseUs?.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                      <button
                        onClick={() => removeWhyChooseUs(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => updateWhyChooseUs(index, 'title', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                      <input
                        type="text"
                        placeholder="Icon"
                        value={item.icon}
                        onChange={(e) => updateWhyChooseUs(index, 'icon', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateWhyChooseUs(index, 'description', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Milestones</h2>
                <button
                  onClick={addMilestone}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  + Add Milestone
                </button>
              </div>
              <div className="space-y-4">
                {aboutUsData.milestones?.map((milestone, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-600">Milestone {index + 1}</span>
                      <button
                        onClick={() => removeMilestone(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Year"
                        value={milestone.year}
                        onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                      <input
                        type="text"
                        placeholder="Event"
                        value={milestone.event}
                        onChange={(e) => updateMilestone(index, 'event', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-black mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Location</label>
                  <input
                    type="text"
                    value={aboutUsData.contactLocation || ''}
                    onChange={(e) => handleChange('contactLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Kathmandu, Nepal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone</label>
                  <input
                    type="text"
                    value={aboutUsData.contactPhone || ''}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="+977-1-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    value={aboutUsData.contactEmail || ''}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="info@celebrationdiamond.com"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => openTeamModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Team Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow p-6">
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    {member.imageUrl ? (
                      <img
                        src={`http://localhost:5000${member.imageUrl}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openTeamModal(member)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleTeamStatus(member.id)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                        member.isActive
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {member.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Member Modal */}
        {isTeamModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <button
                  onClick={() => setIsTeamModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Name *</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => handleTeamFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Role *</label>
                  <input
                    type="text"
                    value={teamForm.role}
                    onChange={(e) => handleTeamFormChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Bio *</label>
                  <textarea
                    value={teamForm.bio}
                    onChange={(e) => handleTeamFormChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    value={teamForm.email}
                    onChange={(e) => handleTeamFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={teamForm.linkedin}
                    onChange={(e) => handleTeamFormChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeamImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {previewTeamImage && (
                    <img src={previewTeamImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={teamForm.sortOrder}
                      onChange={(e) => handleTeamFormChange('sortOrder', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={teamForm.isActive}
                      onChange={(e) => handleTeamFormChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-black">Active</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTeamMember}
                  disabled={!teamForm.name || !teamForm.role || !teamForm.bio}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {editingTeamMember ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
