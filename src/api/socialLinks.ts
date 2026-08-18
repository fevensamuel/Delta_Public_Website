// src/api/socialLinks.ts
import { api } from './client';
import { SocialLink } from '../types';

export async function getPublicSocialLinksApi(): Promise<SocialLink[]> {
  try {
    const res = await api.get('/social-links');
    // Backend returns { status, success, data: [...] }
    return res?.data || [];
  } catch (error) {
    console.error('❌ Error fetching public social links:', error);
    return [];
  }
}