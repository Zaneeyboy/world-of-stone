export type MaterialType = 'granite' | 'marble' | 'quartz' | 'limestone' | 'travertine' | 'sandstone' | 'slate' | 'other';

export type AvailabilityStatus = 'in_stock' | 'limited' | 'out_of_stock' | 'by_order';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  materialType: MaterialType;
  color: string;
  colorTags: string[];
  price?: number | null; // null = price on inquiry
  priceUnit?: string; // e.g. "per m²"
  images: string[];
  featured: boolean;
  hidden: boolean;
  availability: AvailabilityStatus;
  useCases: string[]; // e.g. ["kitchen", "flooring", "walls"]
  viewCount: number;
  inquiryCount: number;
  rankOrder?: number; // admin-defined ranking
  createdAt: number; // unix timestamp
  updatedAt: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'kitchen' | 'flooring' | 'commercial' | 'bathroom' | 'outdoor' | 'other';
  images: string[];
  beforeImages?: string[];
  featured: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface Promotion {
  id: string;
  title: string;
  message: string;
  active: boolean;
  type: 'banner' | 'badge' | 'popup';
  productIds?: string[]; // affected products, empty = global
  createdAt: number;
  expiresAt?: number;
}

export interface InquiryPayload {
  productId?: string;
  productName?: string;
  productSlug?: string;
  name: string;
  phone: string;
  message: string;
}

export type SortOption = 'newest' | 'most_viewed' | 'price_asc' | 'price_desc' | 'featured';

export interface FilterState {
  materialType: MaterialType | '';
  color: string;
  priceMin: number | '';
  priceMax: number | '';
  availability: AvailabilityStatus | '';
}
