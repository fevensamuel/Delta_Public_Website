// src/types.ts
export type StandardLanguage = 'en' | 'am' | 'ar';
export type Language = 'en' | 'am' | 'ar' | 'EN' | 'AM' | 'AR';

export interface LanguageOption {
  code: StandardLanguage;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  fontClass: string;
}

export type Currency = 'USD' | 'ETB' | 'SAR';

export type PageId = 
  | 'home' 
  | 'about' 
  | 'packages' 
  | 'hotels-flights' 
  | 'gallery' 
  | 'faqs'
  | 'office'
  | 'contact';

export type PackageCategory = 'Economy' | 'Standard' | 'Premium' | 'VIP';
export type PriceType = 'single' | 'range';
export type DiscountType = 'percentage' | 'fixed';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  titleEn?: string;
  titleAr?: string;
  titleAm?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  descriptionAm?: string;
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
  labelEn?: string;
  labelAr?: string;
  labelAm?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  descriptionAm?: string;
  minPersons?: number;
  maxPersons?: number;
  ageGroup?: string;
  ageGroupEn?: string;
  ageGroupAr?: string;
  ageGroupAm?: string;
  ageMin?: number;
  ageMax?: number;
  discountType: 'age' | 'group' | 'general';
  isActive: boolean;
}

export interface PackageItem {
  id: string;
  title?: string;
  titleEn: string;
  titleAr: string;
  titleAm?: string;
  category: PackageCategory;
  categoryEn?: string;
  categoryAr?: string;
  categoryAm?: string;
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
  departureCityEn?: string;
  departureCityAr?: string;
  departureCityAm?: string;
  inclusions: string[];
  inclusionsEn?: string[];
  inclusionsAr?: string[];
  inclusionsAm?: string[];
  exclusions?: string[];
  exclusionsEn?: string[];
  exclusionsAr?: string[];
  exclusionsAm?: string[];
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
  status?: 'Active' | 'Inactive' | 'Archived';
  createdAt?: string;
  updatedAt?: string;
}

// FAQ Item
export interface FAQItem {
  id: string;
  question: string;  
  answer: string;
  questionEn?: string;
  questionAr?: string;
  questionAm?: string;
  answerEn?: string;
  answerAr?: string;
  answerAm?: string;
  category?: string;
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
  nameEn?: string;
  nameAr?: string;
  nameAm?: string;
  role: string;
  roleEn?: string;
  roleAr?: string;
  roleAm?: string;
  bio: string;
  bioEn?: string;
  bioAr?: string;
  bioAm?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SmsSubscriber {
  id?: string;
  phone: string;
  name?: string;
  email?: string;
  channel?: string;
  packageInterestId?: string;
  language?: StandardLanguage | string;
  subscribedAt?: string;
}

export interface InquiryForm {
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  source?: string;
  language?: StandardLanguage | string;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleAr?: string;
  titleAm?: string;
  type: 'photo' | 'video';
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: string;
  location: string;
  locationEn?: string;
  locationAr?: string;
  locationAm?: string;
  description: string;
  descriptionEn?: string;
  descriptionAr?: string;
  descriptionAm?: string;
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
  nameEn?: string;
  nameAr?: string;
  nameAm?: string;
  location: string;
  locationEn?: string;
  locationAr?: string;
  locationAm?: string;
  rating: number;
  text: string;
  textEn?: string;
  textAr?: string;
  textAm?: string;
  date: string;
  packageTaken?: string;
  packageTakenEn?: string;
  packageTakenAr?: string;
  packageTakenAm?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}