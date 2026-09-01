import React, { useState, useEffect, useCallback } from 'react';
import { 
  PackageItem, 
  Language, 
  Currency,
  PageId, 
  Testimonial,
  GalleryItem
} from '../types';
import { translations } from '../translations';
import { formatPrice, formatPriceRange } from '../utils/formatPrice';
import { subscribePhoneSms, trackAndOpenWhatsApp, fetchPackages, fetchGalleryItems, getFullImageUrl } from '../api/client';
import { useExchangeRate } from '../api/exchangeRate';;
import { getPublicTestimonialsApi } from '../api/testimonials';
import { 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  Users, 
  Award, 
  Clock, 
  Send, 
  ArrowRight, 
  Hotel, 
  Plane, 
  MessageSquare,
  Bell,
  Box,
  FileText,
  Building,
  UserCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Video,
  Image as ImageIcon,
  Play,
  Trophy,
  MapPin,
  Mail,
  Phone,
  Package,
  Building2,
  Shield,
  Headphones
} from 'lucide-react';

interface HomeProps {
  setActivePage: (page: PageId) => void;
  onSelectPackage: (pkg: PackageItem) => void;
  onSubscribeSms: (phone: string) => void;
  lang: Language;
  currency: Currency;
}

// Fallback testimonials in case API fails
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fallback-1',
    name: 'Ahmed Mohammed',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'An unforgettable spiritual journey! Delta Travel made our Umrah experience seamless and stress-free.',
    textAr: 'رحلة روحية لا تنسى! جعلت دلتا ترافيل تجربة العمرة لدينا سلسة وخالية من الإجهاد.',
    date: '2026-01-15',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    name: 'Fatima Zewde',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'The best travel agency for Umrah! Everything was perfectly organized from flights to accommodations.',
    textAr: 'أفضل وكالة سفر للعمرة! كل شيء كان منظمًا بشكل مثالي من الرحلات إلى الإقامة.',
    date: '2026-01-20',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    name: 'Bilal Ibrahim',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'I highly recommend Delta Travel for anyone planning Umrah. The team was professional and responsive.',
    textAr: 'أنصح بشدة دلتا ترافيل لأي شخص يخطط للعمرة. كان الفريق محترفًا ومستجيبًا.',
    date: '2026-02-01',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const Home: React.FC<HomeProps> = ({
  setActivePage,
  onSelectPackage,
  onSubscribeSms,
  lang,
  currency
}) => {
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Data states
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  // Use useCallback to memoize the load function
  const loadHomeData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading home data...');
      
      const [pkgData, galData, testimonialData] = await Promise.all([
        fetchPackages(),
        fetchGalleryItems('all'),
        getPublicTestimonialsApi().catch((err) => {
          console.error('❌ Testimonials API error:', err);
          return [];
        })
      ]);
      
      console.log('📦 Packages loaded:', pkgData.length);
      console.log('🖼️ Gallery loaded:', galData.length);
      console.log('💬 Testimonials loaded:', testimonialData.length);
      
      setPackages(pkgData.slice(0, 4));
      setGallery(galData.slice(0, 6));
      
      if (testimonialData && testimonialData.length > 0) {
        const validTestimonials = testimonialData.filter((t: any) => t.name && t.text);
        if (validTestimonials.length > 0) {
          setTestimonials(validTestimonials);
          setActiveTestimonialIdx(0);
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } else {
        setTestimonials(FALLBACK_TESTIMONIALS);
      }
    } catch (e) {
      console.error('❌ Home data loading error:', e);
      setTestimonials(FALLBACK_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // Listen for focus events to refresh when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Tab became visible - refreshing home data');
        loadHomeData();
      }
    };

    const handleFocus = () => {
      console.log('🔄 Window focused - refreshing home data');
      loadHomeData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadHomeData]);

  const handleSmsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    try {
      await subscribePhoneSms({
        phone: phoneInput,
        email: emailInput || undefined,
        channel: 'Web Banner'
      }, lang);
    } catch {
      // Fallback
    }
    onSubscribeSms(phoneInput);
    setSubscribedMessage(true);
    setPhoneInput('');
    setEmailInput('');
    setTimeout(() => setSubscribedMessage(false), 5000);
  };

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials.length > 0 ? testimonials[activeTestimonialIdx] : FALLBACK_TESTIMONIALS[0];

  const isVideo = (item: any): boolean => {
    return item.type === 'Video' || item.type === 'video';
  };

  // Helper to get display price (handles both single and range)
  const getDisplayPrice = (pkg: PackageItem) => {
    const priceUsd = pkg.priceUsd ?? pkg.price;
    const priceEtb = pkg.priceEtb;
    const priceSar = pkg.priceSar;
    
    // Check if it's a range
    const hasRange = pkg.priceType === 'range' || (pkg.priceUsdMax && pkg.priceUsdMax > priceUsd);
    
    if (hasRange) {
      return formatPriceRange(
        pkg.priceUsdMin ?? priceUsd,
        pkg.priceUsdMax ?? priceUsd,
        pkg.priceEtbMin ?? priceEtb,
        pkg.priceEtbMax ?? priceEtb,
        pkg.priceSarMin ?? priceSar,
        pkg.priceSarMax ?? priceSar,
        currency,
        lang,
        rate
      );
    }
    
    return formatPrice(priceUsd, priceEtb, priceSar, currency, lang, rate);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
        <p className="text-xs font-semibold">Loading homepage...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 bg-[#F9F9F9] text-slate-800">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1920')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:to-white/30 rtl:bg-gradient-to-l" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
          <div className="max-w-xl space-y-5">
            <p className="text-xs sm:text-sm font-extrabold text-[#C8102E] tracking-widest uppercase">
              {t.licensedBadge}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-sans text-slate-900 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {t.heroSubTitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage('packages')}
                className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <span>{t.explorePackages}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
             <button
  onClick={() => trackAndOpenWhatsApp(undefined, 'General Umrah Inquiry')}
  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-lg shadow transition-all flex items-center gap-2 border border-emerald-700"
>
  {/* WhatsApp SVG Icon */}
  <svg 
    className="w-4 h-4 fill-white" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  <span>{t.chatWhatsapp}</span>
</button>
            </div>
          </div>
        </div>
      </section>

  {/* QUICK BENEFITS BAR - 4 Columns */}
<div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
  <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-slate-100">
    
    {/* Best Packages */}
    <div className="flex items-center gap-3 p-2">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">Best Packages</h4>
        <p className="text-[10px] text-slate-500">Affordable & Premium</p>
      </div>
    </div>

    {/* Flights */}
    <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2 sm:pl-4">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">Flights</h4>
        <p className="text-[10px] text-slate-500">Best Airlines</p>
      </div>
    </div>

    {/* 24/7 Support */}
    <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2 sm:pl-4">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">24/7 Support</h4>
        <p className="text-[10px] text-slate-500">We are Here</p>
      </div>
    </div>

    {/* Trusted Agency */}
    <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2 sm:pl-4">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">Trusted Agency</h4>
        <p className="text-[10px] text-slate-500">100% Reliable</p>
      </div>
    </div>

  </div>
</div>

      {/* BEST UMRAH PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-[#C8102E] tracking-widest uppercase">
              {t.bestPackagesTitle}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {t.packages}
            </h2>
          </div>
          <button
            onClick={() => setActivePage('packages')}
            className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8102E] rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const imageUrl = pkg.imageUrl ? getFullImageUrl(pkg.imageUrl) : '';
            const hasDiscounts = pkg.discounts && pkg.discounts.length > 0;
            const displayPrice = getDisplayPrice(pkg);

            return (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={pkg.titleEn} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow">
                      {pkg.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {lang === 'AR' ? pkg.titleAr : (lang === 'AM' && pkg.titleAm) ? pkg.titleAm : pkg.titleEn}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pkg.durationDays} Days</span>
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-slate-400">{t.perPerson}</span>
                        <span className="text-base font-extrabold text-[#C8102E]">
                          {displayPrice}
                        </span>
                      </div>
                      {hasDiscounts && (
                        <div className="mt-1.5 space-y-0.5">
                          {pkg.discounts?.filter(d => d.isActive !== false).map((discount, idx) => (
                            <div key={idx} className="text-[9px] text-emerald-600 font-medium">
                              {discount.label}: {discount.type === 'percentage' ? `${discount.value}% off` : `$${discount.value} off`}
                              {discount.minPersons && ` (${discount.minPersons}+ persons)`}
                              {discount.ageGroup && ` (${discount.ageGroup})`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

{/* AIRLINE PARTNERS */}
<section className="max-w-7xl mx-auto px-4 sm:px-8">
  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Official Flight Partners
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-0.5">
          Fly Directly to Makkah & Madinah
        </h2>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Ethiopian Airlines */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between space-y-4 group min-h-[280px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/airlines/ethiopian.jpg)' }}
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇪🇹</span>
              <div>
                <h3 className="font-extrabold text-black text-xl drop-shadow-lg">Ethiopian Airlines</h3>
                <span className="text-sm text-black font-semibold drop-shadow-lg">IATA: ET • Star Alliance</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p><strong className="text-white">Hub:</strong> Addis Ababa Bole Intl (ADD)</p>
            <p><strong className="text-white">Baggage:</strong> 30kg + 7kg carry-on</p>
            <p><strong className="text-white">In-Flight:</strong> Hot meals, beverages, and special meals</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-lg">10 weekly flights to JED</span>
            <span className="text-sm text-white italic drop-shadow-lg">National Carrier</span>
          </div>
        </div>
      </div>

      {/* Turkish Airlines */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between space-y-4 group min-h-[280px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/airlines/turkish.jpg)' }}
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇹🇷</span>
              <div>
                <h3 className="font-extrabold text-black text-xl drop-shadow-lg">Turkish Airlines</h3>
                <span className="text-sm text-black font-semibold drop-shadow-lg">IATA: TK • Star Alliance</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p><strong className="text-white">Hub:</strong> Istanbul Airport (IST)</p>
            <p><strong className="text-white">Baggage:</strong> 30kg + 8kg carry-on</p>
            <p><strong className="text-white">In-Flight:</strong> Hot meals, beverages, and special meals</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-lg">7 weekly flights</span>
            <span className="text-sm text-white italic drop-shadow-lg">Global Network</span>
          </div>
        </div>
      </div>

      {/* Flynas */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between space-y-4 group min-h-[280px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/airlines/flynas.jpg)' }}
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇸🇦</span>
              <div>
                <h3 className="font-extrabold text-black text-xl drop-shadow-lg">Flynas</h3>
                <span className="text-sm text-black font-semibold drop-shadow-lg">IATA: XY • Low-Cost Carrier</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p><strong className="text-white">Hub:</strong> King Khalid Intl (RUH)</p>
            <p><strong className="text-white">Baggage:</strong> 25kg + 7kg carry-on</p>
            <p><strong className="text-white">In-Flight:</strong> Snacks and beverages (buy on board)</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-lg">10 weekly flights</span>
            <span className="text-sm text-white italic drop-shadow-lg">Affordable Option</span>
          </div>
        </div>
      </div>

      {/* Emirates */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between space-y-4 group min-h-[280px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/airlines/emirates.jpg)' }}
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇦🇪</span>
              <div>
                <h3 className="font-extrabold text-black text-xl drop-shadow-lg">Emirates</h3>
                <span className="text-sm text-black font-semibold drop-shadow-lg">IATA: EK • Skytrax 5-Star</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p><strong className="text-white">Hub:</strong> Dubai Intl (DXB)</p>
            <p><strong className="text-white">Baggage:</strong> 30kg + 7kg carry-on</p>
            <p><strong className="text-white">In-Flight:</strong> Gourmet meals, beverages, and special meals</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-lg">14 weekly flights</span>
            <span className="text-sm text-white italic drop-shadow-lg">Premium Experience</span>
          </div>
        </div>
      </div>

      {/* Etihad Airways */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between space-y-4 group min-h-[280px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/airlines/etihad.jpg)' }}
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇦🇪</span>
              <div>
                <h3 className="font-extrabold text-black text-xl drop-shadow-lg">Etihad Airways</h3>
                <span className="text-sm text-black font-semibold drop-shadow-lg">IATA: EY • Skytrax 4-Star</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p><strong className="text-white">Hub:</strong> Abu Dhabi Intl (AUH)</p>
            <p><strong className="text-white">Baggage:</strong> 30kg + 7kg carry-on</p>
            <p><strong className="text-white">In-Flight:</strong> Premium meals, beverages, and special meals</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-lg">7 weekly flights</span>
            <span className="text-sm text-white italic drop-shadow-lg">Luxury Travel</span>
          </div>
        </div>
      </div>

      {/* Flydubai */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between space-y-4 group min-h-[280px]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: 'url(/airlines/flydubai.jpg)' }}
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇦🇪</span>
              <div>
                <h3 className="font-extrabold text-black text-xl drop-shadow-lg">Flydubai</h3>
                <span className="text-sm text-black font-semibold drop-shadow-lg">IATA: FZ • Low-Cost Carrier</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-white bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p><strong className="text-white">Hub:</strong> Dubai Intl (DXB)</p>
            <p><strong className="text-white">Baggage:</strong> 20kg + 7kg carry-on</p>
            <p><strong className="text-white">In-Flight:</strong> Snacks and beverages (buy on board)</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-lg">7 weekly flights</span>
            <span className="text-sm text-white italic drop-shadow-lg">Budget Friendly</span>
          </div>
        </div>
      </div>
    </div>

{/* Direct Assistance CTA - Contact via WhatsApp/Phone only */}
<section className="max-w-7xl mx-auto px-4 sm:px-8">
  <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 shadow-sm">
    <div className="space-y-1 text-center md:text-left rtl:md:text-right">
      <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider flex items-center gap-1 justify-center md:justify-start">
        <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" /> Dedicated Flight Support
      </span>
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Need Custom Flight Bookings or Group Seats?</h3>
    </div>

    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
      <button
        onClick={() => trackAndOpenWhatsApp(undefined, 'Flight Booking Inquiry')}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>Inquiry</span>
      </button>
      <a
        href="tel:+251911234567"
        className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors flex items-center gap-2"
      >
        <Phone className="w-4 h-4" />
        <span>Call</span>
      </a>
    </div>
  </div>
</section>

  </div>
</section>

       {/* Office Info Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#C8102E]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Our Location</h3>
                  <p className="text-sm text-slate-600">
                    Bole Friendship Building, 4th Floor, Office 408
                    <br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
      
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#C8102E]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Office Hours</h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Monday – Saturday:</span> 2:30 AM – 11:30 PM LT
                    <br />
                    <span className="font-semibold">Sunday & Holidays:</span> On-call WhatsApp Assistance
                  </p>
                </div>
      
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#C8102E]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Contact Us</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#C8102E]" />
                      <a href="tel:+251910136747" className="hover:text-[#C8102E]">+251 910 136 747</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C8102E]" />
                      <a href="mailto:info@deltatravel.com" className="hover:text-[#C8102E]">info@deltatravel.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

      {/* RECENT GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">Media Highlights</span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">Recent Gallery Uploads</h2>
            </div>
            <button
              onClick={() => setActivePage('gallery')}
              className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gallery.slice(0, 6).map((item) => {
              const isVideoItem = isVideo(item);
              const displayImage = isVideoItem ? (item.thumbnailUrl || item.imageUrl) : item.imageUrl;
              const fullImageUrl = displayImage ? getFullImageUrl(displayImage) : '';
              
              return (
                <div 
                  key={item.id} 
                  className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer group"
                  onClick={() => setActivePage('gallery')}
                >
                  {fullImageUrl ? (
                    <img 
                      src={fullImageUrl} 
                      alt={item.titleEn} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : isVideoItem ? (
                    <div className="w-full h-full bg-[#111827] flex items-center justify-center">
                      <Video className="w-8 h-8 text-[#C8102E] opacity-50" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#F9FAFB] flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#718096] opacity-50" />
                    </div>
                  )}
                  
                  {isVideoItem && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#C8102E]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-[10px] text-white font-bold truncate">{item.titleEn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4-COLUMN FEATURE & UPDATES */}
<section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    
    {/* Column 1 - SMS Updates */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#C8102E]">
          <Bell className="w-4 h-4 fill-[#C8102E]" />
        </div>
        <h3 className="font-bold text-sm text-slate-900">{t.smsBannerTitle}</h3>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">
        {t.smsBannerSub}
      </p>
      <form onSubmit={handleSmsFormSubmit} className="space-y-2 pt-1">
        <input
          type="tel"
          required
          placeholder={t.enterPhonePlaceholder}
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          className="w-full bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
        >
          <span>{t.subscribeBtn}</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
      {subscribedMessage && (
        <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
          {t.smsSubscribedToast}
        </p>
      )}
    </div>

    {/* Column 2 - Why Choose Us */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-4">
      <h3 className="font-bold text-sm text-slate-900">{t.whyChooseTitle}</h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] text-slate-900">{t.feature1Title}</p>
            <p className="text-[10px] text-slate-500">{t.feature1Desc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] text-slate-900">{t.feature5Title}</p>
            <p className="text-[10px] text-slate-500">{t.feature5Desc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] text-slate-900">{t.feature2Title}</p>
            <p className="text-[10px] text-slate-500">{t.feature2Desc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] text-slate-900">{t.feature7Title}</p>
            <p className="text-[10px] text-slate-500">{t.feature7Desc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] text-slate-900">{t.feature4Title}</p>
            <p className="text-[10px] text-slate-500">{t.feature4Desc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[11px] text-slate-900">{t.feature3Title}</p>
            <p className="text-[10px] text-slate-500">{t.feature3Desc}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Column 3 - Testimonials */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900">{t.reviewsTitle}</h3>
        <Quote className="w-5 h-5 text-red-500 fill-red-100" />
      </div>
      {currentReview && (
        <>
          <p className="text-xs text-slate-600 italic leading-relaxed">
            "{lang === 'AR' ? (currentReview.textAr || currentReview.text) : currentReview.text}"
          </p>
          <div className="flex items-center gap-0.5 text-red-500 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < (currentReview.rating || 5) ? 'fill-red-500 text-red-500' : 'fill-slate-200 text-slate-200'}`} />
            ))}
          </div>
          <p className="text-[11px] font-bold text-slate-900">- {currentReview.name}</p>
          <p className="text-[10px] text-slate-500">{currentReview.location || 'Delta Travel'}</p>
        </>
      )}
      <div className="flex items-center justify-between pt-2">
        <button onClick={prevTestimonial} className="p-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-center gap-1">
          {testimonials.map((_, idx) => (
            <span key={idx} className={`rounded-full ${idx === activeTestimonialIdx ? 'w-2 h-2 bg-red-600' : 'w-1.5 h-1.5 bg-slate-300'}`} />
          ))}
        </div>
        <button onClick={nextTestimonial} className="p-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    {/* Column 4 - Achievements */}
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-4">
      <h3 className="font-bold text-sm text-slate-900">Our Achievements</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-900">25,000+</p>
            <p className="text-[10px] text-slate-500">{t.statPilgrims}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-900">5+</p>
            <p className="text-[10px] text-slate-500">{t.statYears}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-900">100+</p>
            <p className="text-[10px] text-slate-500">{t.statDepartures}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-900">24/7</p>
            <p className="text-[10px] text-slate-500">{t.statSupport}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-900">27</p>
            <p className="text-[10px] text-slate-500">Successful Rounds</p>
          </div>
        </div>
      </div>

      <a
        href="https://www.google.com/maps/place/Delta+Travel/@8.9898287,38.785905,17z/data=!4m8!3m7!1s0x164b85372f9878d1:0x1385d361c5cfcdd9!8m2!3d8.9898287!4d38.785905!9m1!1b1!16s%2Fg%2F11zbgfkl8j?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-5 py-3.5 rounded-lg shadow transition-all flex items-center gap-2 justify-center"
      >
        <Star className="w-4 h-4 fill-current" />
        <span>Review Us on Google</span>
      </a>
    </div>

  </div>
</section>

    </div>
  );
};