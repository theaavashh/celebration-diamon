'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';

interface Store {
  id: string;
  title: string;
  location: string;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  mediaType: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeForm, setStoreForm] = useState({
    title: '',
    location: '',
    phone: '',
    email: '',
    hours: '',
    latitude: '',
    longitude: '',
    description: '',
    mediaType: 'image',
    videoUrl: '',
    isActive: true,
    sortOrder: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch stores
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores/admin/all`, {
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStores(data.data || []);
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        // Get error details
        const responseText = await response.text();
        let errorData: any = {};
        
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText || `Server error: ${response.status} ${response.statusText}` };
        }
        
        console.error('Failed to fetch stores:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          responseText
        });
        
        toast.error(errorData.message || `Failed to fetch stores: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setStoreForm(prev => ({
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
    setStoreForm({
      title: '',
      location: '',
      phone: '',
      email: '',
      hours: '',
      latitude: '',
      longitude: '',
      description: '',
      mediaType: 'image',
      videoUrl: '',
      isActive: true,
      sortOrder: 0
    });
    setSelectedImage(null);
    setPreviewImage(null);
    setEditingStore(null);
    setIsModalOpen(true);
  };

  // Open edit modal with store data
  const openEditModal = (store: Store) => {
    setStoreForm({
      title: store.title,
      location: store.location,
      phone: store.phone || '',
      email: store.email || '',
      hours: store.hours || '',
      latitude: store.latitude?.toString() || '',
      longitude: store.longitude?.toString() || '',
      description: store.description || '',
      mediaType: store.mediaType || 'image',
      videoUrl: store.videoUrl || '',
      isActive: store.isActive,
      sortOrder: store.sortOrder
    });
    setPreviewImage(store.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${store.imageUrl}` : null);
    setSelectedImage(null);
    setEditingStore(store);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', storeForm.title.trim());
      formData.append('location', storeForm.location.trim());
      
      // Only append optional fields if they have values
      if (storeForm.phone && storeForm.phone.trim()) {
        formData.append('phone', storeForm.phone.trim());
      }
      if (storeForm.email && storeForm.email.trim()) {
        formData.append('email', storeForm.email.trim());
      }
      if (storeForm.hours && storeForm.hours.trim()) {
        formData.append('hours', storeForm.hours.trim());
      }
      if (storeForm.latitude && storeForm.latitude.trim()) {
        formData.append('latitude', storeForm.latitude.trim());
      }
      if (storeForm.longitude && storeForm.longitude.trim()) {
        formData.append('longitude', storeForm.longitude.trim());
      }
      if (storeForm.description && storeForm.description.trim()) {
        formData.append('description', storeForm.description.trim());
      }
      
      formData.append('mediaType', storeForm.mediaType);
      formData.append('isActive', storeForm.isActive ? 'true' : 'false');
      formData.append('sortOrder', storeForm.sortOrder.toString());

      if (storeForm.mediaType === 'video' && storeForm.videoUrl && storeForm.videoUrl.trim()) {
        formData.append('videoUrl', storeForm.videoUrl.trim());
      }

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const url = editingStore
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores/${editingStore.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores`;

      const method = editingStore ? 'PUT' : 'POST';
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });

      if (response.ok) {
        toast.success(editingStore ? 'Store updated successfully' : 'Store created successfully');
        setIsModalOpen(false);
        fetchStores();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        // Try to get response text first to see what we're dealing with
        let responseText = '';
        let errorData: any = {};
        
        try {
          responseText = await response.text();
          console.log('Raw response text:', responseText);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (responseText && responseText.trim()) {
            try {
              errorData = JSON.parse(responseText);
            } catch (e) {
              // If JSON parsing fails, use the text as the error message
              errorData = { message: responseText };
            }
      } else {
            errorData = { message: `Server error: ${response.status} ${response.statusText}` };
          }
        } catch (e) {
          console.error('Error reading response:', e);
          errorData = { message: `Failed to read server response: ${response.status} ${response.statusText}` };
        }
        
        // Handle validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) => err.msg || err.message || err).join(', ');
          toast.error(errorMessages || 'Validation failed');
        } else if (errorData.message) {
          toast.error(errorData.message);
      } else {
          toast.error(`Failed to save store: ${response.status} ${response.statusText}`);
        }
        
        console.error('Store creation/update error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          responseText,
          hasResponseText: !!responseText,
          responseTextLength: responseText?.length || 0
        });
      }
    } catch (error) {
      console.error('Error saving store:', error);
      toast.error('Failed to save store');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        toast.success('Store deleted successfully');
        fetchStores();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error('Failed to delete store');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Failed to delete store');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        fetchStores();
      } else if (response.status === 401) {
        console.error('Authentication failed. Session may be expired or invalid.');
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        toast.error('Failed to toggle store status');
      }
    } catch (error) {
      console.error('Error toggling store status:', error);
      toast.error('Failed to toggle store status');
    }
  };

  // Filter stores
  const filteredStores = stores.filter(store => {
    const searchLower = searchTerm.toLowerCase();
    return (
      store.title.toLowerCase().includes(searchLower) ||
      store.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout title="Store Management" showBackButton={true} showBreadcrumb={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
            <p className="text-gray-600">Manage store locations and media</p>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Store
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Stores List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-500 mb-4">Create your first store to get started.</p>
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Store
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{store.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          store.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {store.mediaType === 'video' ? 'Video' : 'Image'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{store.location}</p>

                      {/* Preview */}
                      <div className="mb-4">
                        {store.mediaType === 'video' && store.videoUrl ? (
                          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <video
                              src={store.videoUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          </div>
                        ) : store.imageUrl ? (
                          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${store.imageUrl}`}
                              alt={store.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">No media</p>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        Sort Order: {store.sortOrder}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(store.id)}
                        className={`p-2 rounded-lg ${
                          store.isActive 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={store.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {store.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(store)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingStore ? 'Edit Store' : 'Create New Store'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={storeForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={storeForm.location}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={storeForm.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="+977-9808080808"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={storeForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="info@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={storeForm.hours}
                      onChange={(e) => handleFormChange('hours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 5:00 PM"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={storeForm.latitude}
                        onChange={(e) => handleFormChange('latitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="27.7172"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={storeForm.longitude}
                        onChange={(e) => handleFormChange('longitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="85.3240"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={storeForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Store description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media Type *
                    </label>
                    <select
                      value={storeForm.mediaType}
                      onChange={(e) => handleFormChange('mediaType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  {storeForm.mediaType === 'image' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {previewImage && (
                        <div className="mt-4">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL *
                      </label>
                      <input
                        type="url"
                        value={storeForm.videoUrl}
                        onChange={(e) => handleFormChange('videoUrl', e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        required={storeForm.mediaType === 'video'}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={storeForm.sortOrder}
                        onChange={(e) => handleFormChange('sortOrder', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={storeForm.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingStore ? 'Update Store' : 'Create Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
