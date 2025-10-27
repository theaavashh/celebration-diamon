export interface DiamondCertification {
  id: string;
  title: string;
  description: string;
  fullContent?: string | null;
  ctaText: string;
  ctaLink?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RingCustomization {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string | null;
  processImageUrl?: string | null;
  example1Title?: string | null;
  example1Desc?: string | null;
  example1ImageUrl?: string | null;
  example2Title?: string | null;
  example2Desc?: string | null;
  example2ImageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

