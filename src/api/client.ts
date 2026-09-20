// src/api/client.ts
import { LANGUAGE_STORAGE_KEY } from '../i18n/config';

const env = (import.meta as any).env || {};
const API_BASE_URL = env.VITE_API_URL || 'http://localhost:3000/api';
const WHATSAPP_PHONE = env.VITE_WHATSAPP_PHONE || '+251910493349 ';

export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  }
  return 'en';
}

export const api = {
  baseUrl: API_BASE_URL,
  whatsappPhone: WHATSAPP_PHONE,

  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const lang = getCurrentLanguage();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Accept-Language': lang,
        ...headers
      }
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  },

  async post<T>(endpoint: string, data: any, headers: Record<string, string> = {}): Promise<T> {
    const lang = getCurrentLanguage();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept-Language': lang,
        ...headers
      },
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

export function mapPackageToFrontend(backendPkg: any, rate: number, activeLang?: string): any {
  const currentLang = (activeLang || getCurrentLanguage()).toLowerCase();
  const priceUsd = backendPkg.priceUsd || backendPkg.price || 0;
  const priceEtb = backendPkg.priceEtb || 0;
  const priceSar = backendPkg.priceSar || 0;

  const itineraryData = safeParseItinerary(backendPkg.itinerary);
  const inclusionsData = safeParseArray(backendPkg.inclusions);
  const inclusionsArData = safeParseArray(backendPkg.inclusionsAr);
  const inclusionsAmData = safeParseArray(backendPkg.inclusionsAm);
  const exclusionsData = safeParseArray(backendPkg.exclusions);
  const exclusionsArData = safeParseArray(backendPkg.exclusionsAr);
  const exclusionsAmData = safeParseArray(backendPkg.exclusionsAm);
  const availableDatesData = safeParseArray(backendPkg.availableDates);

  const discountsData = safeParseArray(backendPkg.discounts).map((d: any) => ({
    id: d.id || `disc-${Date.now()}`,
    type: d.type || 'percentage',
    value: d.value || 0,
    discountedPriceUsd: d.discountedPriceUsd || 0,
    discountedPriceEtb: d.discountedPriceEtb || 0,
    discountedPriceSar: d.discountedPriceSar || 0,
    label: currentLang.startsWith('ar') && d.labelAr ? d.labelAr :
           currentLang.startsWith('am') && d.labelAm ? d.labelAm :
           (d.label || 'Discount'),
    labelEn: d.labelEn || d.label || 'Discount',
    labelAr: d.labelAr || '',
    labelAm: d.labelAm || '',
    description: currentLang.startsWith('ar') && d.descriptionAr ? d.descriptionAr :
                 currentLang.startsWith('am') && d.descriptionAm ? d.descriptionAm :
                 (d.description || ''),
    descriptionEn: d.descriptionEn || d.description || '',
    descriptionAr: d.descriptionAr || '',
    descriptionAm: d.descriptionAm || '',
    minPersons: d.minPersons || undefined,
    maxPersons: d.maxPersons || undefined,
    ageGroup: currentLang.startsWith('ar') && d.ageGroupAr ? d.ageGroupAr :
              currentLang.startsWith('am') && d.ageGroupAm ? d.ageGroupAm :
              (d.ageGroup || undefined),
    ageGroupEn: d.ageGroupEn || d.ageGroup || undefined,
    ageGroupAr: d.ageGroupAr || '',
    ageGroupAm: d.ageGroupAm || '',
    ageMin: d.ageMin || undefined,
    ageMax: d.ageMax || undefined,
    discountType: d.discountType || 'general',
    isActive: d.isActive !== undefined ? d.isActive : true
  }));

  // Resolve localized inclusions & exclusions
  const localizedInclusions = 
    currentLang.startsWith('ar') && inclusionsArData.length > 0 ? inclusionsArData :
    currentLang.startsWith('am') && inclusionsAmData.length > 0 ? inclusionsAmData :
    inclusionsData;

  const localizedExclusions = 
    currentLang.startsWith('ar') && exclusionsArData.length > 0 ? exclusionsArData :
    currentLang.startsWith('am') && exclusionsAmData.length > 0 ? exclusionsAmData :
    exclusionsData;

  const localizedDepartureCity =
    currentLang.startsWith('ar') && backendPkg.departureCityAr ? backendPkg.departureCityAr :
    currentLang.startsWith('am') && backendPkg.departureCityAm ? backendPkg.departureCityAm :
    safeString(backendPkg.departureCity, 'Addis Ababa');

  const localizedCategory =
    currentLang.startsWith('ar') && backendPkg.categoryAr ? backendPkg.categoryAr :
    currentLang.startsWith('am') && backendPkg.categoryAm ? backendPkg.categoryAm :
    safeString(backendPkg.category, 'Standard');

  const localizedTitle =
    currentLang.startsWith('ar') && backendPkg.titleAr ? backendPkg.titleAr :
    currentLang.startsWith('am') && backendPkg.titleAm ? backendPkg.titleAm :
    safeString(backendPkg.titleEn, backendPkg.title || '');

  return {
    id: safeString(backendPkg.id, `pkg-${Date.now()}`),
    title: localizedTitle,
    titleEn: safeString(backendPkg.titleEn, backendPkg.title || ''),
    titleAr: safeString(backendPkg.titleAr, ''),
    titleAm: safeString(backendPkg.titleAm, ''),
    category: localizedCategory,
    categoryEn: safeString(backendPkg.categoryEn, backendPkg.category || 'Standard'),
    categoryAr: safeString(backendPkg.categoryAr, ''),
    categoryAm: safeString(backendPkg.categoryAm, ''),
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
    departureCity: localizedDepartureCity,
    departureCityEn: safeString(backendPkg.departureCityEn, backendPkg.departureCity || 'Addis Ababa'),
    departureCityAr: safeString(backendPkg.departureCityAr, ''),
    departureCityAm: safeString(backendPkg.departureCityAm, ''),
    inclusions: localizedInclusions,
    inclusionsEn: inclusionsData,
    inclusionsAr: inclusionsArData,
    inclusionsAm: inclusionsAmData,
    exclusions: localizedExclusions,
    exclusionsEn: exclusionsData,
    exclusionsAr: exclusionsArData,
    exclusionsAm: exclusionsAmData,
    rating: backendPkg.rating || 4.8,
    reviewsCount: backendPkg.reviewsCount || 0,
    image: safeString(backendPkg.imageUrl, backendPkg.image || ''),
    imageUrl: safeString(backendPkg.imageUrl, backendPkg.image || ''),
    availableDates: availableDatesData,
    itinerary: itineraryData.map((item: any) => {
      const itemTitle =
        currentLang.startsWith('ar') && item.titleAr ? item.titleAr :
        currentLang.startsWith('am') && item.titleAm ? item.titleAm :
        safeString(item.title, item.titleEn || '');

      const itemDesc =
        currentLang.startsWith('ar') && item.descriptionAr ? item.descriptionAr :
        currentLang.startsWith('am') && item.descriptionAm ? item.descriptionAm :
        safeString(item.description, item.descriptionEn || '');

      return {
        dayNumber: item.dayNumber || item.day || 0,
        title: itemTitle,
        description: itemDesc,
        titleEn: safeString(item.titleEn, item.title || ''),
        titleAr: safeString(item.titleAr, ''),
        titleAm: safeString(item.titleAm, ''),
        descriptionEn: safeString(item.descriptionEn, item.description || ''),
        descriptionAr: safeString(item.descriptionAr, ''),
        descriptionAm: safeString(item.descriptionAm, ''),
      };
    }),
    whatsappClicks: backendPkg.whatsappClicks || 0,
    isActive: backendPkg.isActive !== undefined ? backendPkg.isActive : true,
    createdAt: safeString(backendPkg.createdAt, new Date().toISOString()),
    updatedAt: safeString(backendPkg.updatedAt, new Date().toISOString()),
  };
}

export async function fetchPackages(category?: string, lang?: string): Promise<any[]> {
  try {
    const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await api.get<any>(`/packages${params}`);
    let data = res?.data || [];
    if (!Array.isArray(data)) data = [];
    const rate = await getExchangeRateFromAPI();
    return data.map((pkg: any) => mapPackageToFrontend(pkg, rate, lang));
  } catch (e) {
    console.warn('Packages API error:', e);
    return [];
  }
}

export async function fetchPackageById(id: string, lang?: string): Promise<any | null> {
  try {
    const res = await api.get<any>(`/packages/${id}`);
    const data = res?.data || res;
    if (data) {
      const rate = await getExchangeRateFromAPI();
      return mapPackageToFrontend(data, rate, lang);
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
  language?: string;
}) {
  try {
    const lang = payload.language || getCurrentLanguage();
    return await api.post('/inquiries', { ...payload, language: lang });
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
  language?: string;
} | string, lang?: string) {
  try {
    const currentLang = lang || (typeof payload === 'object' && payload.language ? payload.language : getCurrentLanguage());
    let body: any;
    if (typeof payload === 'string') {
      body = { phone: payload, name: '', email: '', channel: 'Web Banner', language: currentLang };
    } else {
      body = { channel: 'Web Banner', language: currentLang, ...payload };
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

export function getWhatsAppInquiryMessage(packageTitle?: string, priceUsd?: number, lang?: string): string {
  const currentLang = (lang || getCurrentLanguage()).toLowerCase();
  if (currentLang.startsWith('ar')) {
    const pkgText = packageTitle ? ` بخصوص "${packageTitle}"` : '';
    const priceText = priceUsd ? ` (بقيمة $${priceUsd} دولار)` : '';
    return `السلام عليكم دلتا للسياحة! أود الاستفسار عن باقات وخدمات العمرة${pkgText}${priceText}. يرجى تزويدي بمزيد من التفاصيل.`;
  }
  if (currentLang.startsWith('am')) {
    const pkgText = packageTitle ? ` ስለ "${packageTitle}"` : '';
    const priceText = priceUsd ? ` ($${priceUsd} ዶላር)` : '';
    return `ስለ ኡምራ አገልግሎት${pkgText}${priceText} ዝርዝር መረጃ ማግኘት እፈልጋለሁ። እባክዎ ተጨማሪ መረጃ ያጋሩኝ።`;
  }
  const titleText = packageTitle ? ` for "${packageTitle}"` : '';
  const priceText = priceUsd ? ` (USD $${priceUsd})` : '';
  return `I am interested in inquiring about Umrah services${titleText}${priceText}. Please share more details.`;
}

export async function trackAndOpenWhatsApp(packageId?: string, packageTitle?: string, priceUsd?: number, lang?: string) {
  if (packageId) {
    try {
      await fetch(`${API_BASE_URL}/packages/${packageId}/click-whatsapp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept-Language': lang || getCurrentLanguage()
        }
      }).catch(() => {});
    } catch (e) {
      console.warn('WhatsApp click tracking logged locally:', packageId);
    }
  }

  const message = encodeURIComponent(getWhatsAppInquiryMessage(packageTitle, priceUsd, lang));
  const cleanPhone = WHATSAPP_PHONE.replace(/[^0-9]/g, '');
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
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