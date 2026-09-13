import { api } from './client';
import { OfficeImage } from '../types';

export async function getPublicOfficeImagesApi(): Promise<OfficeImage[]> {
  try {
    console.log('📥 Fetching public office images from /office-images');
    const res = await api.get<any>('/office-images');
    console.log('📥 Office images response:', res);
    
    // The API returns { status, success, count, data: [...] }
    if (res && res.data && Array.isArray(res.data)) {
      console.log(`✅ Found ${res.data.length} office images`);
      return res.data;
    }
    
    if (Array.isArray(res)) {
      console.log(`✅ Found ${res.length} office images (direct array)`);
      return res;
    }
    
    console.log('⚠️ No office images found, returning empty array');
    return [];
  } catch (error) {
    console.error('❌ Error fetching office images:', error);
    return [];
  }
}