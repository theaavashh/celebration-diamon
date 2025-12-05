'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { apiPost, apiPut, apiDelete, apiPostFormData, apiPutFormData } from '@/lib/apiClient';
import { 
  Search, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Calendar, 
  ChevronDown, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Upload, 
  X
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  iconUrl: string | null;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    title: '',
    link: '',
    isActive: true
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    categoryId: '',
    isActive: true,
    sortOrder: 0
  });
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);
  const [isDeleteSubcategoryModalOpen, setIsDeleteSubcategoryModalOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [tempSubcategories, setTempSubcategories] = useState<Array<{name: string, isActive: boolean, sortOrder: number}>>([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Handle adding a temporary subcategory by name
  const handleAddTempSubcategoryByName = (name: string) => {
    const newSubcategory = {
      name: name,
      isActive: true,
      sortOrder: tempSubcategories.length
    };
    setTempSubcategories([...tempSubcategories, newSubcategory]);
  };

  // Fetch categories with subcategories in a single API call
  const fetchCategoriesWithSubcategories = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      // Single API call to fetch categories with their subcategories
      const response = await fetch(`${API_BASE_URL}/api/categories/admin/with-subcategories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      } else {
        toast.error('Failed to fetch categories and subcategories');
      }
    } catch (error) {
      console.error('Error fetching categories and subcategories:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesWithSubcategories();
  }, []);

  // Handle form changes
  const handleCategoryFormChange = (field: string, value: any) => {
    setCategoryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubcategoryFormChange = (field: string, value: any) => {
    setSubcategoryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection for icon
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedIcon(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image selection for image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  // Handle removing a temporary subcategory
  const handleRemoveTempSubcategory = (index: number) => {
    setTempSubcategories(tempSubcategories.filter((_, i) => i !== index));
  };

  // Handle changing a temporary subcategory
  const handleChangeTempSubcategory = (index: number, field: string, value: any) => {
    const updatedSubcategories = [...tempSubcategories];
    updatedSubcategories[index] = {
      ...updatedSubcategories[index],
      [field]: value
    };
    setTempSubcategories(updatedSubcategories);
  };

  // Validate temporary subcategories before saving
  const validateTempSubcategories = () => {
    for (let i = 0; i < tempSubcategories.length; i++) {
      const subcategory = tempSubcategories[i];
      if (!subcategory.name.trim()) {
        toast.error(`Please enter a name for subcategory #${i + 1}`);
        return false;
      }
    }
    return true;
  };

  // Reset temp subcategories when modal closes
  const resetTempSubcategories = () => {
    setTempSubcategories([]);
  };

  // Reset form when modal opens
  const openCategoryModal = () => {
    setCategoryForm({
      title: '',
      link: '',
      isActive: true
    });
    setSelectedIcon(null);
    setSelectedImage(null);
    setIconPreview(null);
    setImagePreview(null);
    setEditingCategory(null);
    resetTempSubcategories();
    setIsModalOpen(true);
  };

  const openSubcategoryModal = (categoryId?: string) => {
    setSubcategoryForm({
      name: '',
      categoryId: categoryId || '',
      isActive: true,
      sortOrder: 0
    });
    setEditingSubcategory(null);
    setIsSubcategoryModalOpen(true);
  };

  // Open edit modal with category data
  const openEditCategoryModal = (category: Category) => {
    setCategoryForm({
      title: category.title || '',
      link: category.link || '',
      isActive: category.isActive
    });
    setSelectedIcon(null);
    setSelectedImage(null);
    // Fix image preview for edit mode
    if (category.iconUrl) {
      // If it's already a full URL, use it directly
      if (category.iconUrl.startsWith('http')) {
        setIconPreview(category.iconUrl);
      } else {
        // Otherwise construct the full URL
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        // Ensure the path starts with /
        const imagePath = category.iconUrl.startsWith('/') ? category.iconUrl : `/${category.iconUrl}`;
        setIconPreview(`${API_BASE_URL}${imagePath}`);
      }
    } else {
      setIconPreview(null);
    }
    
    if (category.imageUrl) {
      // If it's already a full URL, use it directly
      if (category.imageUrl.startsWith('http')) {
        setImagePreview(category.imageUrl);
      } else {
        // Otherwise construct the full URL
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        // Ensure the path starts with /
        const imagePath = category.imageUrl.startsWith('/') ? category.imageUrl : `/${category.imageUrl}`;
        setImagePreview(`${API_BASE_URL}${imagePath}`);
      }
    } else {
      setImagePreview(null);
    }
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Open edit modal with subcategory data
  const openEditSubcategoryModal = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive,
      sortOrder: subcategory.sortOrder
    });
    setIsSubcategoryModalOpen(true);
  };

  // Handle create/edit category
  const handleCategorySubmit = async () => {
    // Validate category title
    if (!categoryForm.title.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    // Validate temporary subcategories if creating a new category
    if (!editingCategory && tempSubcategories.length > 0) {
      if (!validateTempSubcategories()) {
        return;
      }
    }
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const apiUrl = `${API_BASE_URL}/api/categories`;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', categoryForm.title);
      formData.append('link', categoryForm.link);
      formData.append('isActive', categoryForm.isActive.toString());
      
      // Handle icon upload
      if (selectedIcon) {
        formData.append('icon', selectedIcon);
      } else if (editingCategory && editingCategory.iconUrl) {
        formData.append('iconUrl', editingCategory.iconUrl);
      }
      
      // Handle image upload
      if (selectedImage) {
        formData.append('image', selectedImage);
      } else if (editingCategory && editingCategory.imageUrl) {
        formData.append('imageUrl', editingCategory.imageUrl);
      }
      
      // Use the appropriate apiClient function based on whether we're editing or creating
      const response = editingCategory 
        ? await apiPutFormData(`${apiUrl}/${editingCategory.id}`, formData)
        : await apiPostFormData(apiUrl, formData);

      if (response.success) {
        const categoryId = (response.data as { id: string }).id;
        
        // If we have temporary subcategories, create them now
        if (!editingCategory && tempSubcategories.length > 0) {
          // Use apiPost for subcategory creation since it's JSON data
          for (const subcategory of tempSubcategories) {
            if (subcategory.name.trim()) {
              try {
                await apiPost(`${API_BASE_URL}/api/subcategories`, {
                  name: subcategory.name,
                  categoryId: categoryId,
                  isActive: subcategory.isActive,
                  sortOrder: subcategory.sortOrder
                });
              } catch (error) {
                console.error('Error creating subcategory:', error);
              }
            }
          }
        }
        
        toast.success(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        fetchCategoriesWithSubcategories();
        setIsModalOpen(false);
        setEditingCategory(null);
        resetTempSubcategories();
        // Reset file states
        setSelectedIcon(null);
        setSelectedImage(null);
        setIconPreview(null);
        setImagePreview(null);
      } else {
        toast.error(response.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  // Handle create/edit subcategory
  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const url = editingSubcategory 
        ? `${API_BASE_URL}/api/subcategories/${editingSubcategory.id}` 
        : `${API_BASE_URL}/api/subcategories`;
      
      // Use apiPut or apiPost based on whether we're editing or creating
      const response = editingSubcategory 
        ? await apiPut(url, subcategoryForm)
        : await apiPost(url, subcategoryForm);
      
      if (response.success) {
        toast.success(editingSubcategory ? 'Subcategory updated successfully!' : 'Subcategory created successfully!');
        fetchCategoriesWithSubcategories();
        setIsSubcategoryModalOpen(false);
        setEditingSubcategory(null);
      } else {
        toast.error(response.message || 'Failed to save subcategory');
      }
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error('Failed to save subcategory');
    }
  };

  // Open delete confirmation modal for category
  const openDeleteCategoryModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Open delete confirmation modal for subcategory
  const openDeleteSubcategoryModal = (subcategory: Subcategory) => {
    setSubcategoryToDelete(subcategory);
    setIsDeleteSubcategoryModalOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      const response = await apiDelete(`${API_BASE_URL}/api/categories/${categoryToDelete.id}`);
      
      if (response.success) {
        toast.success('Category deleted successfully!');
        fetchCategoriesWithSubcategories();
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Handle delete subcategory
  const handleDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      const response = await apiDelete(`${API_BASE_URL}/api/subcategories/${subcategoryToDelete.id}`);
      
      if (response.success) {
        toast.success('Subcategory deleted successfully!');
        fetchCategoriesWithSubcategories();
      } else {
        toast.error(response.message || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    } finally {
      setIsDeleteSubcategoryModalOpen(false);
      setSubcategoryToDelete(null);
    }
  };

  // Handle toggle status for category
  const handleToggleCategoryStatus = async (id: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      // For PATCH requests, we'll use fetch directly since apiClient doesn't have a patch function
      // But we'll still use the CSRF token handling
      const csrfResponse = await fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      let csrfToken = null;
      if (csrfResponse.ok) {
        const csrfResult = await csrfResponse.json();
        if (csrfResult.success && csrfResult.data?.csrfToken) {
          csrfToken = csrfResult.data.csrfToken;
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'x-csrf-token': csrfToken }), // Add CSRF token if available
        },
      });

      if (response.ok) {
        toast.success('Category status updated!');
        fetchCategoriesWithSubcategories();
      } else {
        toast.error('Failed to update category status');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Failed to update category status');
    }
  };

  // Handle toggle status for subcategory
  const handleToggleSubcategoryStatus = async (id: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      // For PATCH requests, we'll use fetch directly since apiClient doesn't have a patch function
      // But we'll still use the CSRF token handling
      const csrfResponse = await fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      let csrfToken = null;
      if (csrfResponse.ok) {
        const csrfResult = await csrfResponse.json();
        if (csrfResult.success && csrfResult.data?.csrfToken) {
          csrfToken = csrfResult.data.csrfToken;
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/api/subcategories/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'x-csrf-token': csrfToken }), // Add CSRF token if available
        },
      });

      if (response.ok) {
        toast.success('Subcategory status updated!');
        fetchCategoriesWithSubcategories();
      } else {
        toast.error('Failed to update subcategory status');
      }
    } catch (error) {
      console.error('Error toggling subcategory status:', error);
      toast.error('Failed to update subcategory status');
    }
  };

  // Toggle expanded category to show/hide subcategories
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <DashboardLayout showBreadcrumb={true}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Category Management</h1>
            <p className="text-black">Manage your main product categories and subcategories</p>
          </div>
          <button
            onClick={openCategoryModal}
            className="bg-[#b29168] text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black placeholder-black"
            />
          </div>
        </div>

        {/* Categories List */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-black">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-black">
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-4">Create your first category to get started</p>
              <button
                onClick={openCategoryModal}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Category
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => {
              const isExpanded = expandedCategory === category.id;
              
              return (
                <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Category Header - Name, Icon, Image */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Category Icon/Image */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl?.startsWith('http') ? category.imageUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${category.imageUrl.startsWith('/') ? category.imageUrl : `/${category.imageUrl}`}`}
                              alt={category.title}
                              className="w-full h-full object-cover"
                              onLoad={() => console.log('Image loaded successfully:', category.imageUrl)}
                              onError={(e) => {
                                console.error('Image failed to load:', category.imageUrl);
                                // Show placeholder on error
                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Category Info */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {category.title}
                          </h3>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="truncate">{category.link || 'No link'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Category Actions */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleCategoryExpansion(category.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Category Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openSubcategoryModal(category.id)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Subcategory
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditCategoryModal(category)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleCategoryStatus(category.id)}
                          className={`text-sm font-medium transition-colors flex items-center ${
                            category.isActive
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {category.isActive ? (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => openDeleteCategoryModal(category)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subcategories Section - Moved to bottom */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Subcategories ({category.subcategories?.length || 0})</h4>
                        </div>
                        
                        {category.subcategories && category.subcategories.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No subcategories yet</p>
                            <button
                              onClick={() => openSubcategoryModal(category.id)}
                              className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              + Add First Subcategory
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {category.subcategories?.map((subcategory) => (
                              <div key={subcategory.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                <span className="text-black text-sm font-medium">{subcategory.name}</span>
                                <div className="ml-2 flex items-center space-x-1">
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    subcategory.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {subcategory.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                  <button
                                    onClick={() => openEditSubcategoryModal(subcategory)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => openDeleteSubcategoryModal(subcategory)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Category Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Details Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Category Details</h3>
                  
                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.title}
                      onChange={(e) => handleCategoryFormChange('title', e.target.value)}
                      placeholder="Enter category name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black"
                    />
                  </div>

                  {/* Link */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-2">
                      Internal Link *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.link}
                      onChange={(e) => handleCategoryFormChange('link', e.target.value)}
                      placeholder="Enter the redirector url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-black"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required. Enter a relative path (e.g., /foods) or full URL for internal navigation.</p>
                  </div>

                  {/* Icon Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-2">
                      Category Icon *
                    </label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Click to upload category icon</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleIconChange}
                            className="hidden"
                            id="icon-upload"
                          />
                          <label
                            htmlFor="icon-upload"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Icon
                          </label>
                        </div>
                      </div>
                      {iconPreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Icon Preview:</p>
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              console.error('Icon preview failed to load:', iconPreview);
                              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Icon';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-2">
                      Category Image
                    </label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Click to upload category image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="category-image-upload"
                          />
                          <label
                            htmlFor="category-image-upload"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center"
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Choose Image
                          </label>
                        </div>
                      </div>
                      {imagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                          <img
                            src={imagePreview}
                            alt="Image Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              console.error('Image preview failed to load:', imagePreview);
                              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        </div>
                      )}
                      {selectedImage && !imagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Selected Image: {selectedImage.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subcategories Section - Moved above Status */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Subcategories</h3>
                        {!editingCategory && tempSubcategories.length > 0 && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({tempSubcategories.filter(s => s.name.trim()).length} added)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          // Focus on the subcategory input field
                          const inputElement = document.querySelector('input[placeholder="Enter subcategory name"]') as HTMLInputElement;
                          if (inputElement) {
                            inputElement.focus();
                          }
                        }}
                        disabled={!categoryForm.title.trim()}
                        className={`text-sm font-medium transition-colors flex items-center ${
                          categoryForm.title.trim() 
                            ? 'text-purple-600 hover:text-purple-700' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Subcategory
                      </button>
                    </div>
                    
                    {/* Instructions for new categories */}
                    {!editingCategory && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> You can add subcategories now and they will be saved when you create the category.
                        </p>
                      </div>
                    )}
                    
                    {/* Display existing subcategories if editing */}
                    {editingCategory && editingCategory.subcategories && editingCategory.subcategories.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                        {editingCategory.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-900">{subcategory.name}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditSubcategoryModal(subcategory)}
                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteSubcategoryModal(subcategory)}
                                className="text-red-600 hover:text-red-700 text-xs flex items-center"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Display temporary subcategories when creating new category */}
                    {!editingCategory && (
                      <div className="mb-4">
                        {/* Input field for adding new subcategories */}
                        <div className="flex mb-3">
                          <input
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            placeholder="Enter subcategory name"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-black placeholder-gray-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newSubcategoryName.trim()) {
                                handleAddTempSubcategoryByName(newSubcategoryName.trim());
                                setNewSubcategoryName('');
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (newSubcategoryName.trim()) {
                                handleAddTempSubcategoryByName(newSubcategoryName.trim());
                                setNewSubcategoryName('');
                              }
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Display added subcategories as chips */}
                        <div className="flex flex-wrap gap-2">
                          {tempSubcategories.map((subcategory, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                              <span className="text-black text-sm font-medium">{subcategory.name}</span>
                              <button
                                onClick={() => handleRemoveTempSubcategory(index)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Message when no subcategories exist */}
                    {editingCategory && (!editingCategory.subcategories || editingCategory.subcategories.length === 0) && (
                      <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm">No subcategories added yet</p>
                        <button
                          onClick={() => openSubcategoryModal(editingCategory.id)}
                          className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          + Add First Subcategory
                        </button>
                      </div>
                    )}
                    
                    {/* Message when creating new category with no temp subcategories */}
                    {!editingCategory && tempSubcategories.length === 0 && (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          No subcategories added yet
                        </p>
                        <button
                          onClick={() => {
                            // Focus on the subcategory input field
                            const inputElement = document.querySelector('input[placeholder="Enter subcategory name"]') as HTMLInputElement;
                            if (inputElement) {
                              inputElement.focus();
                            }
                          }}
                          className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          + Add First Subcategory
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Active Status - Moved below Subcategories */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Status
                    </label>
                    <select
                      value={categoryForm.isActive ? 'active' : 'inactive'}
                      onChange={(e) => handleCategoryFormChange('isActive', e.target.value === 'active')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
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
                  onClick={handleCategorySubmit}
                  disabled={!categoryForm.title.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categoryForm.title.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Modal */}
        {isSubcategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
                  </h2>
                  <button
                    onClick={() => setIsSubcategoryModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubcategorySubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={subcategoryForm.name}
                        onChange={(e) => handleSubcategoryFormChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                        placeholder="Subcategory name"
                        required
                      />
                    </div>
                    
                    {!editingSubcategory && (
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Category *
                        </label>
                        <select
                          value={subcategoryForm.categoryId}
                          onChange={(e) => handleSubcategoryFormChange('categoryId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={subcategoryForm.sortOrder}
                        onChange={(e) => handleSubcategoryFormChange('sortOrder', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subcategoryForm.isActive}
                        onChange={(e) => handleSubcategoryFormChange('isActive', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-black">
                        Active
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsSubcategoryModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {editingSubcategory ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Category Confirmation Modal */}
        {isDeleteModalOpen && categoryToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Confirm Delete</h2>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-black mb-4">
                  Are you sure you want to delete the category "<strong>{categoryToDelete.title}</strong>"?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. All products and subcategories associated with this category may be affected.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Subcategory Confirmation Modal */}
        {isDeleteSubcategoryModalOpen && subcategoryToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Confirm Delete</h2>
                <button
                  onClick={() => setIsDeleteSubcategoryModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-black mb-4">
                  Are you sure you want to delete the subcategory "<strong>{subcategoryToDelete.name}</strong>"?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteSubcategoryModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubcategory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}