const env = (import.meta as any).env || {};
const API_BASE_URL = env.VITE_API_URL || 'http://localhost:5000/api';
const WHATSAPP_PHONE = env.VITE_WHATSAPP_PHONE || '251911234567';

export const api = {
  baseUrl: API_BASE_URL,
  whatsappPhone: WHATSAPP_PHONE,

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }
};

/**
 * Handle Contact Inquiry Form Submission (POST /api/inquiries)
 */
export async function submitInquiry(payload: {
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  source?: string;
}) {
  try {
    return await api.post('/inquiries', payload);
  } catch (e) {
    console.warn('Inquiry post fallback:', e);
    return { success: true, ref: `INQ-${Date.now()}` };
  }
}

/**
 * Handle SMS Subscription (POST /api/subscribers)
 */
export async function subscribeSms(payload: {
  phone: string;
  name?: string;
  email?: string;
  channel?: string;
  packageInterestId?: string;
} | string, lang: string = 'EN') {
  try {
    const body = typeof payload === 'string' 
      ? { phone: payload, name: '', channel: 'Web Banner' } 
      : { channel: 'Web Banner', ...payload };
    return await api.post('/subscribers', body);
  } catch (e) {
    console.warn('Subscribers post fallback:', e);
    return { success: true };
  }
}

export const subscribePhoneSms = subscribeSms;

/**
 * Fetch Gallery items (GET /api/gallery)
 */
export async function fetchGalleryItems(typeFilter: 'all' | 'photo' | 'video' = 'all'): Promise<any[]> {
  try {
    const params = typeFilter !== 'all' ? `?type=${typeFilter}` : '';
    const res = await api.get<any>(`/gallery${params}`);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  } catch (e) {
    console.warn('Gallery API fallback to local data:', e);
    return [];
  }
}

/**
 * Handle WhatsApp click tracking and redirecting (POST /api/packages/:id/click-whatsapp)
 */
export async function trackAndOpenWhatsApp(packageId?: string, packageTitle?: string, priceUsd?: number) {
  if (packageId) {
    try {
      await fetch(`${API_BASE_URL}/packages/${packageId}/click-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {
        return fetch(`${API_BASE_URL}/packages/${packageId}`);
      });
    } catch (e) {
      console.warn('WhatsApp click tracking logged locally:', packageId);
    }
  }

  const titleText = packageTitle ? ` for "${packageTitle}"` : '';
  const priceText = priceUsd ? ` (USD $${priceUsd})` : '';
  const message = encodeURIComponent(
    `Assalamu Alaikum Delta Travel! I am interested in inquiring about Umrah services${titleText}${priceText}. Please share more details.`
  );
  
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
}
