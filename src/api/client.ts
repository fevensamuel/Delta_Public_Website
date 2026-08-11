// src/api/client.ts
const env = (import.meta as any).env || {};
const API_BASE_URL = env.VITE_API_URL || 'http://localhost:3000/api';
const WHATSAPP_PHONE = env.VITE_WHATSAPP_PHONE || '251911223344';

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

// Helper to get full image URL
export function getFullImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('data:')) {
    return path;
  }
  const baseWithoutApi = API_BASE_URL.replace(/\/api$/, '');
  if (path.startsWith('/uploads')) {
    return `${baseWithoutApi}${path}`;
  }
  return `${baseWithoutApi}/uploads/${path}`;
}

// Exchange rate state
let cachedRate: number | null = null;
let rateLastUpdated: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getExchangeRateFromAPI(): Promise<number> {
  if (cachedRate && rateLastUpdated && (Date.now() - rateLastUpdated < CACHE_DURATION)) {
    return cachedRate;
  }

  try {
    const res = await api.get<any>('/exchange-rate');
    const rate = res?.data?.rate || 159.98;
    cachedRate = rate;
    rateLastUpdated = Date.now();
    return rate;
  } catch (e) {
    console.warn('Exchange rate API error, using fallback:', e);
    return 159.98;
  }
}

// Convert backend package to frontend PackageItem with correct prices
export function mapPackageToFrontend(backendPkg: any, rate: number): any {
  const priceUsd = backendPkg.priceUsd || backendPkg.price || 0;
  const priceEtb = backendPkg.priceEtb || Math.round(priceUsd * rate);
  const priceSar = backendPkg.priceSar || Math.round(priceUsd * 3.75);

  return {
    id: backendPkg.id,
    titleEn: backendPkg.titleEn || backendPkg.title || '',
    titleAr: backendPkg.titleAr || '',
    titleAm: backendPkg.titleAm || '',
    category: backendPkg.category || 'Standard',
    price: priceUsd,
    priceUsd: priceUsd,
    priceEtb: priceEtb,
    priceSar: priceSar,
    durationDays: backendPkg.durationDays || 7,
    departureCity: backendPkg.departureCity || 'Addis Ababa',
    inclusions: backendPkg.inclusions || [],
    rating: backendPkg.rating || 4.8,
    reviewsCount: backendPkg.reviewsCount || 0,
    image: backendPkg.imageUrl || backendPkg.image || '',
    imageUrl: backendPkg.imageUrl || backendPkg.image || '',
    availableDates: backendPkg.availableDates || [],
    itinerary: (backendPkg.itinerary || []).map((item: any) => ({
      day: item.day || item.dayNumber || 0,
      title: item.title || item.titleEn || '',
      description: item.description || item.descriptionEn || '',
      titleEn: item.titleEn || item.title || '',
      descriptionEn: item.descriptionEn || item.description || '',
    })),
    whatsappClicks: backendPkg.whatsappClicks || 0,
    isActive: backendPkg.isActive !== undefined ? backendPkg.isActive : true,
    createdAt: backendPkg.createdAt || '',
    updatedAt: backendPkg.updatedAt || '',
  };
}

export async function fetchPackages(category?: string): Promise<any[]> {
  try {
    const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await api.get<any>(`/packages${params}`);
    let data = res?.data || res || [];
    if (!Array.isArray(data)) data = [];
    const rate = await getExchangeRateFromAPI();
    return data.map((pkg: any) => mapPackageToFrontend(pkg, rate));
  } catch (e) {
    console.warn('Packages API error:', e);
    return [];
  }
}

export async function fetchPackageById(id: string): Promise<any | null> {
  try {
    const res = await api.get<any>(`/packages/${id}`);
    const data = res?.data || res;
    if (data) {
      const rate = await getExchangeRateFromAPI();
      return mapPackageToFrontend(data, rate);
    }
    return null;
  } catch (e) {
    console.warn(`Package ${id} API error:`, e);
    return null;
  }
}

export async function submitInquiry(payload: {
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  source?: string;
  preferredPackageId?: string;
}) {
  try {
    return await api.post('/inquiries', payload);
  } catch (e) {
    console.warn('Inquiry post error:', e);
    return { success: true, ref: `INQ-${Date.now()}` };
  }
}

export async function subscribeSms(payload: {
  phone: string;
  name?: string;
  email?: string;
  channel?: string;
  packageInterestId?: string;
} | string, lang: string = 'EN') {
  try {
    let body: any;
    if (typeof payload === 'string') {
      body = { phone: payload, name: '', email: '', channel: 'Web Banner' };
    } else {
      body = { channel: 'Web Banner', ...payload };
    }
    return await api.post('/subscribers', body);
  } catch (e) {
    console.warn('Subscribers post error:', e);
    return { success: true };
  }
}

export const subscribePhoneSms = subscribeSms;

export async function fetchGalleryItems(typeFilter: 'all' | 'photo' | 'video' = 'all'): Promise<any[]> {
  try {
    const params = typeFilter !== 'all' ? `?type=${typeFilter}` : '';
    const res = await api.get<any>(`/gallery${params}`);
    const data = res?.data || res || [];
    // Map thumbnailUrl from backend
    const items = Array.isArray(data) ? data : [];
    return items.map((item: any) => ({
      ...item,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl,
    }));
  } catch (e) {
    console.warn('Gallery API error:', e);
    return [];
  }
}

export async function trackAndOpenWhatsApp(packageId?: string, packageTitle?: string, priceUsd?: number) {
  if (packageId) {
    try {
      await fetch(`${API_BASE_URL}/packages/${packageId}/click-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
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