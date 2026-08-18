// src/api/faqs.ts
import { api } from './client';
import { FAQItem } from '../types';

export async function getFaqsApi(): Promise<FAQItem[]> {
  try {
    const res = await api.get('/faqs');
    // Backend returns { status, success, count, data: [...] }
    return res?.data || [];
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error);
    return [];
  }
}