export type Language = 'EN' | 'AR' | 'AM';

export type Currency = 'USD' | 'ETB';

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
  title: string;
  titleAr: string;
  titleAm?: string;
  category: PackageCategory;
  price: number; // USD price
  priceUsd?: number; // USD price alias from API
  durationDays: number;
  departureCity: string;
  inclusions: string[];
  exclusions?: string[];
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  popular?: boolean;
  image: string;
  availableDates: string[];
  itinerary: { day: number; title: string; description: string; titleEn?: string; descriptionEn?: string }[];
  whatsappClicks?: number;
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
  title: string;
  titleAr: string;
  type: 'photo' | 'video';
  imageUrl: string; // Image or Video Thumbnail
  videoUrl?: string; // MP4 video source for video items
  duration?: string; // Video duration e.g. "3:15"
  location: string;
  description: string;
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
