export interface Category {
  id: string;
  title: string;
  iconUrl: string | null;
  imageUrl: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  // Navigation images for product display
  navImage1Url?: string | null;
  navImage2Url?: string | null;
  // Subcategories
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}