import React, { useState, useEffect } from 'react';
import { X, Upload, Type, Image as ImageIcon, Layout, Trash2, Palette } from 'lucide-react';

interface HeroSectionData {
  leftContentType: 'image' | 'description';
  rightContentType: 'image' | 'description';
  leftContent: string;
  rightContent: string;
  leftBg: string;
  rightBg: string;
  leftWidth: string; // e.g. "50%"
}

interface HeroSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: HeroSectionData;
  onSave: (data: FormData) => void;
}

export default function HeroSectionModal({ isOpen, onClose, initialData, onSave }: HeroSectionModalProps) {
  const [formData, setFormData] = useState<HeroSectionData>({
    leftContentType: 'image',
    rightContentType: 'description',
    leftContent: '',
    rightContent: '',
    leftBg: '#ffffff',
    rightBg: '#ffffff',
    leftWidth: '50%',
  });

  const [leftImageFile, setLeftImageFile] = useState<File | null>(null);
  const [rightImageFile, setRightImageFile] = useState<File | null>(null);
  
  // Previews
  const [leftImagePreview, setLeftImagePreview] = useState<string | null>(null);
  const [rightImagePreview, setRightImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Set initial previews
      if (initialData.leftContentType === 'image') {
        setLeftImagePreview(initialData.leftContent);
      }
      
      if (initialData.rightContentType === 'image') {
        setRightImagePreview(initialData.rightContent);
      }
    }
  }, [initialData]);

  if (!isOpen) return null;

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${url}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void, setPreview: (s: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('leftContentType', formData.leftContentType);
    data.append('rightContentType', formData.rightContentType);
    data.append('leftContent', formData.leftContent);
    data.append('rightContent', formData.rightContent);
    data.append('leftBg', formData.leftBg);
    data.append('rightBg', formData.rightBg);
    data.append('leftWidth', formData.leftWidth);

    if (leftImageFile) data.append('leftImage', leftImageFile);
    if (rightImageFile) data.append('rightImage', rightImageFile);

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 ">
          <div>
            <h2 className="text-xl font-bold text-gray-900 custom-font">Add Hero Section</h2>
            <p className="text-sm text-black">Configure the left and right split content</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-black hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <form id="hero-form" onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Side Config */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2 pb-2">
                  <div className=" p-2 rounded-lg">
                    <Layout className="w-5 h-5 " />
                  </div>
                  <h3 className="font-semibold text-gray-900 custom-font">Configuration Left</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-md font-medium text-black uppercase  mb-2">Content Type</label>
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, leftContentType: 'image'})}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${formData.leftContentType === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          <ImageIcon className="w-4 h-4" /> Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, leftContentType: 'description'})}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${formData.leftContentType === 'description' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          <Type className="w-4 h-4" /> Text
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-md font-medium text-black uppercase  mb-2">Width</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.leftWidth}
                          onChange={(e) => setFormData({...formData, leftWidth: e.target.value})}
                          className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          placeholder="50%"
                        />
                        <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-sm font-medium">%</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black uppercase  mb-2">
                      {formData.leftContentType === 'image' ? 'Upload Image' : 'Description Content'}
                    </label>
                    
                    {formData.leftContentType === 'image' ? (
                      <div className="space-y-3">
                        {leftImagePreview ? (
                          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <img src={getImageUrl(leftImagePreview)} alt="Preview" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => { setLeftImageFile(null); setLeftImagePreview(null); setFormData({...formData, leftContent: ''}); }}
                                className="bg-white text-red-500 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Remove Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-blue-500" />
                              </div>
                              <p className="mb-1 text-md font-medium text-black">Click to upload image</p>
                              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, setLeftImageFile, setLeftImagePreview)}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={formData.leftContent}
                        onChange={(e) => setFormData({...formData, leftContent: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        rows={6}
                        placeholder="Enter your description text here..."
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black uppercase  mb-2">Background Color</label>
                    <div className="flex gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={formData.leftBg}
                          onChange={(e) => setFormData({...formData, leftBg: e.target.value})}
                          className="h-11 w-11 p-1 rounded-lg border border-gray-200 cursor-pointer bg-white"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <Palette className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.leftBg}
                          onChange={(e) => setFormData({...formData, leftBg: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider for Large Screens */}
              <div className="hidden lg:block w-px bg-gray-200"></div>

              {/* Right Side Config */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2 pb-2">
                  <div className="p-2 rounded-lg">
                    <Layout className="w-5 h-5 " />
                  </div>
                  <h3 className="font-semibold text-black custom-font">Configuration Right</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-md font-medium text-black uppercase mb-2">Content Type</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, rightContentType: 'image'})}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${formData.rightContentType === 'image' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <ImageIcon className="w-4 h-4" /> Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, rightContentType: 'description'})}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${formData.rightContentType === 'description' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <Type className="w-4 h-4" /> Text
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black uppercase mb-2">
                      {formData.rightContentType === 'image' ? 'Upload Image' : 'Description Content'}
                    </label>
                    
                    {formData.rightContentType === 'image' ? (
                      <div className="space-y-3">
                        {rightImagePreview ? (
                          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <img src={getImageUrl(rightImagePreview)} alt="Preview" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => { setRightImageFile(null); setRightImagePreview(null); setFormData({...formData, rightContent: ''}); }}
                                className="bg-white text-red-500 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Remove Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-purple-500" />
                              </div>
                              <p className="mb-1 text-sm font-medium text-gray-700">Click to upload image</p>
                              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, setRightImageFile, setRightImagePreview)}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={formData.rightContent}
                        onChange={(e) => setFormData({...formData, rightContent: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        rows={6}
                        placeholder="Enter your description text here..."
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black uppercase mb-2">Background Color</label>
                    <div className="flex gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={formData.rightBg}
                          onChange={(e) => setFormData({...formData, rightBg: e.target.value})}
                          className="h-11 w-11 p-1 rounded-lg border border-gray-200 cursor-pointer bg-white"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <Palette className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.rightBg}
                          onChange={(e) => setFormData({...formData, rightBg: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="hero-form"
            className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors shadow-lg shadow-black/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}