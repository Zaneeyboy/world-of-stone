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
  price?: number | null; // null = price on inquiry (kept for backward compat)
  pricePerSqFt?: number | null; // TTD per sq ft
  pricePerSheet?: number | null; // TTD per full slab/sheet
  priceUnit?: string; // e.g. "per m²" (legacy)
  images: string[];
  featured: boolean;
  hidden: boolean;
  availability: AvailabilityStatus;
  useCases: string[]; // e.g. ["kitchen", "flooring", "walls"]
  countryOfOrigin?: string; // e.g. "Italy", "India", "Brazil"
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

// ─── Jobs / Quoting ───────────────────────────────────────────────────────────

export type JobStatus = 'quote' | 'accepted' | 'in_progress' | 'completed' | 'invoiced' | 'paid' | 'cancelled';

export type ServiceType = 'kitchen_top' | 'backsplash' | 'waterfall_edge' | 'vanity' | 'staircase' | 'wall_cladding' | 'pool_edge' | 'fountain' | 'flooring' | 'other';

export interface JobLineItem {
  id: string;
  description: string;
  serviceType: ServiceType;
  materialId?: string;
  materialName?: string;
  // Pricing mode: sq ft OR sheets OR flat unit price (one set per line item)
  sqft?: number;
  pricePerSqFt?: number; // TTD
  sheets?: number;
  pricePerSheet?: number; // TTD
  quantity?: number;
  unitPrice?: number; // TTD flat unit
  lineTotal: number; // TTD
  notes?: string;
}

export interface Job {
  id: string;
  jobNumber: string; // e.g. WOS-2026-001
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  title: string;
  status: JobStatus;
  lineItems: JobLineItem[];
  notes?: string;
  totalAmountTTD: number;
  totalAmountUSD?: number; // derived via exchange rate
  accessToken: string; // UUID used in /quote/[jobId]?token=xxx
  // Invoice fields
  invoiceNumber?: string; // e.g. INV-2026-001
  invoicedAt?: number;
  paymentDueDate?: number;
  paymentTermsDays?: 7 | 14 | 30;
  vatPercent?: number; // 0 or 12.5 (TT VAT rate)
  // Client link (Phase D)
  clientId?: string;
  createdAt: number;
  updatedAt: number;
  acceptedAt?: number;
  completedAt?: number;
  paidAt?: number;
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
