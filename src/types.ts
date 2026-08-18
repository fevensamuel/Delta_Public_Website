// src/types.ts
export type Language = 'EN' | 'AR' | 'AM';

export type Currency = 'USD' | 'ETB' | 'SAR';

export type PageId = 
  | 'home' 
  | 'about' 
  | 'packages' 
  | 'hotels-flights' 
  | 'gallery' 
  | 'faqs'  
  | 'contact';

export type PackageCategory = 'Economy' | 'Standard' | 'Premium' | 'VIP';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
}

export interface PackageItem {
  id: string;
  titleEn: string;
  titleAr: string;
  titleAm?: string;
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
  itinerary: ItineraryDay[];
  whatsappClicks?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// FAQ Item
export interface FAQItem {
  id: string;
  question: string;  
  answer: string;    
}

// Package FAQ 
export interface PackageFAQ {
  id: string;
  packageId: string;
  questions: FAQItem[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  thumbnailUrl?: string;
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