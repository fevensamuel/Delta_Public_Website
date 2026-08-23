// src/types.ts
export type Language = 'EN' | 'AR' | 'AM';

export type Currency = 'USD' | 'ETB' | 'SAR';

export type PageId = 
  | 'home' 
  | 'about' 
  | 'packages' 
  | 'hotels-flights' 
  | 'gallery' 
<<<<<<< HEAD
  | 'faqs'
  | 'office' 
=======
  | 'faqs'  
>>>>>>> 92dfad2bcb1bc4a01ca92195b7057a11bf89c73d
  | 'contact';

export type PackageCategory = 'Economy' | 'Standard' | 'Premium' | 'VIP';
export type PriceType = 'single' | 'range';
export type DiscountType = 'percentage' | 'fixed';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
}

// Discount structure
export interface Discount {
  id: string;
  type: DiscountType;
  value: number;
  discountedPriceUsd?: number;
  discountedPriceEtb?: number;
  discountedPriceSar?: number;
  label: string;
  labelAr?: string;
  description?: string;
  minPersons?: number;
  maxPersons?: number;
  ageGroup?: string;
  isActive: boolean;
}

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
  
  // Price type
  priceType?: PriceType;
  
  // Price range
  priceUsdMin?: number;
  priceUsdMax?: number;
  priceEtbMin?: number;
  priceEtbMax?: number;
  priceSarMin?: number;
  priceSarMax?: number;
  
  // Discounts
  discounts?: Discount[];
  
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

<<<<<<< HEAD
=======
// Package FAQ 
export interface PackageFAQ {
  id: string;
  packageId: string;
  questions: FAQItem[];
}

>>>>>>> 92dfad2bcb1bc4a01ca92195b7057a11bf89c73d
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

export interface OfficeImage {
  id: string;
  title?: string;
  imageUrl: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  textAr?: string;
  date: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}