// src/api/client.ts
const env = (import.meta as any).env || {};
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
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
  if (!path.startsWith('/')) {
    return `${baseWithoutApi}/uploads/${path}`;
  }
  return `${baseWithoutApi}${path}`;
}

let cachedRate: number | null = null;
let rateLastUpdated: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

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

function safeParseItinerary(itinerary: any): any[] {
  if (!itinerary) return [];
  if (Array.isArray(itinerary)) return itinerary;
  if (typeof itinerary === 'string') {
    try {
      const parsed = JSON.parse(itinerary);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function safeParseArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function safeString(value: any, fallback: string = ''): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  return fallback;
}

export function mapPackageToFrontend(backendPkg: any, rate: number): any {
  const priceUsd = backendPkg.priceUsd || backendPkg.price || 0;
  const priceEtb = backendPkg.priceEtb || 0;
  const priceSar = backendPkg.priceSar || 0;

  const itineraryData = safeParseItinerary(backendPkg.itinerary);
  const inclusionsData = safeParseArray(backendPkg.inclusions);
  const availableDatesData = safeParseArray(backendPkg.availableDates);
  const discountsData = safeParseArray(backendPkg.discounts);

  return {
    id: safeString(backendPkg.id, `pkg-${Date.now()}`),
    titleEn: safeString(backendPkg.titleEn, backendPkg.title || ''),
    titleAr: safeString(backendPkg.titleAr, ''),
    titleAm: safeString(backendPkg.titleAm, ''),
    category: safeString(backendPkg.category, 'Standard'),
    price: priceUsd,
    priceUsd: priceUsd,
    priceEtb: priceEtb,
    priceSar: priceSar,
    priceType: backendPkg.priceType || 'single',
    priceUsdMin: backendPkg.priceUsdMin || null,
    priceUsdMax: backendPkg.priceUsdMax || null,
    priceEtbMin: backendPkg.priceEtbMin || null,
    priceEtbMax: backendPkg.priceEtbMax || null,
    priceSarMin: backendPkg.priceSarMin || null,
    priceSarMax: backendPkg.priceSarMax || null,
    discounts: discountsData,
    durationDays: backendPkg.durationDays || 7,
    departureCity: safeString(backendPkg.departureCity, 'Addis Ababa'),
    inclusions: inclusionsData,
    rating: backendPkg.rating || 4.8,
    reviewsCount: backendPkg.reviewsCount || 0,
    image: safeString(backendPkg.imageUrl, backendPkg.image || ''),
    imageUrl: safeString(backendPkg.imageUrl, backendPkg.image || ''),
    availableDates: availableDatesData,
    itinerary: itineraryData.map((item: any) => ({
      dayNumber: item.dayNumber || item.day || 0,
      title: safeString(item.title, item.titleEn || ''),
      description: safeString(item.description, item.descriptionEn || ''),
      titleEn: safeString(item.titleEn, item.title || ''),
      descriptionEn: safeString(item.descriptionEn, item.description || ''),
    })),
    whatsappClicks: backendPkg.whatsappClicks || 0,
    isActive: backendPkg.isActive !== undefined ? backendPkg.isActive : true,
    createdAt: safeString(backendPkg.createdAt, new Date().toISOString()),
    updatedAt: safeString(backendPkg.updatedAt, new Date().toISOString()),
  };
}

export async function fetchPackages(category?: string): Promise<any[]> {
  try {
    const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await api.get<any>(`/packages${params}`);
    let data = res?.data || [];
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
    const data = res?.data || [];
    const items = Array.isArray(data) ? data : [];
    return items.map((item: any) => {
      // Determine thumbnail URL
      let thumbnailUrl = item.thumbnailUrl || item.imageUrl || '';
      
      // For videos, try to use thumbnailUrl, fallback to imageUrl
      if (item.type === 'video') {
        thumbnailUrl = item.thumbnailUrl || item.imageUrl || '';
      }
      
      return {
        ...item,
        thumbnailUrl: thumbnailUrl,
        // For videos, imageUrl should be the thumbnail (for display in grid)
        imageUrl: item.type === 'video' ? thumbnailUrl : item.imageUrl,
        videoUrl: item.videoUrl || '',
      };
    });
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

// ============================================================
// PUBLIC API FUNCTIONS
// ============================================================

/**
 * Get all active FAQs from the backend
 */
export async function getFaqsApi(): Promise<any[]> {
  try {
    const res = await api.get<any>('/faqs');
    return res?.data || [];
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error);
    return [];
  }
}

/**
 * Get all active social links from the backend
 */
export async function getPublicSocialLinksApi(): Promise<any[]> {
  try {
    const res = await api.get<any>('/social-links');
    return res?.data || [];
  } catch (error) {
    console.error('❌ Error fetching social links:', error);
    return [];
  }
}

/**
 * Get all active team members from the backend
 */
export async function getPublicTeamMembersApi(): Promise<any[]> {
  try {
    const res = await api.get<any>('/team-members');
    return res?.data || [];
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    return [];
  }
}