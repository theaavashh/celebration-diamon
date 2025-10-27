'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

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

const PopupModal = () => {
  const [popupImage, setPopupImage] = useState<PopupImage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if popup has been shown before in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
    if (hasSeenPopup) {
      setIsLoading(false);
      return;
    }

    // Fetch active popup image
    const fetchPopupImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/popup/active');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPopupImage(data.data);
            setIsVisible(true);
            // Mark that user has seen the popup in this session
            sessionStorage.setItem('hasSeenPopup', 'true');
          }
        }
      } catch (error) {
        console.error('Error fetching popup image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopupImage();
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  const getImageUrl = (filePath: string) => {
    // Convert file path to URL for display
    // Extract just the relative path from the full file path
    const relativePath = filePath.split('uploads/')[1];
    return `http://localhost:5000/uploads/${relativePath}`;
  };

  if (isLoading || !isVisible || !popupImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative max-w-2xl max-h-[90vh] w-full mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Image */}
        <div className="relative w-full h-auto">
          <Image
            src={getImageUrl(popupImage.filePath)}
            alt={popupImage.originalName}
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Optional: Add a close button at the bottom */}
        <div className="p-4 bg-gray-50 border-t">
          <button
            onClick={closePopup}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
