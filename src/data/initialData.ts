// src/data/initialData.ts
import { PackageItem, SmsSubscriber, GalleryItem, Testimonial } from '../types';

// Packages are now fetched from the backend – no mock data
export const INITIAL_PACKAGES: PackageItem[] = [];

export const INITIAL_SUBSCRIBERS: SmsSubscriber[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

// Testimonials – static for now (can be fetched from backend later)
export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sheikh Ibrahim Omar',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'Alhamdulillah, Delta Travel made our Umrah journey so smooth! From flight bookings to full Mutawwif guide support in Makkah.',
    textAr: 'الحمد لله، جعلت شركة دلتا للسفريات رحلة العمرة سلسة للغاية! من حجز الطيران إلى الإرشاد في مكة والمدينة.',
    packageTaken: 'Standard Comfort Umrah Package',
    date: 'June 2026',
    avatar: ''
  },
  {
    id: 't2',
    name: 'Amina Yassin',
    location: 'Dire Dawa, Ethiopia',
    rating: 5,
    text: 'As a woman traveling with my family, security and organization were my top priorities. Delta Travel exceeded all expectations.',
    textAr: 'بصفتي امرأة تسافر مع عائلتي، كانت السلامة والتنظيم من أهم أولوياتي. لقد فاقت شركة دلتا كل توقعاتنا.',
    packageTaken: 'Premium Group Umrah Package',
    date: 'May 2026',
    avatar: ''
  }
];