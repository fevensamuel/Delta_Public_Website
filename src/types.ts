// src/types.ts
export type Language = 'EN' | 'AR' | 'AM' | 'OM';

export type Currency = 'USD' | 'ETB' | 'SAR';

export type PageId = 
  | 'home' 
  | 'about' 
  | 'packages' 
  | 'hotels-flights' 
  | 'gallery' 
  | 'contact';

export type PackageCategory = 'Economy' | 'Standard' | 'Premium' | 'VIP';

export interface PackageItem {
  id: string;
  titleEn: string;
  titleAr: string;
  titleAm?: string;
  titleOm?: string;
  category: PackageCategory;
  price: number;
  priceUsd?: number;
  priceEtb?: number;
  priceSar?: number;
  durationDays: number;
  departureCity: string;
  inclusions: string[];
  exclusions?: string[];
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  popular?: boolean;
  image: string;
  imageUrl?: string;
  availableDates: string[];
  itinerary: { 
    day: number; 
    title: string; 
    description: string; 
    titleEn?: string; 
    descriptionEn?: string;
    dayNumber?: number;
  }[];
  whatsappClicks?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SmsSubscriber {
  id?: string;
  phone: string;
  email?: string;
  channel?: string;
  packageInterestId?: string;
  subscribedAt?: string;
}

export interface InquiryForm {
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  source?: string;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleAr: string;
  type: 'photo' | 'video';
  imageUrl: string;
  thumbnailUrl?: string; // ADDED: For video thumbnails
  videoUrl?: string;
  duration?: string;
  location: string;
  description: string;
  isActive?: boolean;
  sortOrder?: number;
  uploadDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  textAr: string;
  packageTaken: string;
  date: string;
  avatar: string;
}