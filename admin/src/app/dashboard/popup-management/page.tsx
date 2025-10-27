'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Eye, Edit3, Upload, X, Image as ImageIcon, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/apiClient';

interface PopupImage {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PopupManagementPage() {
  const [popupImages, setPopupImages] = useState<PopupImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 3 columns × 2 rows = 6 items per page
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<PopupImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load popup images on component mount
  useEffect(() => {
    loadPopupImages();
  }, []);

  const loadPopupImages = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<PopupImage[]>('/api/popup/admin/all');
      setPopupImages(response.data || []);
      setCurrentPage(1); // Reset to first page when loading new data
    } catch (error) {
      console.error('Error loading popup images:', error);
      toast.error('Failed to load popup images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiService.post<PopupImage>('/api/popup/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Popup image uploaded successfully!');
      loadPopupImages(); // Reload the list
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const toggleImageStatus = async (id: string, currentStatus: boolean) => {
    try {
      console.log('Toggling image status for ID:', id, 'Current status:', currentStatus);
      console.log('Auth token:', localStorage.getItem('token'));
      
      const response = await apiService.patch<PopupImage>(`/api/popup/${id}/toggle`);
      console.log('Toggle response:', response);
      
      toast.success(`Image ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      loadPopupImages(); // Reload the list
    } catch (error) {
      console.error('Error toggling image status:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to toggle image status');
    }
  };

  const handleDeleteClick = (image: PopupImage) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      await apiService.delete(`/api/popup/${imageToDelete.id}`);
      toast.success('Image deleted successfully!');
      
      // Reload images without resetting pagination
      setIsLoading(true);
      try {
        const response = await apiService.get<PopupImage[]>('/api/popup/admin/all');
        setPopupImages(response.data || []);
        
        // Adjust current page if needed (if we're on a page that no longer exists)
        const totalPages = Math.ceil((response.data || []).length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      } catch (error) {
        console.error('Error loading popup images:', error);
        toast.error('Failed to load popup images');
      } finally {
        setIsLoading(false);
      }
      
      setShowDeleteModal(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageUrl = (filePath: string) => {
    // Convert file path to URL for display
    // Extract just the relative path from the full file path
    const relativePath = filePath.split('uploads/')[1];
    const imageUrl = `http://localhost:5000/uploads/${relativePath}`;
    console.log('Generated image URL:', imageUrl);
    return imageUrl;
  };

  // Pagination calculations
  const totalPages = Math.ceil(popupImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = popupImages.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Popup Management" showBreadcrumb={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Popup Management" showBreadcrumb={true}>
      <div className="space-y-6">

        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-black mb-2">Upload New Popup Image</h2>
            <p className="text-sm text-black">Upload a single image that will be shown to users on their first visit. Only one image can be active at a time.</p>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Upload Popup Image</h3>
            <p className="text-black mb-4">Drag and drop an image here, or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </button>
            <p className="text-xs text-black mt-3">PNG, JPG, GIF up to 5MB • Recommended: 600x400px</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Images List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Popup Images</h2>
          
          {popupImages.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-black">No popup images uploaded yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentImages.map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="relative mb-3">
                    <img
                      src={getImageUrl(image.filePath)}
                      alt={image.originalName}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        image.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-black truncate">{image.originalName}</h3>
                    <p className="text-sm text-black">{formatFileSize(image.fileSize)}</p>
                    <p className="text-xs text-black">
                      Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => toggleImageStatus(image.id, image.isActive)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                          image.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-black hover:bg-gray-200'
                        }`}
                      >
                        {image.isActive ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        <span>{image.isActive ? 'Active' : 'Activate'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(image)}
                        className="flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-black">
                    Showing {startIndex + 1} to {Math.min(endIndex, popupImages.length)} of {popupImages.length} images
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-black bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && imageToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">Delete Image</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-black">
                Are you sure you want to delete the image <strong>"{imageToDelete.originalName}"</strong>?
              </p>
            </div>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
