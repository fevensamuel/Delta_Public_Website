// src/api/testimonials.ts
import { api } from './client';
import { Testimonial } from '../types';

export async function getPublicTestimonialsApi(): Promise<Testimonial[]> {
  try {
    console.log('📥 Fetching public testimonials from /testimonials');
    const res = await api.get<any>('/testimonials');
    console.log('📥 Testimonials response:', res);
    
    // The API returns { status, success, count, data: [...] }
    // api.get() returns the parsed JSON, so res is the full response
    if (res && res.data && Array.isArray(res.data)) {
      console.log(`✅ Found ${res.data.length} testimonials`);
      return res.data;
    }
    
    // If the response is directly an array
    if (Array.isArray(res)) {
      console.log(`✅ Found ${res.length} testimonials (direct array)`);
      return res;
    }
    
    console.log('⚠️ No testimonials found, returning empty array');
    return [];
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    return [];
  }
}